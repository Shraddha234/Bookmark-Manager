const nodemailer = require('nodemailer');

// Create a transporter using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Outlook',
  auth: {
    user: 'mustafa.mohammed@acsicorp.com',
    pass: 'dftwvgdkdvbgyggg', //change your app generated password
  },
});

const sendEmail = async (to, subject, html) => {
    try {
      await transporter.sendMail({
        from: 'mustafa.mohammed@acsicorp.com', 
        to,
        subject,
        html,
      });
      console.log('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

module.exports = sendEmail;
