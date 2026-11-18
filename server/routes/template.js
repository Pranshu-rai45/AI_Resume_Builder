const express = require('express');
const router = express.Router();
const Template = require('../models/Template');
const { protect } = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

// Get all active templates (public)
router.get('/', async (req, res, next) => {
  try {
    const templates = await Template.find({ isActive: true }).sort('name');
    res.json({ success: true, data: templates });
  } catch (error) { next(error); }
});

// Get single template
router.get('/:id', async (req, res, next) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ success: false, message: 'Template not found.' });
    res.json({ success: true, data: template });
  } catch (error) { next(error); }
});

// Admin: create template
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const template = await Template.create(req.body);
    res.status(201).json({ success: true, data: template });
  } catch (error) { next(error); }
});

// Admin: update template
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const template = await Template.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: template });
  } catch (error) { next(error); }
});

// Admin: delete template
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await Template.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Template deleted.' });
  } catch (error) { next(error); }
});

module.exports = router;
