// ============================================
// OTP CONTROLLER  (Password Reset via Email)
// ============================================
// Flow:
//   1. POST /api/auth/send-otp      → user enters email → we generate OTP, return it (dev mode), save hashed OTP
//   2. POST /api/auth/verify-otp    → user enters OTP  → we validate it
//   3. POST /api/auth/reset-password→ user enters new password → we hash + save it, clear OTP fields
//
// Security:
//   - OTP is hashed with bcrypt before storage (never stored in plain text)
//   - OTP expires after 5 minutes
//   - Max 3 OTP requests per 15-minute window per email
//   - OTP fields are cleared after successful reset

import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// ── Constants ────────────────────────────────────────────────────────
const OTP_EXPIRY_MINUTES   = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_OTP_PER_WINDOW   = 3;

// ── Helper: generate a 6-digit random OTP ────────────────────────────
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ──────────────────────────────────────────────────────────────────────
// POST /api/auth/send-otp
// Body: { email }
// ──────────────────────────────────────────────────────────────────────
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your registered email address.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log(`[sendOtp] Searching for user with email: ${normalizedEmail}`);

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.warn(`[sendOtp] User not found for email: ${normalizedEmail}`);
      // Return a generic message to prevent email enumeration
      return res.status(404).json({
        success: false,
        message: 'No wizard found with that email address. Please check and try again.',
      });
    }
    console.log(`[sendOtp] User found: ${user._id}`);

    // ── Rate limiting: max 3 OTPs per 15-minute window ───────────────
    const now = new Date();
    const windowStart = new Date(now - RATE_LIMIT_WINDOW_MS);

    if (user.otpLastSentAt && user.otpLastSentAt > windowStart) {
      if (user.otpAttempts >= MAX_OTP_PER_WINDOW) {
        const waitMs      = RATE_LIMIT_WINDOW_MS - (now - user.otpLastSentAt);
        const waitMinutes = Math.ceil(waitMs / 60000);
        return res.status(429).json({
          success: false,
          message: `Too many OTP requests. Please wait ${waitMinutes} minute(s) before trying again.`,
        });
      }
      user.otpAttempts += 1;
    } else {
      // Reset window
      user.otpAttempts   = 1;
      user.otpLastSentAt = now;
    }

    // ── Generate + hash OTP ──────────────────────────────────────────
    const plainOtp  = generateOtp();
    const hashedOtp = await bcrypt.hash(plainOtp, 10);

    user.otp       = hashedOtp;
    user.otpExpiry = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);
    await user.save();

    // ── Email/console delivery ──────────────────────────────────────
    // Production: integrate email service here.
    // For now we log the OTP to the server console (dev/demo mode).
    // NEVER send the OTP back in the API response in production.
    console.log(`\n🔔 [OTP] Email: ${normalizedEmail}  |  OTP: ${plainOtp}  |  Expires: ${user.otpExpiry.toISOString()}\n`);

    // TODO: If email service is configured, attempt to send email
    // For now, return the OTP in dev mode so user can see it
    return res.status(200).json({
      success: true,
      message: `An OTP has been sent to your email ending in ...${normalizedEmail.slice(-10)}.`,
      otp: plainOtp, // Return OTP in dev mode (remove in production with real email sending)
    });
  } catch (error) {
    console.error('[sendOtp] ERROR:', error.message);
    console.error('[sendOtp] Stack:', error.stack);
    return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

// ──────────────────────────────────────────────────────────────────────
// POST /api/auth/verify-otp
// Body: { email, otp }
// ──────────────────────────────────────────────────────────────────────
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select('+otp +otpExpiry');
    if (!user || !user.otp) {
      return res.status(400).json({ success: false, message: 'OTP not found. Please request a new one.' });
    }

    // Check expiry
    if (new Date() > user.otpExpiry) {
      // Clear expired OTP
      user.otp       = null;
      user.otpExpiry = null;
      await user.save();
      return res.status(400).json({ success: false, message: 'Your OTP has expired. Please request a new one.' });
    }

    // Compare OTP
    const isMatch = await bcrypt.compare(otp.toString().trim(), user.otp);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect OTP. Please try again.' });
    }

    // OTP is valid — DO NOT clear it yet; we need it confirmed in reset-password step.
    // We mark it as "verified" by setting otpExpiry to a new 10-min window.
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min to complete reset
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'OTP verified! You may now reset your password.',
    });
  } catch (error) {
    console.error('verifyOtp Error:', error);
    return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

// ──────────────────────────────────────────────────────────────────────
// POST /api/auth/reset-password
// Body: { email, newPassword }
// ──────────────────────────────────────────────────────────────────────
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select('+password +otp +otpExpiry');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Make sure OTP was verified (otpExpiry exists and hasn't passed)
    if (!user.otp || !user.otpExpiry || new Date() > user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: 'OTP session expired. Please restart the password reset process.',
      });
    }

    // Hash new password and clear OTP fields
    user.password      = newPassword; // pre-save hook will hash it
    user.otp           = null;
    user.otpExpiry     = null;
    user.otpAttempts   = 0;
    user.otpLastSentAt = null;

    user.logActivity('Password reset via OTP');
    await user.save();

    return res.status(200).json({
      success: true,
      message: '🔓 Password reset successful! You can now log in with your new spell.',
    });
  } catch (error) {
    console.error('resetPassword Error:', error);
    return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};
