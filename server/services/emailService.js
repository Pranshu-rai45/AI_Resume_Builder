const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'AI Resume Builder <noreply@airesume.com>',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '')
    });
    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    throw new Error('Email could not be sent');
  }
};

const sendPasswordResetEmail = async (email, name, resetUrl) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Reset Password</title></head>
    <body style="font-family: 'Inter', Arial, sans-serif; background: #0F172A; margin: 0; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1E293B, #0F172A); border-radius: 16px; overflow: hidden; border: 1px solid rgba(99,102,241,0.2);">
        <div style="background: linear-gradient(135deg, #2563EB, #7C3AED); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🚀 AI Resume Builder</h1>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #E2E8F0; margin-bottom: 16px;">Reset Your Password</h2>
          <p style="color: #94A3B8; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
          <p style="color: #94A3B8; font-size: 16px; line-height: 1.6;">You requested a password reset for your AI Resume Builder account. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #2563EB, #7C3AED); color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #64748B; font-size: 14px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
          <p style="color: #475569; font-size: 12px; margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(99,102,241,0.1);">If the button doesn't work, copy and paste this link into your browser:<br><a href="${resetUrl}" style="color: #6366F1;">${resetUrl}</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
  return sendEmail({ to: email, subject: '🔐 Reset Your AI Resume Builder Password', html });
};

const sendWelcomeEmail = async (email, name) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Welcome!</title></head>
    <body style="font-family: 'Inter', Arial, sans-serif; background: #0F172A; margin: 0; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1E293B, #0F172A); border-radius: 16px; overflow: hidden; border: 1px solid rgba(99,102,241,0.2);">
        <div style="background: linear-gradient(135deg, #2563EB, #7C3AED); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🚀 AI Resume Builder</h1>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #E2E8F0;">Welcome, ${name}! 🎉</h2>
          <p style="color: #94A3B8; font-size: 16px; line-height: 1.6;">Your account has been created successfully. Start building your dream resume with the power of AI!</p>
          <div style="background: rgba(99,102,241,0.1); border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid rgba(99,102,241,0.2);">
            <h3 style="color: #E2E8F0; margin-top: 0;">What you can do:</h3>
            <ul style="color: #94A3B8; line-height: 2;">
              <li>✨ Generate professional resumes with AI</li>
              <li>📊 Check your ATS score instantly</li>
              <li>🎨 Choose from 5 premium templates</li>
              <li>📥 Export as PDF with one click</li>
            </ul>
          </div>
          <a href="${process.env.CLIENT_URL}/dashboard" style="background: linear-gradient(135deg, #2563EB, #7C3AED); color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">Go to Dashboard →</a>
        </div>
      </div>
    </body>
    </html>
  `;
  return sendEmail({ to: email, subject: '🎉 Welcome to AI Resume Builder!', html });
};

module.exports = { sendEmail, sendPasswordResetEmail, sendWelcomeEmail };
