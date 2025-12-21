import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const portfolioAPI = {
  get: () => api.get('/portfolio'),
  save: (data) => api.post('/portfolio', data),
  delete: () => api.delete('/portfolio'),
  getPublic: (username) => api.get(`/portfolio/public/${username}`),
  uploadImage: (formData) => api.post('/portfolio/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export default api;