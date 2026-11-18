const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const { getStats, getUsers, updateUser, getAnalytics } = require('../controllers/adminController');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.get('/analytics', getAnalytics);

module.exports = router;
