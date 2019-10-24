module.exports = function(){
    var express = require('express');
    var router = express.Router();

  
  // Display the user homepage
  
  router.get('/', function(req, res){
        let context = {};
        context.userPage = true;
        res.render('userHome', context);
    });
    
    
    return router;
}();