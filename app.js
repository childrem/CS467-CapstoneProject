
var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var mysql = require('./dbcon.js');

const PORT = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', PORT);
//Implementation for static found here:
//https://expressjs.com/en/starter/static-files.html

app.use('/adminHome', require('./public/scripts/adminHome.js'));

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