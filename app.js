
var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var mysql = require('./dbcon.js');
var nodemailer = require('nodemailer');

const PORT = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', PORT);
//Implementation for static found here:
//https://expressjs.com/en/starter/static-files.html


app.use('/adminHome', require('./public/scripts/adminHome.js'));
app.use('/addAdminUser', require('./public/scripts/addAdminUser.js'));
app.use('/addGeneralUser', require('./public/scripts/addGeneralUser.js'));
app.use('/businessIntelligence', require('./public/scripts/businessIntelligence.js'));
app.use('/viewAdmins', require('./public/scripts/viewAdmins.js'));
app.use('/viewGeneralUsers', require('./public/scripts/viewGeneralUsers.js'));



app.use('/static', express.static('public'));

app.get('/',function(req,res,next){
 
    res.render('home');

});

app.get('/GetUsers',function(req,res){
  
  mysql.pool.query("Select * From users", function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    res.status(200).json(rows);
  });
});

app.get('/SendMail',function(req,res){
  
  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log(info);
  });
  res.status(200);
  
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: 'cchincinfo@gmail.com',
         pass: 'E=^8-!@TD&X%mi9*2?YH'
     }
 });

 const mailOptions = {
  from: 'cchincinfo@gmail.com', // sender address
  to: 'eric.croom@gmail.com', // list of receivers
  subject: 'Node Mailer Test', // Subject line
  html: '<p>Testing out this app email.</p>'// plain text body
};

 

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});