const geminiService = require('../services/geminiService');
const Analytics = require('../models/Analytics');
const User = require('../models/User');

const trackAIUsage = async (userId, action) => {
  try {
    await User.findByIdAndUpdate(userId, { $inc: { aiUsageCount: 1 } });
    await Analytics.create({ user: userId, event: 'ai_used', metadata: { action } });
  } catch (e) { /* non-critical */ }
};

const checkAILimit = async (req, res, next) => {
  if (!req.user.canUseAI()) {
    return res.status(429).json({
      success: false,
      message: `AI usage limit reached (${req.user.aiUsageLimit}/month on free plan). Upgrade to Pro for unlimited AI.`,
      upgradeRequired: true
    });
  }
  next();
};

// @desc    Generate professional summary
// @route   POST /api/ai/summary
const generateSummary = async (req, res, next) => {
  try {
    const result = await geminiService.generateSummary(req.body);
    await trackAIUsage(req.user._id, 'summary');
    res.json({ success: true, data: result });
  } catch (error) {
    if (error.message?.includes('GEMINI_API_KEY')) {
      return res.status(503).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Generate experience description
// @route   POST /api/ai/experience
const generateExperience = async (req, res, next) => {
  try {
    const result = await geminiService.generateExperienceDescription(req.body);
    await trackAIUsage(req.user._id, 'experience');
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

// @desc    Generate project description
// @route   POST /api/ai/project
const generateProject = async (req, res, next) => {
  try {
    const result = await geminiService.generateProjectDescription(req.body);
    await trackAIUsage(req.user._id, 'project');
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

// @desc    Suggest skills
// @route   POST /api/ai/skills
const suggestSkills = async (req, res, next) => {
  try {
    const result = await geminiService.suggestSkills(req.body);
    await trackAIUsage(req.user._id, 'skills');
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

// @desc    Generate career objective
// @route   POST /api/ai/objective
const generateObjective = async (req, res, next) => {
  try {
    const result = await geminiService.generateObjective(req.body);
    await trackAIUsage(req.user._id, 'objective');
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

// @desc    Generate achievements
// @route   POST /api/ai/achievements
const generateAchievements = async (req, res, next) => {
  try {
    const result = await geminiService.generateAchievements(req.body);
    await trackAIUsage(req.user._id, 'achievements');
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

// @desc    Generate cover letter
// @route   POST /api/ai/cover-letter
const generateCoverLetter = async (req, res, next) => {
  try {
    const result = await geminiService.generateCoverLetter(req.body);
    await trackAIUsage(req.user._id, 'cover_letter');
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

// @desc    Generate LinkedIn about
// @route   POST /api/ai/linkedin
const generateLinkedIn = async (req, res, next) => {
  try {
    const result = await geminiService.generateLinkedInAbout(req.body);
    await trackAIUsage(req.user._id, 'linkedin');
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

// @desc    Improve grammar
// @route   POST /api/ai/improve-grammar
const improveGrammar = async (req, res, next) => {
  try {
    if (!req.body.text) {
      return res.status(400).json({ success: false, message: 'Text is required.' });
    }
    const result = await geminiService.improveGrammar(req.body.text);
    await trackAIUsage(req.user._id, 'grammar');
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

// @desc    Rewrite content
// @route   POST /api/ai/rewrite
const rewriteContent = async (req, res, next) => {
  try {
    if (!req.body.text) {
      return res.status(400).json({ success: false, message: 'Text is required.' });
    }
    const result = await geminiService.rewriteContent(req.body.text, req.body.style);
    await trackAIUsage(req.user._id, 'rewrite');
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

// @desc    Get ATS AI suggestions
// @route   POST /api/ai/ats-suggestions
const getATSSuggestions = async (req, res, next) => {
  try {
    const result = await geminiService.getATSSuggestions(req.body);
    await trackAIUsage(req.user._id, 'ats_suggestions');
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

// @desc    Get AI usage stats
// @route   GET /api/ai/usage
const getUsage = async (req, res) => {
  res.json({
    success: true,
    data: {
      used: req.user.aiUsageCount,
      limit: req.user.aiUsageLimit,
      plan: req.user.plan,
      resetDate: req.user.aiUsageResetDate,
      canUse: req.user.canUseAI()
    }
  });
};

module.exports = {
  checkAILimit, generateSummary, generateExperience, generateProject,
  suggestSkills, generateObjective, generateAchievements, generateCoverLetter,
  generateLinkedIn, improveGrammar, rewriteContent, getATSSuggestions, getUsage
};
