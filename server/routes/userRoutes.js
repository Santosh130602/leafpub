const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const User = require('../models/User');

// GET /api/users/admins - Get list of admin users (for assignment)
router.get('/admins', protect, adminOnly, async (req, res, next) => {
  try {
    const admins = await User.find({ role: 'admin', isActive: true }, 'name email');
    res.json({ success: true, data: { admins } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
