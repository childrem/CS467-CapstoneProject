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
                var sqlForGeneralUsers = "SELECT id, user_name FROM users WHERE role_id = ? ORDER BY id";
                var inserts = [generalUserRoleId];
                
                sqlForGeneralUsers = mysql.pool.query(sqlForGeneralUsers, inserts, function(error, results, fields) {
                    if(error){
                        res.write(JSON.stringify(error));
                        res.end();
                    }

                    else {
                        var xAxisValues = [];
                        for(item of results){
                            xAxisValues.push(item.user_name);
                        }

                        dataToSend.xAxis = xAxisValues;

                        complete();
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


        //var dataToSend = {"generateChart": "false"}     // we don't generate a chart when they first get to the page
        //var formattedDataToSend = JSON.stringify(dataToSend);
        //res.send(formattedDataToSend);

        //let data = {"xAxis": ["test1", "test2", "test3", "test4", "test5", "test6"]};
        //res.json(data);

        //context.chartType = 'bar';
        //context.xAxis = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
        //context.chartLabel = '# of Votes';
        //context.yAxis = [12, 19, 3, 5, 2, 3];

        res.render('businessIntelligence', context);
    });


    // Comes from AJAX on client side

    router.get('/awardCount', isAdmin, function(req, res) {
        var callbackCount = 0;
        var dataToSend = {};
        var mysql = req.app.get('mysql');
        getAwardCountData(res, mysql, dataToSend, complete);
        //var dataToSend = {"xAxis": ["test1", "test2", "test3", "test4", "test5", "test6"]};

        function complete() {   // Send formatted data when everything in dataToSend is correctly set up
            callbackCount++;
            if (callbackCount >= 1) {
                var formattedDataToSend = JSON.stringify(dataToSend);
                res.send(formattedDataToSend);
            }
        }

        //var formattedDataToSend = JSON.stringify(dataToSend);
        //res.send(formattedDataToSend);
    });


    router.get('/chartSample2', isAdmin, function(req, res) {
        var dataToSend = {"xAxis": ["user1", "user2", "user3", "user4", "user5", "user6"]};
        var formattedDataToSend = JSON.stringify(dataToSend);
        res.send(formattedDataToSend);
    });
    
    
    return router;
}();