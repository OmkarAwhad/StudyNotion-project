const nodemailer = require('nodemailer')

const mailSender = async(email,title,body) => {
     try {
          let transporter = nodemailer.createTransport({
               host: process.env.MAIL_HOST,
               port: 465,
               secure: true,
               auth:{
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
               },
               debug:true,
          })

          let info = await transporter.sendMail({
               from:"Omkar",
               to: `${email}`,
               subject: `${title}`,
               html: `${body}`,
          });
          console.log("Mail response from mail sender",info);

          return info;

     } catch (error) {
          console.error("Error occurred while sending mail:", error);
          console.log(error)
          throw error
     }
}

module.exports = mailSender