const User = require('../models/User');
const Resume = require('../models/Resume');
const Analytics = require('../models/Analytics');
const Template = require('../models/Template');

// @desc    Admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalResumes, totalDownloads, recentUsers] = await Promise.all([
      User.countDocuments(),
      Resume.countDocuments(),
      Resume.aggregate([{ $group: { _id: null, total: { $sum: '$downloadCount' } } }]),
      User.find().sort('-createdAt').limit(5).select('name email plan createdAt')
    ]);

    const aiUsage = await Analytics.countDocuments({ event: 'ai_used' });
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: last30Days } });
    const activeUsers = await Analytics.distinct('user', { createdAt: { $gte: last30Days } });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalResumes,
        totalDownloads: totalDownloads[0]?.total || 0,
        totalAIUsage: aiUsage,
        newUsersThisMonth,
        activeUsersThisMonth: activeUsers.length,
        recentUsers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getUsers = async (req, res, next) => {
  try {
    const { search, plan, role, page = 1, limit = 20 } = req.query;
    const query = {};
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    if (plan) query.plan = plan;
    if (role) query.role = role;

    const users = await User.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({ success: true, data: users, pagination: { page: parseInt(page), limit: parseInt(limit), total } });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user (admin)
// @route   PUT /api/admin/users/:id
// @access  Admin
const updateUser = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'role', 'plan', 'isActive', 'aiUsageLimit'];
    const updates = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Admin
const getAnalytics = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const eventStats = await Analytics.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: '$event', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const dailyRegistrations = await User.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({ success: true, data: { eventStats, dailyRegistrations } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getUsers, updateUser, getAnalytics };
