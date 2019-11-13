module.exports = function(){
    var express = require('express');
    var router = express.Router();

    var Chart = require('chart.js');

    var isAdmin = require('../../adminCheck.js');


    function getAwardCountData(res, mysql, dataToSend, complete) {
        // Get the list of general users in the database

        mysql.pool.query("SELECT id FROM roles WHERE role = 'general';", function(error, results, fields) {
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            else {
                var generalUserRoleId = results[0].id;
                var sqlForGeneralUsers = "SELECT id, email FROM users WHERE role_id = ? ORDER BY id";
                var inserts = [generalUserRoleId];
                
                sqlForGeneralUsers = mysql.pool.query(sqlForGeneralUsers, inserts, function(error, results, fields) {
                    if(error){
                        res.write(JSON.stringify(error));
                        res.end();
                    }

                    else {
                        var xAxisValues = [];
                        for(item of results){
                            xAxisValues.push(item.email);
                        }

                        dataToSend.xAxis = xAxisValues;
                        dataToSend.label = "# of awards created";
                        dataToSend.backgroundColor = [];
                        dataToSend.borderColor = [];

                        for(let i=0; i < xAxisValues.length; i++){
                            if(i % 2 === 0) {
                                dataToSend.backgroundColor.push('rgba(255, 99, 132, 0.2)');
                                dataToSend.borderColor.push('rgba(255, 99, 132, 1)');
                            }

                            else{
                                dataToSend.backgroundColor.push('rgba(54, 162, 235, 0.2)');
                                dataToSend.borderColor.push('rgba(54, 162, 235, 1)');
                            }
                        }

                        // Now need to get the number of awards each user created

                        var sqlForAwardCount = "SELECT u.id, u.email AS `email`, a.user_id AS `user_id`, COUNT(*) AS `awardCount` FROM awards a INNER JOIN users u ON u.id = a.user_id WHERE a.user_id = ?;"

                        var yAxisValues = [];
                        for(let i=0; i < xAxisValues.length; i++){
                            yAxisValues[i] = 0;
                        }

                        var numQueriesDone = 0;
                        var numQueriesNeeded = xAxisValues.length;

                        //var locationToAdd = 0;

                        for(item of results){
                            var inserts = [item.id];
                            mysql.pool.query(sqlForAwardCount, inserts, function(error, results, fields) {
                                if(error){
                                    res.write(JSON.stringify(error));
                                    res.end();
                                }

                                else {
                                    var locationToAdd = xAxisValues.indexOf(results[0].email);
                                    yAxisValues[locationToAdd] = results[0].awardCount;
                                    numQueriesDone++;
                                    if(numQueriesDone === numQueriesNeeded){
                                        dataToSend.yAxis = yAxisValues;
                                        
        
                                        complete();
                                    }
                                }
                            });

                        }

                    }
                });
            }
        });

    }

  
  // Display the business intelligence page (came from regular browser call - NOT chart request)
  
  router.get('/', isAdmin, function(req, res){
        let context = {};
        context.adminPage = true;
        context.jsscripts = ["chartBuilder.js"];

        res.render('businessIntelligence', context);
    });


    // Comes from AJAX on client side

    router.get('/awardCount', isAdmin, function(req, res) {
        var callbackCount = 0;
        var dataToSend = {};
        var mysql = req.app.get('mysql');
        getAwardCountData(res, mysql, dataToSend, complete);

        function complete() {   // Send formatted data when everything in dataToSend is correctly set up
            callbackCount++;
            if (callbackCount >= 1) {
                var formattedDataToSend = JSON.stringify(dataToSend);
                res.send(formattedDataToSend);
            }
        }

    });


    router.get('/amountOfEachType', isAdmin, function(req, res) {
        var dataToSend = {"xAxis": ["user1", "user2", "user3", "user4", "user5", "user6"]};
        var formattedDataToSend = JSON.stringify(dataToSend);
        res.send(formattedDataToSend);
    });
    
    
    return router;
}();