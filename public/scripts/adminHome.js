module.exports = function(){
    var express = require('express');
    var router = express.Router();

  
  // Display the admin homepage
  
  router.get('/', function(req, res){
        res.render('adminHome');
    });
    
    
    return router;
}();