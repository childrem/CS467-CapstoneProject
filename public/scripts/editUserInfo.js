module.exports = function(){
    var express = require('express');
	var isGeneral = require('../../generalUserCheck.js');
    var router = express.Router();
	var bcrypt = require('bcrypt');
	const saltRounds = 10;
	
    function getInfo(req, res, mysql, context, complete) {
        var sql = "SELECT email, user_name FROM users WHERE id = ?";
        var inserts = [req.session.user_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400).end();
            }

			context.email = results[0].email;
            context.user_name = results[0].user_name;
            complete();
        });

    }


    function editInfo(req, res, mysql, complete) {
		bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
			var sql = "UPDATE users SET email = ?, user_name = ?, password = ? WHERE id = ?";
			var inserts = [req.body.email, req.body.user_name, hash, req.session.user_id];
			sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
				if(error) {
					res.write(JSON.stringify(error));
					res.status(400).end();
				}

				else {
					complete();
				}
			});
		})
	}

    router.get('/', isGeneral, function(req, res) {
        var callbackCount = 0;
        let context = {};
        context.userPage = true;
        var mysql = req.app.get('mysql');
        getInfo(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('editUserInfo', context);
            }
        }
    });

    router.post('/', isGeneral, function(req, res) {
        let mysql = req.app.get('mysql');
        var callbackCount = 0;
        editInfo(req, res, mysql, complete);
        function complete() {
            callbackCount++;
            if(callbackCount >= 1) {
                res.redirect('/userHome');
            }
        }
    });


    return router;
}();