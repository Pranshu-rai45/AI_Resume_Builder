import api from './api';

export const aiService = {
  getUsage: () => api.get('/ai/usage'),
  generateSummary: (data) => api.post('/ai/summary', data),
  generateExperience: (data) => api.post('/ai/experience', data),
  generateProject: (data) => api.post('/ai/project', data),
  suggestSkills: (data) => api.post('/ai/skills', data),
  generateObjective: (data) => api.post('/ai/objective', data),
  generateAchievements: (data) => api.post('/ai/achievements', data),
  generateCoverLetter: (data) => api.post('/ai/cover-letter', data),
  generateLinkedIn: (data) => api.post('/ai/linkedin', data),
  improveGrammar: (text) => api.post('/ai/improve-grammar', { text }),
  rewriteContent: (text, style) => api.post('/ai/rewrite', { text, style }),
  getATSSuggestions: (data) => api.post('/ai/ats-suggestions', data),
};
