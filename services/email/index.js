const config = require('config')
const nodemailer = require("nodemailer");
const logger = require('../logging')

//let testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
    host: config.get('email.host'),
    port: config.get('email.port'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: config.get('email.user'), // generated ethereal user
        pass: config.get('email.pass'), // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false //unicamente para localHost
    }
});



const sendEmailFun = async (to, subject, message) => {

    // send mail with defined transport object
const mailOptions = ({
    from: '"DemosWeb" <no-respodner@demosweb.net>', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: message, // plain text body
    html: message, // html body
})

   try {
    const infoSend = await transporter.sendMail(mailOptions)
    //console.log(infoEnvio)
    logger.info(`Correo Enviado [${infoSend.messageId}]`)
   } catch (error) {
       console.log('error: ', error)
       logger.error(`Error al enviar el correo [${error.message}]`)
   }
}

module.exports = sendEmailFun