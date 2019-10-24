module.exports = function(){
    var express = require('express');
    var isAdmin = require('../../adminCheck.js')
    var isGeneral = require('../../generalUserCheck.js')
    var router = express.Router();

  
  // Display the admin homepage
  
  router.get('/', isGeneral, function(req, res){
        let context = {};
        context.adminPage = true;
       
        res.render('adminHome', context);
    });
    
    
    return router;
}();