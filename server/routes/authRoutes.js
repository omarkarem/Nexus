import express from 'express';
import {
  register,
  login,
  getProfile,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  logout
} from '../controllers/authController.js';

import {
  validateRegistration,
  validateLogin,
  validatePasswordResetRequest,
  validatePasswordReset,
  sanitizeInput
} from '../middleware/validationMiddleware.js';

import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegistration, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, login);

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private (requires authentication)
router.get('/profile', authenticateToken, getProfile);

// @route   POST /api/auth/verify-email
// @desc    Verify user email address
// @access  Public
router.post('/verify-email', sanitizeInput, verifyEmail);

// @route   POST /api/auth/forgot-password
// @desc    Request password reset email
// @access  Public
router.post('/forgot-password', validatePasswordResetRequest, requestPasswordReset);

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', validatePasswordReset, resetPassword);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private (requires authentication)
router.post('/logout', authenticateToken, logout);

// @route   GET /api/auth/test
// @desc    Test route to check if auth routes are working
// @access  Public
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth routes are working! 🎉',
    timestamp: new Date().toISOString()
  });
});

export default router;

