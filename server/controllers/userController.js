const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  res.json({ success: true, data: req.user });
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'theme'];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, data: user, message: 'Profile updated successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload avatar
// @route   POST /api/users/avatar
// @access  Private
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file.' });
    }

    // Delete old avatar if exists
    const user = await User.findById(req.user._id);
    if (user.avatar) {
      const oldPath = path.join(__dirname, '..', user.avatar);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl }, { new: true });

    res.json({ success: true, data: { avatar: avatarUrl }, user: updatedUser, message: 'Avatar uploaded successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete avatar
// @route   DELETE /api/users/avatar
// @access  Private
const deleteAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.avatar) {
      const filePath = path.join(__dirname, '..', user.avatar);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await User.findByIdAndUpdate(req.user._id, { avatar: null });
    res.json({ success: true, message: 'Avatar removed.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete account
// @route   DELETE /api/users/account
// @access  Private
const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password.' });
    }
    await User.findByIdAndUpdate(req.user._id, { isActive: false });
    res.cookie('token', '', { expires: new Date(0), httpOnly: true });
    res.json({ success: true, message: 'Account deactivated.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, uploadAvatar, deleteAvatar, deleteAccount };
