module.exports = function(){
    var express = require('express');
    var router = express.Router();

    var isAdmin = require('../../adminCheck.js');

  
    function postAdmin(req, res, mysql, complete) {
        mysql.pool.query("SELECT id FROM roles WHERE role = 'admin';", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            complete();

            let sql = "INSERT INTO users (email, password, role_id, date_created) VALUES (?,?,?,?);";
            let inserts = [req.body.Email, req.body.Password, results[0].id, new Date()];
            sql = mysql.pool.query(sql, inserts, function(error, results, fields){
                if(error) {
                    res.write(JSON.stringify(error));
                    res.end();
                }

                else {
                    complete();
                }
            });
        });
    }


  // Display the admin homepage
  
  router.get('/', isAdmin, function(req, res){
        let context = {};
        context.adminPage = true;
        res.render('addAdminUser', context);
    });
    

    // When user submits a new admin's information, add it to database and send them back to the admin table

    router.post('/', isAdmin, function(req, res){
        let mysql = req.app.get('mysql');
        let callbackCount = 0;
        postAdmin(req, res, mysql, complete);
        function complete() {
            callbackCount++;
            if(callbackCount >= 2) {
                res.redirect('/viewAdmins');
            }
        }
        //let sql = "INSERT INTO users (email, password, role_id) VALUES (?,?,?);";
        //let inserts = [req.body.Email, req.body.Password, 1];   // role_id is 1 because this is an admin user

    });
    
    return router;
}();