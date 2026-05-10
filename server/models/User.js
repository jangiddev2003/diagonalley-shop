// ============================================
// USER MODEL (Mongoose Schema)
// ============================================
// Full schema with Hogwarts house, avatar, role, lastLogin, and sorting fields.

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const HOUSES = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'];
const ROLES  = ['user', 'admin'];

// House → default avatar mapping
const HOUSE_AVATARS = {
  Gryffindor: 'gryffindor',
  Hufflepuff:  'hufflepuff',
  Ravenclaw:   'ravenclaw',
  Slytherin:   'slytherin',
};

const userSchema = new mongoose.Schema(
  {
    // ── Basic Identity ──────────────────────────────────────────────
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [2, 'Username must be at least 2 characters'],
      maxlength: [50, 'Username cannot exceed 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never returned in normal queries
    },

    // ── Hogwarts Profile ────────────────────────────────────────────
    // Which house the sorting hat assigned (null until ceremony is run)
    hogwartsHouse: {
      type: String,
      enum: [...HOUSES, null],
      default: null,
    },

    // Whether the sorting ceremony has been completed for this user
    sortingCompleted: {
      type: Boolean,
      default: false,
    },

    // Current avatar key (one of the four house slugs)
    // Defaults to the user's house avatar; can be changed manually
    avatar: {
      type: String,
      enum: ['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin', ''],
      default: '',
    },

    // ── Meta ────────────────────────────────────────────────────────
    role: {
      type: String,
      enum: ROLES,
      default: 'user',
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    // Activity log – last 20 entries kept
    activityLog: {
      type: [
        {
          action: String,
          timestamp: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// ── Pre-save: hash password ──────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance Method: compare password ───────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Instance Method: add activity log entry ──────────────────────────
userSchema.methods.logActivity = function (action) {
  this.activityLog.push({ action, timestamp: new Date() });
  // Keep only the last 20 entries
  if (this.activityLog.length > 20) {
    this.activityLog = this.activityLog.slice(-20);
  }
};

// ── Static: get default avatar for a house ───────────────────────────
userSchema.statics.defaultAvatarForHouse = function (house) {
  return HOUSE_AVATARS[house] || '';
};

const User = mongoose.model('User', userSchema);

export { HOUSES };
export default User;
