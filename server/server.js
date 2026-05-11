// ============================================
// MAIN SERVER FILE (Entry Point)
// ============================================
// Production deployment: Render.com
// Frontend deployment:   Vercel
//
// ENVIRONMENT VARIABLES REQUIRED (set in Render dashboard):
//   MONGO_URI   — MongoDB Atlas connection string
//   JWT_SECRET  — Long random secret key
//   CLIENT_URL  — Your Vercel frontend URL (e.g. https://diagonalley-shop.vercel.app)
//   PORT        — Automatically set by Render (do not override)

// Fix: Prefer IPv4 DNS — needed on Windows AND Render for MongoDB Atlas SRV lookup
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

// 1. Load env vars — resolve path relative to THIS file (server.js),
//    so it works whether we start from /server or from the project root.
//    On Render, env vars are injected directly into process.env (no .env file needed).
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

// 2. Connect to MongoDB Atlas
connectDB();

// 3. Create Express app
const app = express();

// ──────────────────────────────────────────────────────────────────────
// 4. CORS Configuration — Production + Development
// ──────────────────────────────────────────────────────────────────────
// We build a dynamic allowlist of origins that are always permitted:
//   • CLIENT_URL env var  → your Vercel production URL
//   • localhost variants  → local development
//   • 192.168.x.x / 10.x → LAN testing from phone/tablet
//   • *.vercel.app        → Vercel preview deployments (branch previews)
//
// IMPORTANT: Set CLIENT_URL in your Render environment variables to your
// exact Vercel URL, e.g.:  CLIENT_URL=https://diagonalley-shop.vercel.app

const buildAllowedOrigins = () => {
  const origins = new Set([
    // Local development
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ]);

  // Add the production CLIENT_URL from env (Vercel URL set in Render dashboard)
  if (process.env.CLIENT_URL) {
    origins.add(process.env.CLIENT_URL.trim());
  }

  return origins;
};

const allowedOrigins = buildAllowedOrigins();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);

      // Allow any origin in our static allowlist
      if (allowedOrigins.has(origin)) return callback(null, true);

      // Allow any Vercel preview deployment (*.vercel.app)
      if (/\.vercel\.app$/.test(origin)) return callback(null, true);

      // Allow local network devices (192.168.x.x and 10.x.x.x)
      if (/^http:\/\/192\.168\./.test(origin)) return callback(null, true);
      if (/^http:\/\/10\./.test(origin)) return callback(null, true);

      // All other origins are blocked
      console.warn(`[CORS] Blocked origin: ${origin}`);
      callback(new Error(`CORS: Origin ${origin} is not allowed.`));
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

// 7. Health check — useful for Render's health check ping and debugging
app.get('/', (req, res) => {
  res.json({
    message: '🧙 Alohomora — Diagonalley Shop API is running!',
    environment: process.env.NODE_ENV || 'development',
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

// 9. Start — bind to 0.0.0.0 so Render, LAN devices, and localhost can all reach the API.
//    Render injects $PORT automatically; we default to 5000 for local dev.
const PORT = process.env.PORT || 5000;

// Only listen if not running on Vercel (Vercel serverless handles listening internally)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🧙 Alohomora Server running on port ${PORT}`);
    console.log(`📡 Allowed CORS origins: ${[...allowedOrigins].join(', ')}`);
    console.log(`🌿 NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export the Express API so Vercel Serverless Functions can use it
export default app;
