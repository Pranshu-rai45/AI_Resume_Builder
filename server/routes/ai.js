const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');
const {
  checkAILimit, generateSummary, generateExperience, generateProject,
  suggestSkills, generateObjective, generateAchievements, generateCoverLetter,
  generateLinkedIn, improveGrammar, rewriteContent, getATSSuggestions, getUsage
} = require('../controllers/aiController');

const aiMiddleware = [protect, rateLimiter.ai, checkAILimit];

router.get('/usage', protect, getUsage);
router.post('/summary', aiMiddleware, generateSummary);
router.post('/experience', aiMiddleware, generateExperience);
router.post('/project', aiMiddleware, generateProject);
router.post('/skills', aiMiddleware, suggestSkills);
router.post('/objective', aiMiddleware, generateObjective);
router.post('/achievements', aiMiddleware, generateAchievements);
router.post('/cover-letter', aiMiddleware, generateCoverLetter);
router.post('/linkedin', aiMiddleware, generateLinkedIn);
router.post('/improve-grammar', aiMiddleware, improveGrammar);
router.post('/rewrite', aiMiddleware, rewriteContent);
router.post('/ats-suggestions', aiMiddleware, getATSSuggestions);

module.exports = router;
