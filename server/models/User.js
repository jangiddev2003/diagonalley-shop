// ============================================
// USER MODEL (Mongoose Schema)
// ============================================
// This file defines what a "User" looks like in our MongoDB database.
// Think of a Schema as a blueprint — it tells MongoDB exactly what
// fields each user document should have, and what rules they must follow.

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the User schema (the shape/structure of every user document)
const userSchema = new mongoose.Schema(
  {
    // The user's display name (e.g., "Harry Potter")
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true, // Removes extra spaces from both ends
      minlength: [2, 'Username must be at least 2 characters'],
      maxlength: [50, 'Username cannot exceed 50 characters'],
    },

    // The user's email address — must be unique across all users
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // No two users can share the same email
      lowercase: true, // Automatically converts to lowercase before saving
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },

    // The user's hashed password (NEVER stored as plain text!)
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // IMPORTANT: This means password won't be returned in queries by default
    },

    // Optional profile image URL
    profileImage: {
      type: String,
      default: '',
    },
  },
  {
    // Mongoose "timestamps" option automatically adds:
    // - createdAt: when the document was first created
    // - updatedAt: when the document was last modified
    timestamps: true,
  }
);

// ============================================
// PRE-SAVE MIDDLEWARE (runs BEFORE saving to DB)
// ============================================
// Every time a user document is saved, this middleware checks if the
// password field was changed. If it was, it hashes the password automatically.
// This way, we NEVER accidentally store a plain-text password.
userSchema.pre('save', async function (next) {
  // "this" refers to the user document being saved.
  // If the password hasn't been modified (e.g., user only changed their name),
  // skip the hashing and move on.
  if (!this.isModified('password')) return next();

  // Generate a "salt" — random data mixed into the hash for extra security.
  // The number 12 is the "salt rounds" (higher = more secure but slower).
  const salt = await bcrypt.genSalt(12);

  // Hash the plain-text password with the salt.
  // After this, the password is a long unreadable string like "$2a$12$xyz..."
  this.password = await bcrypt.hash(this.password, salt);

  next(); // Continue saving the document
});

// ============================================
// INSTANCE METHOD: Compare Passwords
// ============================================
// This is a custom method we attach to every User document.
// It lets us check if a plain-text password (from login form) matches
// the hashed password stored in the database.
userSchema.methods.comparePassword = async function (candidatePassword) {
  // bcrypt.compare() takes the plain password and the hash,
  // then returns true if they match, false if they don't.
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create and export the User model.
// Mongoose will automatically create a "users" collection in MongoDB.
const User = mongoose.model('User', userSchema);

export default User;
