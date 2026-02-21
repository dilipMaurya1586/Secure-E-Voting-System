const express = require('express');
const path = require('path'); // ✅ Ye add kiya
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/voter', require('./routes/voterRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));

// ✅ Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Client build folder serve karo
    app.use(express.static(path.join(__dirname, '../client/build')));

    // Any route jo API na ho, frontend bhejo
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
    });
} else {
    // Development mode mein API running message
    app.get('/', (req, res) => res.send('API Running'));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDB = require('./config/db');

// dotenv.config();
// connectDB();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));
// app.use('/api/voter', require('./routes/voterRoutes'));
// app.use('/api/results', require('./routes/resultRoutes'));

// app.get('/', (req, res) => res.send('API Running'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));