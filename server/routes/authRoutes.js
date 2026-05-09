// ============================================
// AUTH ROUTES (URL Endpoints)
// ============================================
// Routes define WHAT URLs exist and WHICH controller function handles each one.
// Think of routes as a menu — they list what's available.
// The actual cooking (logic) happens in the controller.

import express from 'express';
import { register, login, getMe, logout } from '../controllers/authController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// PUBLIC ROUTES (No login required)
// Anyone can access these endpoints
router.post('/register', register); // POST /api/auth/register
router.post('/login', login);       // POST /api/auth/login
router.post('/logout', logout);     // POST /api/auth/logout

// PROTECTED ROUTES (Login required)
// The 'protect' middleware runs FIRST. If the user has a valid token,
// it lets the request through to getMe. If not, it sends back a 401 error.
router.get('/me', protect, getMe);   // GET /api/auth/me

export default router;
