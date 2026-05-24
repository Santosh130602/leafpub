import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
const API_URL = 'https://leafpub-1.onrender.com/api';


const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bookleaf_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally - auto logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bookleaf_token');
      localStorage.removeItem('bookleaf_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
