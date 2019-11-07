module.exports = function(){
    var express = require('express');
    var router = express.Router();

    var Chart = require('chart.js');

    var isAdmin = require('../../adminCheck.js');

  
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

    router.get('/chartSample', isAdmin, function(req, res) {
        var dataToSend = {"xAxis": ["test1", "test2", "test3", "test4", "test5", "test6"]};
        var formattedDataToSend = JSON.stringify(dataToSend);
        res.send(formattedDataToSend);
    });


    router.get('/chartSample2', isAdmin, function(req, res) {
        var dataToSend = {"xAxis": ["user1", "user2", "user3", "user4", "user5", "user6"]};
        var formattedDataToSend = JSON.stringify(dataToSend);
        res.send(formattedDataToSend);
    });
    
    
    return router;
}();