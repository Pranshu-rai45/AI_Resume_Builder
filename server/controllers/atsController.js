const Resume = require('../models/Resume');
const { calculateATSScore } = require('../services/atsService');
const Analytics = require('../models/Analytics');

// @desc    Check ATS score for a resume
// @route   POST /api/ats/check/:resumeId
// @access  Private
const checkATS = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.resumeId, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    const atsResult = calculateATSScore(resume.toObject());

    // Save to resume
    resume.atsScore = atsResult.score;
    resume.atsDetails = atsResult;
    await resume.save();

    await Analytics.create({ user: req.user._id, event: 'ats_checked', metadata: { resumeId: resume._id, score: atsResult.score } });

    res.json({ success: true, data: atsResult });
  } catch (error) {
    next(error);
  }
};

// @desc    Check ATS score for raw resume data (without saving)
// @route   POST /api/ats/analyze
// @access  Private
const analyzeATS = async (req, res, next) => {
  try {
    const atsResult = calculateATSScore(req.body);
    res.json({ success: true, data: atsResult });
  } catch (error) {
    next(error);
  }
};

module.exports = { checkATS, analyzeATS };
