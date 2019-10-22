module.exports = function(){
    var express = require('express');
    var router = express.Router();

  
  router.get('/', function(req, res){
        let context = {};
        context.userPage = true;
        res.render('awards', context);
    });
    
    
    return router;
}();