const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// CORS
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://secure-e-voting-system-phi.vercel.app',
        'https://secure-e-voting-system-git-main-dilips-projects-37fdb3b5.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());
app.use(express.json());

// MongoDB Connection
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

// Routes
app.get('/', (req, res) => {
    res.send('🚀 Server is running! API is live at /api');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/voter', require('./routes/voterRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));

// Error Handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        msg: 'Internal Server Error',
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Local Development
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
        connectToDatabase();
    });
}

module.exports = app;



// const express = require('express');
// const path = require('path');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDB = require('./config/db');

// dotenv.config();

// const app = express();

// // ✅ FIXED CORS - Add your new frontend URL here
// app.use(cors({
//     origin: [
//         'http://localhost:3000',
//         'http://localhost:5173',
//         'https://secure-e-voting-system-phi.vercel.app',        // ✅ naya
//         'https://secure-e-voting-system-1g6t.onrender.com',      // purana (rakh agar kaam aaye)
//         'https://secure-e-voting-system-git-main-dilips-projects-37fdb3b5.vercel.app'
//     ],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.options('*', cors());

// app.use(express.json());

// // Connect to MongoDB
// let isConnected = false;
// const connectToDatabase = async () => {
//     if (isConnected) return;
//     try {
//         await connectDB();
//         isConnected = true;
//         console.log('MongoDB Connected Successfully');
//     } catch (error) {
//         console.error('MongoDB Connection Error:', error);
//     }
// };

// // API Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));
// app.use('/api/voter', require('./routes/voterRoutes'));
// app.use('/api/results', require('./routes/resultRoutes'));

// // Simple route for root
// app.get('/', (req, res) => {
//     res.send('🚀 Server is running! API is live at /api');
// });

// // Error handling middleware
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

// module.exports = app;


// const express = require('express');
// const path = require('path');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDB = require('./config/db');

// dotenv.config();


// // ✅ IMPORTANT: Vercel serverless ke liye
// const app = express();

// // CORS setup
// app.use(cors({
//     origin: ['http://localhost:3000' , 'https://secure-e-voting-system-s8wr.vercel.app'],
//     credentials: true
// }));

// app.options('*', cors());

// app.use(express.json());

// // Connect to MongoDB (with serverless-optimized connection)
// let isConnected = false;
// const connectToDatabase = async () => {
//     if (isConnected) return;
//     try {
//         await connectDB();
//         isConnected = true;
//         console.log('MongoDB Connected Successfully');
//     } catch (error) {
//         console.error('MongoDB Connection Error:', error);
//     }
// };

// // API Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));
// app.use('/api/voter', require('./routes/voterRoutes'));
// app.use('/api/results', require('./routes/resultRoutes'));

// // Simple route for root
// app.get('/', (req, res) => {
//     res.send('🚀 Server is running! API is live at /api');
// });

// // ✅ Error handling middleware
// app.use((err, req, res, next) => {
//     console.error('Server Error:', err);
//     res.status(500).json({ 
//         msg: 'Internal Server Error',
//         error: err.message,
//         stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
//     });
// });

// // Local development ke liye
// if (require.main === module) {
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//         console.log(`Server started on port ${PORT}`);
//         connectToDatabase();
//     });
// }

// // ✅ Vercel serverless export
// module.exports = app;


