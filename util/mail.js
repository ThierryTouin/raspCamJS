 /**
 * Configurations of l'envoi de mail.
 */
var mailer = require("nodemailer");

const errorLog = require('./logger').errorlog;
const successlog = require('./logger').successlog;

var smtpTransport = mailer.createTransport("SMTP",{
  service: "Gmail",
  auth: {
    user: "user",
    pass: "password"
  }
});


function sendPhoto(fileName) {

  return new Promise(function (resolve, reject) {

    /*
    var mail = {
      from: "votreAdresseGmail",
      to: "leMailDuDestinataire",
      subject: "leSujetDuMail",
      html: "leCorpsDeVotreMessageEnHTML"
    }
    */
    
    var mail = {
      from: "thierrytouin@gmail.com",
      to: "thierrytouin@gmail.com",
      subject: "photo intru",
      html: "photo intru"
    }

    var mailPJ = {
      from: "thierrytouin@gmail.com",
      to: "thierrytouin@gmail.com",
      subject: "photo intru",
      html: "photo intru",
      attachments: [
        {
          filePath: fileName
        },
      ]
    }
    
    smtpTransport.sendMail(mailPJ, function(error, response){
      if(error){
        errorLog.info(`Erreur lors de l'envoie du mail : ${fileName}`);
        errorLog.info(error);
        reject('Erreur lors envoie du mail');
    }else{
        successlog.info(`Mail envoyé avec succès! : ${fileName}`);
        resolve('Mail envoyé avec succès!');        
    }
    smtpTransport.close();
  });

});

  
};



module.exports = {
  'sendPhoto': sendPhoto
};