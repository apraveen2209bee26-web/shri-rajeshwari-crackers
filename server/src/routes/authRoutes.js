import express from 'express';

import {
  getCurrentUser,
  loginAdmin,
  loginUser,
  registerUser,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin/login', loginAdmin);
router.get('/me', protect, getCurrentUser);
router.patch('/profile', protect, updateProfile);

export default router;

