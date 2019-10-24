module.exports = function isAdmin(req, res, next) {
  if (req.session && req.session.role == 'admin' || req.session.role == 'superAdmin') {
    // user is authenticated
    next();
  } else {
    // return unauthorized
    res.send(401, "Unauthorized");
  }
};
 /*  
  return function (req, res, next) {

    if (type === 'admin') {
      admin(req, res, next);
    } else if (type === 'general') {
      generalUser(req, res, next);
    } else {
      //res.redirect('/AccessDenied');
    }


  } */



  /* function admin(req, res, next) {
    if (req.session && req.session.role == 'admin' || req.session.role == 'superAdmin') {
      return next();
    }
    else {
     // res.redirect('/AccessDenied');
    }
  }
  
  function generalUser(req, res, next) {
    if (req.session && req.session.role == 'general') {
      return next();
    }
    else {
      //res.redirect('/AccessDenied');
    }
  }
 */

