const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // const transporter = nodemailer.createTransport({
  //   service: 'Gmail',
  //   auth: {
  //     user: process.env.EMAIL_USERNAME, // generated ethereal user
  //     pass: process.env.EMAIL_PASSWORD, // generated ethereal password
  //   },
  //   // For gmail, need to activate "less secure app" option
  // });

  // 1)create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  // 2) Define  the email options
  const mailOptions = {
    from: 'Roi Susi <roisusi@gmail.com>', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
    // html: options.html, // html body
  };

  // 3) send mail with defined transport object
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent: %s', info.messageId);
    }
  });
};

module.exports = sendEmail;
