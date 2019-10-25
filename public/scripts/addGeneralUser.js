module.exports = function(){
    var express = require('express');
    var router = express.Router();

    var isAdmin = require('../../adminCheck.js');
  
  // Display the admin homepage
  
  router.get('/', isAdmin, function(req, res){
        let context = {};
        context.adminPage = true;
        res.render('addGeneralUser', context);
    });
    
    
    return router;
}();