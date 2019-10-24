
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
<<<<<<< HEAD
app.use('/', require('./public/scripts/landingPage.js'));
=======
app.use('/userHome', require('./public/scripts/userHome.js'));
app.use('/editUserInfo', require('./public/scripts/editUserInfo.js'));
app.use('/createAward', require('./public/scripts/createAward.js'));
app.use('/awards', require('./public/scripts/awards.js'));
app.use('/addAwardCategory', require('./public/scripts/addAwardCategory.js'));
app.use('/currentEmployeeMonth', require('./public/scripts/currentEmployeeMonth.js'));
app.use('/currentEmployeeYear', require('./public/scripts/currentEmployeeYear.js'));
app.use('/forgotPassword', require('./public/scripts/forgotPassword.js'));
>>>>>>> 168ccc78ff9e4bbc30393ff6125685dcb0fe859a



app.use('/static', express.static('public'));

var admin = function(req, res, next) {
  if (req.session && req.session.role == 'admin' || req.session.rol == 'superAdmin') {
    return next();
  }
  else {
    res.send('You do not have access to this page', 404);
  }
}

var generalUser = function(req, res, next) {
  if (req.session && req.session.role == 'general') {
    return next();
  }
  else {
    res.send('You do not have access to this page', 404);
  }
}


app.get('/',function(req,res,next){
 
    //res.render('home');
    res.render('landingPage');

});

app.get('/home', generalUser, function(req,res,next){
 
  res.render('home');
  

});



app.get('/logout', function(req, res){
  req.session.destroy();
  res.redirect('/');
})

app.post('/login', function (req, res) {
  req.session.errorMessage = "";
  if (!req.body.Email || !req.body.Password) {
    res.redirect('/', context);
  }
  mysql.pool.query("select users.*, roles.role From Users inner join roles on users.role_id = roles.id where users.email = ?", [req.body.Email], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    
    //res.status(200).json(rows);
    if (rows.length == 0) {
      req.session.errorMessage = "Invalid Login";
      res.redirect('/');
    }

    //valid data
    if (req.body.Password == rows[0].password) {
      req.session.role = rows[0].role;
      req.session.user_name = rows[0].user_name;
      req.session.save();
      switch (rows[0].role) {
        case "general":
          res.redirect('/home')
          
          break;
        case "admin":
        case "superAdmin":
            
            res.redirect('/adminHome');
          break;
        default:
            req.session.errorMessage = "Invalid Login";
            res.redirect('/');
          break;
      }
     
    }
    else {
      req.session.errorMessage = "Invalid Login";
      res.redirect('/');
    }
  
    
  });
})

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