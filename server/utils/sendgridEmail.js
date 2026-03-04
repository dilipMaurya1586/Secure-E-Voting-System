const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Generate a 6-digit OTP
 */
exports.generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP via SendGrid
 * @param {string} email - recipient's email
 * @param {string} otp - OTP code
 * @returns {Promise<boolean>}
 */
exports.sendOTP = async (email, otp) => {
    try {
        console.log(`📧 Sending OTP to ${email} via SendGrid...`);

        // Check if API key exists
        if (!process.env.SENDGRID_API_KEY) {
            console.error('❌ SENDGRID_API_KEY not found in environment');
            return false;
        }

        const msg = {
            to: email,
            from: process.env.SENDGRID_FROM_EMAIL, // Your verified sender email
            subject: 'Your OTP for E-Voting Registration',
            text: `Your OTP is: ${otp}. Valid for 10 minutes.`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #2563eb;">Email Verification</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="font-size: 48px; color: #2563eb; background: #f0f9ff; padding: 15px; text-align: center; border-radius: 8px;">${otp}</h1>
          <p>This OTP is valid for <strong>10 minutes</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">E-Voting Management System – Secure, Transparent, Digital</p>
        </div>
      `,
        };

        const response = await sgMail.send(msg);
        console.log('✅ Email sent successfully. Status:', response[0]?.statusCode);
        return true;

    } catch (error) {
        console.error('❌ SendGrid error:', error.response?.body || error.message);
        return false;
    }
};