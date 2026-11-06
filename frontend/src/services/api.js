import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthenticated responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const resumeService = {
  getAll: () => api.get('/resumes'),
  getById: (id) => api.get(`/resumes/${id}`),
  create: (data) => api.post('/resumes', data),
  update: (id, data) => api.put(`/resumes/${id}`, data),
  duplicate: (id) => api.post(`/resumes/${id}/duplicate`),
  delete: (id) => api.delete(`/resumes/${id}`),
  importParsed: (data) => api.post('/resumes/import-parsed', data),
};

export const templateService = {
  getAll: () => api.get('/templates'),
};

export const aiService = {
  generateSummary: (payload) => api.post('/ai/summary', payload),
  improveBullet: (payload) => api.post('/ai/bullet', payload),
  rewriteDescription: (payload) => api.post('/ai/rewrite', payload),
  suggestSkills: (payload) => api.post('/ai/skills', payload),
  optimizeJD: (payload) => api.post('/ai/optimize-jd', payload),
};

export const atsService = {
  analyze: (payload) => api.post('/ats/analyze', payload),
  getHistory: (resumeId) => api.get(`/ats/history/${resumeId}`),
  uploadAndScan: (formData) => api.post('/ats/upload-and-scan', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export const pdfService = {
  getDownloadUrl: (resumeId) => `${API_BASE_URL}/pdf/${resumeId}`,
  exportPdf: (resumeData) => api.post('/pdf/export', { resume_data: resumeData }, { responseType: 'blob' }),
};

export default api;
