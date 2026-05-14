// ============================================
// AUTH ROUTES (URL Endpoints)
// ============================================
// Routes define WHAT URLs exist and WHICH controller function handles each one.
// Think of routes as a menu — they list what's available.
// The actual cooking (logic) happens in the controller.

import express from 'express';
import { register, login, getMe, logout } from '../controllers/authController.js';
import { sendOtp, verifyOtp, resetPassword } from '../controllers/otpController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// PUBLIC ROUTES (No login required)
router.post('/register', register); // POST /api/auth/register
router.post('/login', login);       // POST /api/auth/login
router.post('/logout', logout);     // POST /api/auth/logout

// PASSWORD RESET VIA OTP (public — user is not logged in)
router.post('/send-otp',       sendOtp);       // POST /api/auth/send-otp
router.post('/verify-otp',     verifyOtp);     // POST /api/auth/verify-otp
router.post('/reset-password', resetPassword); // POST /api/auth/reset-password

// PROTECTED ROUTES (Login required)
router.get('/me', protect, getMe); // GET /api/auth/me

export default router;
