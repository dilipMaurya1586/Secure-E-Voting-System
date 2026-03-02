const nodemailer = require('nodemailer');

// Create transporter once (reuse)
let transporter;
const createTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }
    return transporter;
};

exports.generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

exports.sendOTP = async (email, otp) => {
    const transporter = createTransporter();
    const mailOptions = {
        from: `"E-Voting System" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email - E-Voting System',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #2563eb;">Email Verification</h2>
        <p>Your One-Time Password (OTP) for registration is:</p>
        <h1 style="font-size: 40px; color: #2563eb; background: #f0f9ff; padding: 15px; text-align: center; border-radius: 8px;">${otp}</h1>
        <p>This OTP is valid for <strong>10 minutes</strong>.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">E-Voting Management System – Secure, Transparent, Digital</p>
      </div>
    `
    };
    await transporter.sendMail(mailOptions);
};