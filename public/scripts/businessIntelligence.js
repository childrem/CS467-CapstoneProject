module.exports = function(){
    var express = require('express');
    var router = express.Router();

    var Chart = require('chart.js');

    //const { Parser } = require('json2csv');
    const { AsyncParser } = require('json2csv');

    var isAdmin = require('../../adminCheck.js');


    function createAwardByMonthObject(month) {
        this.month = month;
        this.award_count = 0;       // Will be incremented as needed
    }


    function getAwardsByMonthCSV(res, mysql, dataToSendShell, complete) {
        // Populate the dataToSend array of objects

        dataToSendShell.dataToSend.push(new createAwardByMonthObject("January"));
        dataToSendShell.dataToSend.push(new createAwardByMonthObject("February")); 
        dataToSendShell.dataToSend.push(new createAwardByMonthObject("March"));
        dataToSendShell.dataToSend.push(new createAwardByMonthObject("April"));
        dataToSendShell.dataToSend.push(new createAwardByMonthObject("May"));
        dataToSendShell.dataToSend.push(new createAwardByMonthObject("June"));
        dataToSendShell.dataToSend.push(new createAwardByMonthObject("July"));
        dataToSendShell.dataToSend.push(new createAwardByMonthObject("August"));
        dataToSendShell.dataToSend.push(new createAwardByMonthObject("September"));
        dataToSendShell.dataToSend.push(new createAwardByMonthObject("October"));
        dataToSendShell.dataToSend.push(new createAwardByMonthObject("November"));
        dataToSendShell.dataToSend.push(new createAwardByMonthObject("December"));

        console.log("dataToSend in the get function");
        console.log(dataToSendShell.dataToSend);


        complete();
    }


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

                        var sqlForAwardCount = "SELECT u.id, u.email AS `email`, a.user_id AS `user_id`, COUNT(*) AS `awardCount` FROM awards a INNER JOIN users u ON u.id = a.user_id WHERE a.user_id = ?;";

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

    function getAmountOfEachType(res, mysql, dataToSend, complete) {

        // Get the list of award types from the database for the X-axis

        mysql.pool.query("SELECT id, award_type FROM award_types;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            else {
                var xAxisValues = [];
                for(item of results){
                    xAxisValues.push(item.award_type);
                }

                dataToSend.xAxis = xAxisValues;
                dataToSend.label = "# of awards of each type";
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

                //console.log(xAxisValues);

                // Now we need the number of each award type in the database

                var sqlForAwardTypeCount = "SELECT awdt.id, awdt.award_type AS `award_type_name`, a.award_type_id AS `award_type`, COUNT(*) AS `typeCount` FROM awards a INNER JOIN award_types awdt ON awdt.id = a.award_type_id WHERE a.award_type_id = ?;";

                var yAxisValues = [];
                for(let i=0; i < xAxisValues.length; i++){
                    yAxisValues[i] = 0;
                }

                var numQueriesDone = 0;
                var numQueriesNeeded = xAxisValues.length;

                for(item of results){
                    var inserts = [item.id];
                    mysql.pool.query(sqlForAwardTypeCount, inserts, function(error, results, fields) {
                        if(error){
                            res.write(JSON.stringify(error));
                            res.end();
                        }

                        else {
                            var locationToAdd = xAxisValues.indexOf(results[0].award_type_name);
                            yAxisValues[locationToAdd] = results[0].typeCount;
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

    function getAmountByMonth(res, mysql, dataToSend, complete) {

        // Get an array of integers representing the months of the year

        mysql.pool.query("SELECT MONTH(award_date) AS `award_months` FROM awards;", function(error, results, fields) {
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            else {
                var xAxisValues = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var yAxisValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

                // Increment the count of each month by 1 as it's seen

                for(item of results) {
                    var monthToIncrease = item.award_months;
                    yAxisValues[monthToIncrease - 1] = yAxisValues[monthToIncrease - 1] + 1;
                }

                dataToSend.xAxis = xAxisValues;
                dataToSend.label = "# of awards given in month";
                dataToSend.yAxis = yAxisValues;

                dataToSend.backgroundColor = [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ];

                dataToSend.borderColor = [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ];

                complete();

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
        var callbackCount = 0;
        var dataToSend = {};
        var mysql = req.app.get('mysql');
        getAmountOfEachType(res, mysql, dataToSend, complete);

        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                var formattedDataToSend = JSON.stringify(dataToSend);
                res.send(formattedDataToSend);
            }
        }

        //var dataToSend = {"xAxis": ["user1", "user2", "user3", "user4", "user5", "user6"]};
        //var formattedDataToSend = JSON.stringify(dataToSend);
        //res.send(formattedDataToSend);
    });


    router.get('/awardsByMonth', isAdmin, function(req, res) {
        var callbackCount = 0;
        var dataToSend = {};
        var mysql = req.app.get('mysql');
        getAmountByMonth(res, mysql, dataToSend, complete);

        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                var formattedDataToSend = JSON.stringify(dataToSend);
                res.send(formattedDataToSend);
            }
        }
    });

    router.get('/getUserAwardCountCSV', isAdmin, function(req, res) {
        var fields = ['car', 'price', 'color'];
        var sampleData = [
            {
                "car": "Audi",
                "price": 1,
                "color": "blue"
            },
            {
                "car": "BMW",
                "price": 2,
                "color": "black"
            }
        ];

        const json2csvParser = new Parser({fields});
        const csv = json2csvParser.parse(sampleData);

        res.setHeader('Content-disposition', 'attachment; filename=sample.csv');
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csv);



        /*
        json2csv({data: sampleData, fields: fields}, function(err, csv){
            if(err){
                console.log(err);

            }
            else{
                res.setHeader('Content-disposition', 'attachment; filename=sample.csv');
                res.set('Content-Type', 'text/csv');
                res.status(200).send(csv);
            }
        });
        */
        //console.log("You've reached the download page!");
        //res.end();
    });


    // Number of awards by type CSV handler

    router.get('/getAwardTypeCSV', isAdmin, function(req, res){

    });


    // Number of awards by month CSV handler

    router.get('/getAwardMonthsCSV', isAdmin, function(req, res){
        var callbackCount = 0;
        var dataToSendShell = {};   // So changes persist
        dataToSendShell.dataToSend = [];

        const fields = ['month', 'award_count'];
        const opts = { fields };
        const transformOpts = { highWaterMark: 8192 };
        const asyncParser = new AsyncParser(opts, transformOpts);

        var mysql = req.app.get('mysql');
        getAwardsByMonthCSV(res, mysql, dataToSendShell, complete);

        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                var formattedDataToSend = JSON.stringify(dataToSendShell.dataToSend);

                console.log("Formatted Data To Send At the end");
                console.log(formattedDataToSend);

                let csv = '';
                asyncParser.processor
                .on('data', chunk => csv += chunk.toString())
                .on('end', () => {
                    res.setHeader('Content-disposition', 'attachment; filename=awards_by_month.csv');
                    res.set('Content-Type', 'text/csv');
                    res.status(200).send(csv);
                })
                .on('error', err => console.error(err));

                asyncParser.input.push(formattedDataToSend);
                asyncParser.input.push(null);

                //res.setHeader('Content-disposition', 'attachment; filename=awards_by_month.csv');
                //res.set('Content-Type', 'text/csv');
                //res.status(200).send(csv);

                /*

                try {
                    const parser = new Parser(opts);
                    const csv = parser.parse(formattedDataToSend);
                    res.setHeader('Content-disposition', 'attachment; filename=awards_by_month.csv');
                    res.set('Content-Type', 'text/csv');
                    res.status(200).send(csv);     
                }

                catch (err) {
                    console.error(err);
                }

                */
                //const csv = json2csvParser.parse(formattedDataToSend);

                //res.setHeader('Content-disposition', 'attachment; filename=awards_by_month.csv');
                //res.set('Content-Type', 'text/csv');
                //res.status(200).send(csv);
            }
        }

    });
    
    
    return router;
}();