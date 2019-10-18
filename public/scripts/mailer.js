module.exports = function(){

  var nodemailer = require('nodemailer');

  this.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'cchincinfo@gmail.com',
           pass: 'E=^8-!@TD&X%mi9*2?YH'
       }
   });
  
   this.mailOptions = {
    from: 'cchincinfo@gmail.com', // sender address
    to: 'eric.croom@gmail.com', // list of receivers
    subject: 'Node Mailer Test', // Subject line
    html: '<p>Testing out this app email.</p>'// plain text body
  };

  this.SendMail = function () {
    var sent = false;
    this.transporter.sendMail(this.mailOptions, function (err, info) {
      if(err)
        console.log(err);
        
      else
        console.log(info);
        sent = true;
    });
    return sent;
  }

  
}