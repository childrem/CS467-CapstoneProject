module.exports = function(){
    var express = require('express');
    var router = express.Router();

    var isAdmin = require('../../adminCheck.js');

    // Get general user data to display in table

    function getGeneralUsers(res, mysql, context, complete){
        mysql.pool.query("SELECT id, role_id, email AS `Username`, user_name AS `FullName`, date_created AS `TimeCreated` FROM users WHERE role_id = 11;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.generalUsers = results;
            complete();
        });
    }
  
  // Display view general users page
  
  router.get('/', isAdmin, function(req, res){
        let callbackCount = 0;  // Keeps track of "setup" functions completing their tasks
        let context = {};
        let mysql = req.app.get('mysql');
        context.adminPage = true;
        getGeneralUsers(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('viewGeneralUsers', context);
            }
        }
    });
    
    
    return router;
}();