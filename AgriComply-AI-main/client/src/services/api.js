import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create the axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a Request Interceptor
// This runs BEFORE every request is sent
api.interceptors.request.use(
  (config) => {
    // 1. Get the token from LocalStorage
    const token = localStorage.getItem('token');
    
    // 2. If token exists, attach it to the Headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
