const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const {
  authLimiter,
  passwordResetLimiter,
} = require('../middleware/rateLimiter');

router.post('/registerUser', authLimiter, userController.registerUser);
router.post('/loginUser', authLimiter, userController.loginUser);
router.post('/logoutUser', authLimiter, userController.logoutUser);
router.post(
  '/forgot-password',
  passwordResetLimiter,
  userController.forgotPassword
);
router.post(
  '/reset-password/:token',
  passwordResetLimiter,
  userController.resetPassword
);
router.get('/getProfile', auth, authLimiter, userController.getProfile);

module.exports = router;
