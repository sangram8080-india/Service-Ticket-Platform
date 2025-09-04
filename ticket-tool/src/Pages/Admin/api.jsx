// src/utils/api.js
import axios from 'axios';

// Configurable API base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/',
  timeout: 10000, // 10 seconds
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Or use getToken() helper
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // FIX: Handle text/plain content type for enum endpoints
    if (typeof config.data === 'string' && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'text/plain';
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle unauthorized - clear and redirect
      if (status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
      }

      // Friendly error messages
      if (data?.message) {
        error.message = data.message;
      } else {
        switch (status) {
          case 400:
            error.message = 'Bad request. Please check your input.';
            break;
          case 404:
            error.message = 'Resource not found';
            break;
          case 500:
            error.message = 'Internal server error';
            break;
          default:
            error.message = `Unexpected error: ${status}`;
        }
      }
    } else if (error.request) {
      // No response received
      error.message = 'Network error: No response from server';
    } else {
      // Request setup error
      error.message = 'Error setting up request';
    }

    return Promise.reject(error);
  }
);

export default api;