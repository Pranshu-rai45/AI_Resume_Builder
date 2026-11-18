import api from './api';

export const atsService = {
  checkATS: (resumeId) => api.post(`/ats/check/${resumeId}`),
  analyzeATS: (resumeData) => api.post('/ats/analyze', resumeData),
};
