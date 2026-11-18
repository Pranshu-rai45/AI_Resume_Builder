const express = require('express');
const router = express.Router();
const { register, login, getMe, logout, forgotPassword, resetPassword, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

router.post('/register', rateLimiter.auth, register);
router.post('/login', rateLimiter.auth, login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.post('/forgot-password', rateLimiter.passwordReset, forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.put('/change-password', protect, changePassword);

module.exports = router;
