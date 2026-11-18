const express = require('express');
const router = express.Router();
const { getResumes, getResume, getSharedResume, createResume, updateResume, deleteResume, duplicateResume, shareResume, trackDownload, getStats } = require('../controllers/resumeController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/stats', protect, getStats);
router.get('/share/:token', optionalAuth, getSharedResume);
router.route('/').get(protect, getResumes).post(protect, createResume);
router.route('/:id').get(protect, getResume).put(protect, updateResume).delete(protect, deleteResume);
router.post('/:id/duplicate', protect, duplicateResume);
router.post('/:id/share', protect, shareResume);
router.post('/:id/download', protect, trackDownload);

module.exports = router;
