const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();


// ✅ IMPORTANT: Vercel serverless ke liye
const app = express();

// CORS setup
app.use(cors({
    origin: ['https://blockchain-based-secure-e-voting-sy.vercel.app', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json());

// Connect to MongoDB (with serverless-optimized connection)
let isConnected = false;
const connectToDatabase = async () => {
    if (isConnected) return;
    try {
        await connectDB();
        isConnected = true;
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
    }
};

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/voter', require('./routes/voterRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));

// Simple route for root
app.get('/', (req, res) => {
    res.send('🚀 Server is running! API is live at /api');
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ 
        msg: 'Internal Server Error',
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Local development ke liye
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
        connectToDatabase();
    });
}

// ✅ Vercel serverless export
module.exports = app;






// const express = require('express');
// const path = require('path');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDB = require('./config/db');

// dotenv.config();
// const app = express();

// app.use(cors({
//     origin: ['https://blockchain-based-secure-e-voting-sy.vercel.app', 'http://localhost:3000'],
//     credentials: true
// }));

// app.use(express.json());

// let isConnected = false;
// const connectToDatabase = async () => {
//     if (isConnected) return;
//     await connectDB();
//     isConnected = true;
// };

// // API Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));
// app.use('/api/voter', require('./routes/voterRoutes'));
// app.use('/api/results', require('./routes/resultRoutes'));


// // API Routes ke baad yeh add karo (line 35 ke around)
// app.use((err, req, res, next) => {
//     console.error('Server Error:', err);
//     res.status(500).json({ 
//         msg: 'Internal Server Error',
//         error: err.message,
//         stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
//     });
// });


// // Local development
// if (require.main === module) {
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//         console.log(`Server started on port ${PORT}`);
//         connectToDatabase();
//     });
// }

// // ✅ Vercel export - SAHI JAGAH
// module.exports = app;