// src/utils/api.js
import axios from 'axios';

// Configurable API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Handle the nested response structure from the backend
    if (response.data && response.data.body) {
      return { ...response, data: response.data.body };
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle unauthorized - clear and redirect
      if (status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }

      // Friendly error messages
      if (data?.message) {
        error.message = data.message;
      } else if (data?.body?.message) {
        error.message = data.body.message;
      } else {
        switch (status) {
          case 400:
            error.message = 'Bad request';
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

// Auth Service
class AuthService {
  static async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email: email.toLowerCase().trim(),
        password,
      });

      // Handle the specific response format from the backend
      if (response.data && response.data.success) {
        const responseData = response.data.data;
        
        if (responseData && responseData.token) {
          const { token, ...userData } = responseData;
          
          // Store auth data
          localStorage.setItem('authToken', token);
          localStorage.setItem('userData', JSON.stringify(userData));
          localStorage.setItem('userId', userData.userId);
          localStorage.setItem('role', userData.role);
          
          return { token, user: userData };
        }
      }
      
      throw new Error(response.data?.message || 'Invalid response format from server');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Login failed. Please try again.';
      throw new Error(errorMessage);
    }
  }

  static async validateToken(token) {
    try {
      const response = await apiClient.get('/auth/validate-token', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.status === 200;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  static async register(userData) {
    try {
      const response = await apiClient.post('/users/register', {
        ...userData,
        email: userData.email.toLowerCase().trim(),
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          'Registration failed. Please try again.';
      throw new Error(errorMessage);
    }
  }

  static logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  }

  static getCurrentUser() {
    try {
      const data = localStorage.getItem('userData');
      return data ? JSON.parse(data) : null;
    } catch (err) {
      return null;
    }
  }

  static getToken() {
    return localStorage.getItem('authToken');
  }

  static isAuthenticated() {
    return !!(this.getToken() && this.getCurrentUser());
  }

  static getUserRole() {
    return this.getCurrentUser()?.role || null;
  }

  static isAdmin() {
    return this.getUserRole() === 'ADMIN';
  }

  static isUser() {
    return this.getUserRole() === 'USER';
  }

  static isAgent() {
    return this.getUserRole() === 'AGENT';
  }
}

export { apiClient };
export default AuthService;