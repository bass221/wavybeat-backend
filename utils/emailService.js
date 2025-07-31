const nodemailer = require('nodemailer');
require('dotenv').config(); // Make sure this is here at the top

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOrderEmail(to, subject, htmlContent) {
  const mailOptions = {
    from: '"BeatWave 🎧" <no-reply@beatwave.com>',
    to,
    subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to', to);
  } catch (error) {
    console.error('❌ Email failed:', error.message);
  }
}

module.exports = sendOrderEmail;

