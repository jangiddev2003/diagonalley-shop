// ============================================
// AUTHENTICATION MIDDLEWARE (JWT Verification)
// ============================================
// This middleware sits between the client request and the route handler.
// It checks if the user has a valid JWT token. If yes, the request proceeds.
// If no, it sends back a 401 Unauthorized error.
//
// Usage: Add `protect` to any route that requires the user to be logged in.
// Example: router.get('/me', protect, getMe);

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * protect — Middleware that verifies JWT token from the Authorization header.
 * If valid, attaches the user object to `req.user` so route handlers can use it.
 */
const protect = async (req, res, next) => {
  let token;

  // Step 1: Check if the Authorization header exists and starts with "Bearer"
  // The standard format is: "Bearer eyJhbGciOiJIUzI1NiIs..."
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extract the token part (everything after "Bearer ")
    token = req.headers.authorization.split(' ')[1];
  }

  // Step 2: If no token was found, deny access
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — no token provided. Please log in.',
    });
  }

  try {
    // Step 3: Verify the token using our secret key.
    // jwt.verify() will throw an error if the token is expired or tampered with.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 4: Find the user in the database using the ID stored inside the token.
    // We exclude the password field for security (even though it's hashed).
    req.user = await User.findById(decoded.id).select('-password');

    // If the user no longer exists (deleted account), deny access.
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.',
      });
    }

    // Step 5: Everything checks out! Move on to the actual route handler.
    next();
  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({
      success: false,
      message: 'Not authorized — invalid or expired token.',
    });
  }
};

export default protect;
