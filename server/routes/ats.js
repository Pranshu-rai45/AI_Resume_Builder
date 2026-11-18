const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { checkATS, analyzeATS } = require('../controllers/atsController');

router.post('/check/:resumeId', protect, checkATS);
router.post('/analyze', protect, analyzeATS);

module.exports = router;
