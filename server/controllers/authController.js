// ============================================
// AUTH CONTROLLER (Business Logic)
// ============================================
// Controllers contain the actual logic for each API endpoint.
// They receive the request (req), do the work, and send back a response (res).
// Keeping logic here (instead of in routes) keeps our code clean and organized.

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ============================================
// HELPER: Generate JWT Token
// ============================================
// We create tokens by encoding the user's database ID inside the token payload.
// Anyone with this token can prove they are that user (until it expires).
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // Payload: data stored inside the token
    process.env.JWT_SECRET, // Secret key used to sign (like a password for the token)
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } // Token lifespan
  );
};

// ============================================
// POST /api/auth/register — Create a new user
// ============================================
export const register = async (req, res) => {
  try {
    const { username, email, password, profileImage } = req.body;

    // --- Validation ---

    // Check if all required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email, and password.',
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A wizard with this email already exists! Try logging in.',
      });
    }

    // --- Create User ---
    // The password will be automatically hashed by the pre-save middleware in the User model.
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password,
      profileImage: profileImage || '',
    });

    // Generate JWT token for the newly registered user
    const token = generateToken(user._id);

    // Send success response (WITHOUT the password)
    res.status(201).json({
      success: true,
      message: 'Welcome to Hogwarts! Your enrollment is complete. 🎉',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);

    // Handle Mongoose duplicate key error (email already exists)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A wizard with this email already exists!',
      });
    }

    // Handle Mongoose validation errors (e.g., invalid email format)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages[0], // Return the first validation error
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

// ============================================
// POST /api/auth/login — Authenticate a user
// ============================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- Validation ---
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // Find the user by email.
    // We use .select('+password') because the password field is hidden by default in our schema.
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    // If no user found with that email
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. The spell failed! 🔒',
      });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. The spell failed! 🔒',
      });
    }

    // --- Success: Generate token and send response ---
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Alohomora! The gates are open. 🔓',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

// ============================================
// GET /api/auth/me — Get current logged-in user
// ============================================
// This route is protected by the `protect` middleware,
// which means `req.user` is already available if the token is valid.
export const getMe = async (req, res) => {
  try {
    // req.user was set by the protect middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};

// ============================================
// POST /api/auth/logout — Logout (client-side)
// ============================================
// With JWT, logout is primarily handled on the client side by deleting the token.
// This endpoint exists for API completeness and can be extended later
// (e.g., adding token blacklisting with Redis).
export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully. The gates have closed. 🔐',
  });
};
