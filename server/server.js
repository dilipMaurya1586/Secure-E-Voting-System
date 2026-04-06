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


