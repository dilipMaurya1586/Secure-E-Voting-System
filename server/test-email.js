require('dotenv').config();
const { Resend } = require('resend');

// Initialize Resend directly
const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
    console.log('🔍 Testing Resend API...');
    console.log('API Key present:', process.env.RESEND_API_KEY ? '✅ Yes' : '❌ No');

    try {
        const { data, error } = await resend.emails.send({
            from: 'E-Voting System <onboarding@resend.dev>',
            to: ['mauryadilip.work@gmail.com'], // 👈 APNI EMAIL YAHAN DALO
            subject: 'Test Email from E-Voting System',
            html: '<h2>Test Email</h2><p>If you receive this, Resend is working!</p>'
        });

        if (error) {
            console.error('❌ Resend API Error:', error);
        } else {
            console.log('✅ Email sent! Message ID:', data.id);
        }
    } catch (err) {
        console.error('❌ Unexpected Error:', err);
    }
}

testEmail();