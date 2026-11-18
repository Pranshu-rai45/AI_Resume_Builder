import api from './api';

export const resumeService = {
  getResumes: (params) => api.get('/resumes', { params }),
  getResume: (id) => api.get(`/resumes/${id}`),
  getSharedResume: (token) => api.get(`/resumes/share/${token}`),
  createResume: (data) => api.post('/resumes', data),
  updateResume: (id, data) => api.put(`/resumes/${id}`, data),
  deleteResume: (id) => api.delete(`/resumes/${id}`),
  duplicateResume: (id) => api.post(`/resumes/${id}/duplicate`),
  shareResume: (id) => api.post(`/resumes/${id}/share`),
  trackDownload: (id) => api.post(`/resumes/${id}/download`),
  getStats: () => api.get('/resumes/stats'),
};
