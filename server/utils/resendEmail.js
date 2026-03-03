const { Resend } = require('resend');

// Initialize Resend with your API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Generate a 6-digit OTP
 */
exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP via Resend API
 * @param {string} email - recipient's email address
 * @param {string} otp - the OTP code
 * @returns {Promise<boolean>} true if successful, false otherwise
 */
exports.sendOTP = async (email, otp) => {
  try {
    console.log(`📧 Attempting to send OTP to ${email}...`);

    const { data, error } = await resend.emails.send({
      from: 'E-Voting System <onboarding@resend.dev>', // ✅ free testing sender
      to: [email],
      subject: 'Your OTP for E-Voting Registration',
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
    });

    if (error) {
      console.error('❌ Resend API error:', error);
      return false;
    }

    console.log('✅ Email sent successfully. Message ID:', data?.id);
    return true;
  } catch (error) {
    console.error('❌ Unexpected error in sendOTP:', error);
    return false;
  }
};