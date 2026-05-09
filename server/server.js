// ============================================
// MAIN SERVER FILE (Entry Point)
// ============================================
// This is the starting point of our backend application.
// It sets up Express, connects to MongoDB, registers middleware,
// and starts listening for incoming HTTP requests.

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

// ============================================
// 1. LOAD ENVIRONMENT VARIABLES
// ============================================
// dotenv reads the .env file and makes those values available
// via process.env.VARIABLE_NAME throughout our entire app.
dotenv.config();

// ============================================
// 2. CONNECT TO DATABASE
// ============================================
// We call our connectDB function before starting the server.
// This ensures the database is ready before we accept any requests.
connectDB();

// ============================================
// 3. CREATE EXPRESS APP
// ============================================
const app = express();

// ============================================
// 4. GLOBAL MIDDLEWARE
// ============================================

// CORS (Cross-Origin Resource Sharing)
// Our React frontend runs on port 8080, but our backend runs on port 5000.
// By default, browsers block requests between different ports (origins).
// CORS middleware tells the browser "it's okay, I trust this frontend!"
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:8080',
    credentials: true, // Allow cookies and auth headers
  })
);

// JSON Body Parser
// This tells Express to automatically parse incoming JSON request bodies.
// Without this, req.body would be undefined when the frontend sends JSON data.
app.use(express.json());

// URL-encoded Body Parser (for form data)
app.use(express.urlencoded({ extended: true }));

// ============================================
// 5. API ROUTES
// ============================================
// All authentication-related routes are prefixed with /api/auth
// So the full URL becomes: http://localhost:5000/api/auth/register, etc.
app.use('/api/auth', authRoutes);

// ============================================
// 6. HEALTH CHECK ROUTE
// ============================================
// A simple route to verify the server is running.
// Visit http://localhost:5000/ in your browser to check.
app.get('/', (req, res) => {
  res.json({
    message: '🧙 Diagonalley Shop API is running!',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      logout: 'POST /api/auth/logout',
      me: 'GET /api/auth/me (protected)',
    },
  });
});

// ============================================
// 7. GLOBAL ERROR HANDLER
// ============================================
// If any middleware or route throws an error that isn't caught,
// this middleware catches it and sends a clean error response.
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server.',
  });
});

// ============================================
// 8. START THE SERVER
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🧙 Diagonalley Server running on http://localhost:${PORT}`);
});
