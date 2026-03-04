require('dotenv').config();
const { sendOTP } = require('./utils/sendgridEmail');

async function test() {
    console.log('🔍 Running SendGrid test...');
    const result = await sendOTP('mauryadilip.work@gmail.com', '123456');
    console.log('Test result:', result ? '✅ SUCCESS' : '❌ FAILED');
}

test();