// ============================================
// USER ROUTES
// All routes here require a valid JWT token (protect middleware).
// ============================================

import express from 'express';
import protect from '../middleware/auth.js';
import {
  getProfile,
  updateAvatar,
  updateProfile,
  assignHouse,
  checkAuth,
} from '../controllers/userController.js';

const router = express.Router();

// All routes below are protected — the user must be logged in
router.use(protect);

router.get('/profile',    getProfile);    // GET  /api/user/profile
router.put('/avatar',     updateAvatar);  // PUT  /api/user/avatar
router.put('/update',     updateProfile); // PUT  /api/user/update
router.post('/sort',      assignHouse);   // POST /api/user/sort
router.get('/check-auth', checkAuth);     // GET  /api/user/check-auth

export default router;
