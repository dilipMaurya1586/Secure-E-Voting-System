const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendOTP = async (email, otp) => {
    console.log('========== SENDGRID DEBUG ==========');
    console.log('1️⃣ sendOTP function CALLED');
    console.log('2️⃣ Email:', email);
    console.log('3️⃣ OTP:', otp);
    console.log('4️⃣ API Key present:', process.env.SENDGRID_API_KEY ? '✅ YES' : '❌ NO');
    console.log('5️⃣ From Email:', process.env.SENDGRID_FROM_EMAIL);

    try {
        const msg = {
            to: email,
            from: process.env.SENDGRID_FROM_EMAIL,
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

        console.log('6️⃣ Sending email via SendGrid...');
        const response = await sgMail.send(msg);
        console.log('7️⃣ SendGrid Response:', response[0]?.statusCode);
        console.log('8️⃣ ✅ EMAIL SENT SUCCESSFULLY!');
        return true;

    } catch (error) {
        console.log('========== SENDGRID ERROR ==========');
        console.error('❌ Error Type:', error.name);
        console.error('❌ Error Message:', error.message);
        if (error.response) {
            console.error('❌ Response Body:', error.response.body);
        }
        console.log('===================================');
        return false;
    }
};