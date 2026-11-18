import api from './api';

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteAvatar: () => api.delete('/users/avatar'),
  deleteAccount: (password) => api.delete('/users/account', { data: { password } }),
};
