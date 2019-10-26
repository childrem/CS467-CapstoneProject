module.exports = function(){
    var express = require('express');
    var isAdmin = require('../../adminCheck.js')
    var router = express.Router();
    var bcrypt = require('bcrypt');
    var mysql = require('../../dbcon.js');
    const saltRounds = 10;

  
  // Display the admin homepage
  
  router.get('/', isAdmin, function(req, res){
        let context = {};
        context.adminPage = true;
        res.render('addGeneralUser', context);
    });
  router.post("/", isAdmin, function(req, res){
    bcrypt.hash(req.body.Password, saltRounds, function (err,   hash) {
      var date = new Date().toISOString().slice(0, 19).replace('T', ' ');

      mysql.pool.query("INSERT INTO users (user_name, password, email, date_created, role_id ) VALUES (?,?,?,?,?)", [req.body.user_name, hash, req.body.Email, date, 1], function(err, result){
      if(err){
        next(err);
        return;
      };
    });
  });
});
    return router;
}();