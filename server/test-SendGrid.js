require('dotenv').config();
const { sendOTP } = require('./utils/sendgridEmail');

async function testSendGrid() {
    console.log('🔍 Testing SendGrid...');
    console.log('API Key present:', process.env.SENDGRID_API_KEY ? '✅ Yes' : '❌ No');
    console.log('From Email:', process.env.SENDGRID_FROM_EMAIL);

    // ✅ Kisi bhi email par test karo
    const result = await sendOTP('mauryadilip.work@gmail.com', '123456');
    console.log('Test result:', result ? '✅ SUCCESS' : '❌ FAILED');
}

testSendGrid();