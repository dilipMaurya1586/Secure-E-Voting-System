// server/utils/resendEmail.js
const { Resend } = require('resend');

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Generate a 6-digit OTP
 * @returns {string} 6-digit OTP
 */
exports.generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP email using Resend API
 * @param {string} email - Recipient email address
 * @param {string} otp - OTP code to send
 * @returns {Promise<boolean>} Success status
 */
exports.sendOTP = async (email, otp) => {
    try {
        console.log(`📧 Attempting to send OTP to ${email} via Resend...`);

        const { data, error } = await resend.emails.send({
            from: 'E-Voting System <onboarding@resend.dev>', // ✅ Free tier sender
            to: [email],
            subject: 'Verify Your Email - E-Voting System',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #2563eb, #1e40af); padding: 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { padding: 40px 30px; text-align: center; }
            .otp-box { background: #f0f9ff; border: 2px dashed #2563eb; border-radius: 10px; padding: 20px; margin: 20px 0; }
            .otp-code { font-size: 48px; font-weight: bold; color: #2563eb; letter-spacing: 8px; margin: 10px 0; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
            .note { color: #ef4444; font-size: 14px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 E-Voting System</h1>
            </div>
            <div class="content">
              <h2>Email Verification</h2>
              <p>Thank you for registering. Please use the following OTP to verify your email address:</p>
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              <p>This OTP is valid for <strong>10 minutes</strong>.</p>
              <p class="note">If you didn't request this, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2026 E-Voting Management System • Secure • Transparent • Digital</p>
            </div>
          </div>
        </body>
        </html>
      `,
            text: `Your OTP for E-Voting System registration is: ${otp}. This code is valid for 10 minutes.`
        });

        if (error) {
            console.error('❌ Resend API error:', error);
            return false;
        }

        console.log('✅ Email sent successfully via Resend. Message ID:', data?.id);
        return true;

    } catch (error) {
        console.error('❌ Unexpected error sending email:', error);
        return false;
    }
};