module.exports = function(){
    var express = require('express');
    var router = express.Router();

  
  // Display the admin homepage
  
  router.get('/', function(req, res){
        let context = {};
        context.adminPage = true;
        res.render('adminHome', context);
    });
    
    
    return router;
}();