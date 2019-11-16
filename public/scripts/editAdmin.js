module.exports = function(){
    var express = require('express');
    var router = express.Router();

    var isAdmin = require('../../adminCheck.js');

    // Get the email (aka account username) from the database based on the id sent with the request

    function getEmail(req, res, mysql, context, complete) {
        var sql = "SELECT email FROM users WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400).end();
            }

            context.email = results[0].email;
            complete();
        });

    }

    function editAdmin (req, res, mysql, complete) {
        var sql = "UPDATE users SET email = ? WHERE id = ?";
        var inserts = [req.body.Email, req.body.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if(error){
                res.write(JSON.stringify(error));
                res.status(400).end();
            }

            else {
                complete();
            }
        });
    }


    router.get('/:id', isAdmin, function(req, res) {

        var callbackCount = 0;
        let context = {};
        context.adminPage = true;
        context.id = req.params.id;     // Stored in a hidden input field, used later in edit process
        var mysql = req.app.get('mysql');
        getEmail(req, res, mysql, context, complete);
        function complete(){    // Each "setup" function calls this function to signal that it is finished
            callbackCount++;
            if(callbackCount >= 1){
                res.render('editAdmin', context);  // Only render when context is all setup
            }
        }
    });


    // Using POST as method because PUT is not supported by HTML forms

    router.post('/', isAdmin, function(req, res) {
        let mysql = req.app.get('mysql');
        var callbackCount = 0;
        editAdmin(req, res, mysql, complete);
        function complete() {
            callbackCount++;
            if(callbackCount >= 1) {
                res.redirect('/viewAdmins');
            }
        }
    });



    return router;
}();