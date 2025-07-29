const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text, html = null) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // If no text provided but HTML is available, create a simple text fallback
  const emailText =
    text ||
    (html ? 'Please view this email in an HTML-enabled email client.' : '');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: emailText,
    ...(html && { html }), // Add HTML if provided
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', to);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Re-throw so the calling function can handle it
  }
};

module.exports = sendEmail;
