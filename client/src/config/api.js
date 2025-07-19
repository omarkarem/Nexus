// API Configuration
const API_CONFIG = {
  // Base URL for backend API - Must be configured via REACT_APP_API_URL
  BASE_URL: process.env.REACT_APP_API_URL,
  
  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      PROFILE: '/api/auth/profile',
      VERIFY_EMAIL: '/api/auth/verify-email',
      REQUEST_PASSWORD_RESET: '/api/auth/request-password-reset',
      RESET_PASSWORD: '/api/auth/reset-password',
      LOGOUT: '/api/auth/logout'
    }
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  if (!API_CONFIG.BASE_URL) {
    throw new Error('REACT_APP_API_URL environment variable is not configured. Please set it in your .env file.');
  }
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Export the configuration
export default API_CONFIG; 