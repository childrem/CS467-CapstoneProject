module.exports = function(){

  var express = require('express');
  var router = express.Router();

  var isAdmin = require('../../adminCheck.js');
  var bcrypt = require('bcrypt');
  const saltRounds = 10;

  
  function postGeneralUser(req, res, mysql, complete) {
    mysql.pool.query("SELECT id FROM roles WHERE role = 'general';", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }

        complete();

        bcrypt.hash(req.body.Password, saltRounds, function (err, hash) {
            let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            let sql = "INSERT INTO users (user_name, password, email, date_created, role_id, signature_path ) VALUES (?,?,?,?,?,?);";
            let inserts = [req.body.user_name, hash, req.body.Email, date, results[0].id, req.body.Signature];
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
    });
}

  


  // Display the add general user form.  Idea for the complete() function was obtained from code from CS340.
  
  router.get('/', isAdmin, function(req, res){
        let context = {};
        context.adminPage = true;
        res.render('addGeneralUser', context);
    });


    router.post('/', isAdmin, function(req, res){
      let mysql = req.app.get('mysql');
      let callbackCount = 0;
      postGeneralUser(req, res, mysql, complete);
      function complete() {
          callbackCount++;
          if(callbackCount >= 2) {
              res.redirect('/viewGeneralUsers');
          }
      }
  });

    return router;
}();