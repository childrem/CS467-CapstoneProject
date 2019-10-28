module.exports = function(){
    var express = require('express');
	var isGeneral = require('../../generalUserCheck.js');
    var router = express.Router();

  
  router.get('/', isGeneral, function(req, res){
        let context = {};
        context.userPage = true;
        res.render('awards', context);
    });
    
    
    return router;
}();