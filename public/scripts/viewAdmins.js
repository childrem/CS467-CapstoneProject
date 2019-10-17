module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getAdmins(res, mysql, context, complete) {
        mysql.pool.query("SELECT id, role_id, email AS `Username`, date_created AS `TimeCreated` FROM users WHERE role_id = 1;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.admins = results;
            complete();
        });

    }

  // Display the view admins page
  
  router.get('/', function(req, res){
        // When page loads, display the admin users
        var callbackCount = 0;  // Makes sure all of our functions finish before rendering the page with the context
        let context = {};
        var mysql = req.app.get('mysql');
        getAdmins(res, mysql, context, complete);
        context.adminPage = true;
        function complete(){    // Each "setup" function calls this function to signal that it is finished
            callbackCount++;
            if(callbackCount >= 1){
                res.render('viewAdmins', context);  // Only render when context is all setup
            }
        }
    });
    
    
    return router;
}();