import axios from 'axios';

import API_URL from '../config';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const articlesAPI = {
  getAll: (params) => api.get('/articles', { params }),
  getFeatured: () => api.get('/articles/featured'),
  getById: (id) => api.get(`/articles/${id}`),
  create: (data) => api.post('/articles', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/articles/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/articles/${id}`),
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
  create: (data) => api.post('/categories', data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const commentsAPI = {
  getByArticle: (articleId) => api.get(`/comments/article/${articleId}`),
  getAll: (params) => api.get('/comments', { params }),
  create: (data) => api.post('/comments', data),
  approve: (id) => api.put(`/comments/${id}/approve`),
  delete: (id) => api.delete(`/comments/${id}`),
};

export const favoritesAPI = {
  getAll: () => api.get('/favorites'),
  add: (article_id) => api.post('/favorites', { article_id }),
  remove: (id) => api.delete(`/favorites/${id}`),
  check: (articleId) => api.get(`/favorites/check/${articleId}`),
};

export const uploadAPI = {
  image: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  toggleUserRole: (id) => api.put(`/admin/users/${id}/role`),
};

export default api;
