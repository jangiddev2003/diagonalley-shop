// ============================================
// MAIN SERVER FILE (Entry Point)
// ============================================

// Fix: Force IPv4 DNS globally — needed on Windows for MongoDB Atlas SRV lookup
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

// 1. Load env vars
dotenv.config();

// 2. Connect to MongoDB
connectDB();

// 3. Create Express app
const app = express();

// 4. CORS — allow localhost AND LAN devices
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:8080',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile apps) or any LAN IP
      if (!origin || allowedOrigins.includes(origin) || /^http:\/\/192\.168\./.test(origin) || /^http:\/\/10\./.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// 5. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 6. Routes
app.use('/api/auth', authRoutes);   // /api/auth/register, /api/auth/login, etc.
app.use('/api/user', userRoutes);   // /api/user/profile, /api/user/avatar, etc.

// 7. Health check
app.get('/', (req, res) => {
  res.json({
    message: '🧙 Alohomora — Diagonalley Shop API is running!',
    endpoints: {
      register:   'POST /api/auth/register',
      login:      'POST /api/auth/login',
      logout:     'POST /api/auth/logout',
      me:         'GET  /api/auth/me (protected)',
      profile:    'GET  /api/user/profile (protected)',
      avatar:     'PUT  /api/user/avatar (protected)',
      update:     'PUT  /api/user/update (protected)',
      sort:       'POST /api/user/sort (protected)',
      checkAuth:  'GET  /api/user/check-auth (protected)',
    },
  });
});

// 8. Global error handler
app.use((err, req, res, _next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong on the server.' });
});

// 9. Start — bind to 0.0.0.0 so all LAN devices can reach the API
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🧙 Alohomora Server: http://localhost:${PORT}`);
  console.log(`🌐 LAN access:       http://0.0.0.0:${PORT}`);
});
