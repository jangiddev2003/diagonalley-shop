// ============================================
// USER CONTROLLER
// Handles profile retrieval, avatar update, house assignment (sorting),
// profile update, and auth-check endpoints.
// ============================================

import User, { HOUSES } from '../models/User.js';

// ── Helper ──────────────────────────────────────────────────────────
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
// GET /api/user/profile  (protected)
// Returns the full profile of the logged-in user.
// ──────────────────────────────────────────────────────────────────────
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    res.status(200).json({ success: true, user: safeUser(user) });
  } catch (error) {
    console.error('GetProfile Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ──────────────────────────────────────────────────────────────────────
// PUT /api/user/avatar  (protected)
// Body: { avatar: 'gryffindor' | 'hufflepuff' | 'ravenclaw' | 'slytherin' }
// ──────────────────────────────────────────────────────────────────────
export const updateAvatar = async (req, res) => {
  const VALID_AVATARS = ['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin'];
  const { avatar } = req.body;

  if (!avatar || !VALID_AVATARS.includes(avatar)) {
    return res.status(400).json({ success: false, message: 'Invalid avatar. Choose a valid Hogwarts house avatar.' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    user.avatar = avatar;
    user.logActivity(`Changed avatar to ${avatar}`);
    await user.save();

    res.status(200).json({ success: true, message: 'Avatar updated! ✨', user: safeUser(user) });
  } catch (error) {
    console.error('UpdateAvatar Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ──────────────────────────────────────────────────────────────────────
// PUT /api/user/update  (protected)
// Body: { username? }  — only safe fields allowed
// ──────────────────────────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    if (username && username.trim().length >= 2) {
      user.username = username.trim();
    }

    user.logActivity('Updated profile');
    await user.save();

    res.status(200).json({ success: true, message: 'Profile updated!', user: safeUser(user) });
  } catch (error) {
    console.error('UpdateProfile Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ──────────────────────────────────────────────────────────────────────
// POST /api/user/sort  (protected)
// Runs the Sorting Hat ceremony. Can only be done once.
// Body: (none required — house is randomly assigned on the server)
// ──────────────────────────────────────────────────────────────────────
export const assignHouse = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    // Idempotency: if already sorted, just return the existing house
    if (user.sortingCompleted && user.hogwartsHouse) {
      return res.status(200).json({
        success: true,
        alreadySorted: true,
        message: `You have already been sorted into ${user.hogwartsHouse}!`,
        house: user.hogwartsHouse,
        user: safeUser(user),
      });
    }

    // Randomly assign a house
    const house = HOUSES[Math.floor(Math.random() * HOUSES.length)];
    user.hogwartsHouse    = house;
    user.sortingCompleted = true;
    user.avatar           = house.toLowerCase(); // Set default house avatar
    user.logActivity(`Sorted into ${house} by the Sorting Hat`);
    await user.save();

    res.status(200).json({
      success: true,
      alreadySorted: false,
      message: `The Sorting Hat has spoken! Welcome to ${house}! 🎩`,
      house,
      user: safeUser(user),
    });
  } catch (error) {
    console.error('AssignHouse Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ──────────────────────────────────────────────────────────────────────
// GET /api/user/check-auth  (protected)
// Lightweight auth check — just confirms the token is valid.
// ──────────────────────────────────────────────────────────────────────
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    res.status(200).json({ success: true, authenticated: true, user: safeUser(user) });
  } catch (error) {
    console.error('CheckAuth Error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
