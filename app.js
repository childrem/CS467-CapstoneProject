
var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var mysql = require('./dbcon.js');
var session = require('express-session');

var mailer = require('./public/scripts/mailer.js');

const PORT = process.env.PORT || 5000

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', PORT);
app.set('mysql', mysql);
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
 
    //res.render('home');
    res.render('landingPage');

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
  
  var myMail = new mailer();
  myMail.SendMail();
  
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



 

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});