const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  switchRole,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/switch-role', protect, switchRole);
router.put('/profile', protect, updateProfile);

module.exports = router;