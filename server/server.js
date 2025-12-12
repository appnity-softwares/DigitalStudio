const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('./config/passport');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

// Health check
app.get('/', (req, res) => {
    res.json({
        message: 'CodeStudio API is running',
        version: '2.0.0',
        database: 'PostgreSQL with Prisma'
    });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));
app.use('/api/docs', require('./routes/docsRoutes'));
app.use('/api/saas', require('./routes/saasRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/download', require('./routes/downloadRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Error handler middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📦 Database: PostgreSQL with Prisma`);
    console.log(`🔐 OAuth: Google + GitHub`);
});
