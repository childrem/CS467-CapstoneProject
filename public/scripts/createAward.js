module.exports = function(){
    var express = require('express');
	var isGeneral = require('../../generalUserCheck.js');
    var router = express.Router();
	var mailer = require('./mailer.js');

    function getAwardTypes(res, mysql, context, complete) {
		mysql.pool.query("SELECT id, award_type FROM award_types;", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			
			context.types = results;
			complete();
		});
    }
	
	function postAward(req, res, mysql, complete) {
        let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
		let inputDate = req.body.date + " " + req.body.time + ":00";
		let inserts = [req.session.user_id, req.body.type, req.body.name, req.body.email, inputDate, date];
		mysql.pool.query("INSERT INTO awards (user_id, award_type_id, recipient, recipient_email, award_date, award_create_date) VALUES (?,?,?,?,?,?);", inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			
			var mail = new mailer();
			var mailOptions = {
				from: 'cchincinfo@gmail.com', // sender address
				to: req.body.email, // list of receivers
				subject:  "CCH Awards: Congratulations on your award!", // Subject line
				html: "<p>You have been granted an award! View the attached PDF for details.</p>"// plain text body
			};
     
			mail.SendMail(mailOptions);
			
			complete();
		})
	}
	
	router.get('/', isGeneral, function(req, res){
		var callbackCount = 0;
		let context = {};
		var mysql = req.app.get('mysql');
		getAwardTypes(res, mysql, context, complete);
		context.userPage = true;
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
          		res.render('createAward', context);
            }
        }
	});
	
  
    router.post('/', isGeneral, function(req, res){
        let mysql = req.app.get('mysql');
        let callbackCount = 0;
        postAward(req, res, mysql, complete);
        function complete() {
            callbackCount++;
            if(callbackCount >= 1) {
                res.redirect('/userHome');
            }
        }
    });

    return router;
}();