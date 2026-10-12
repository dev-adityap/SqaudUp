const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

async function sendEmail({ to, subject, html }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not configured. Skipping email send.');
    return { success: false, reason: 'EMAIL_NOT_CONFIGURED' };
  }

  try {
    const transport = getTransporter();
    const info = await transport.sendMail({
      from: `"SquadUp" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('Failed to send email:', err.message);
    return { success: false, reason: err.message };
  }
}

module.exports = { sendEmail };