// ============================================
// AUTH CONTROLLER (Register / Login / Me / Logout)
// ============================================

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ── Helper: sign a JWT ──────────────────────────────────────────────
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ── Helper: clean user object to return to client ───────────────────
const safeUser = (user) => ({
  id:               user._id,
  username:         user.username,
  email:            user.email,
  hogwartsHouse:    user.hogwartsHouse,
  sortingCompleted: user.sortingCompleted,
  avatar:           user.avatar,
  role:             user.role,
  createdAt:        user.createdAt,
  lastLogin:        user.lastLogin,
  activityLog:      user.activityLog?.slice(-10) ?? [],
});

// ──────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// ──────────────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { username, email, password, phoneNumber } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username, email, and password.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A wizard with this email already exists! Try logging in.' });
    }

    // Normalise phone: strip spaces, dashes, parentheses for consistent lookup
    const normalizedPhone = phoneNumber
      ? phoneNumber.replace(/[\s\-().+]/g, '').trim() || null
      : null;

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password,
      ...(normalizedPhone ? { phoneNumber: normalizedPhone } : {}),
    });
    user.logActivity('Account created');
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Welcome to Hogwarts! Your enrollment is complete. 🎉',
      token,
      user: safeUser(user),
    });
  } catch (error) {
    console.error('Register Error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A wizard with this email already exists!' });
    }
    if (error.name === 'ValidationError') {
      const msg = Object.values(error.errors).map((e) => e.message)[0];
      return res.status(400).json({ success: false, message: msg });
    }
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

// ──────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// ──────────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password. The spell failed! 🔒' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password. The spell failed! 🔒' });
    }

    // Update lastLogin
    user.lastLogin = new Date();
    user.logActivity('Logged in');
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Alohomora! The gates are open. 🔓',
      token,
      user: safeUser(user),
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

// ──────────────────────────────────────────────────────────────────────
// GET /api/auth/me  (protected)
// ──────────────────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    res.status(200).json({ success: true, user: safeUser(user) });
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

// ──────────────────────────────────────────────────────────────────────
// POST /api/auth/logout
// ──────────────────────────────────────────────────────────────────────
export const logout = async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully. The gates have closed. 🔐' });
};
