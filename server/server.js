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
    await connectDB();
    isConnected = true;
};

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/voter', require('./routes/voterRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    const buildPath = path.join(__dirname, '../client/dist');
    app.use(express.static(buildPath));

    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(buildPath, 'index.html'));
        }
    });
}

// ✅ Vercel serverless export
module.exports = app;

// Local development ke liye
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
        connectToDatabase();
    });
}