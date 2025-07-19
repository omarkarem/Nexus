// Authentication utility functions

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user has valid token
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token || token.trim() === '') return false;

  try {
    // Check if token has proper JWT structure (header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token structure');
    }

    // Check if parts are valid base64 strings
    if (!parts[0] || !parts[1] || !parts[2]) {
      throw new Error('Invalid JWT token parts');
    }

    // Decode JWT payload to check expiration
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    
    // Check if token has expiration and if it's expired
    if (payload.exp && payload.exp < currentTime) {
      // Session expired - clear data
      clearAuthData();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    // Invalid token
    return false;
  }
};

/**
 * Get current user data from JWT token payload
 * @returns {object|null} - User object or null
 */
export const getCurrentUser = () => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role || 'user'
    };
  } catch (error) {
    console.error('Error parsing token payload:', error);
    return null;
  }
};

/**
 * Get auth token from localStorage
 * @returns {string|null} - Token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Store authentication token only
 * @param {string} token - JWT token
 */
export const setAuthData = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Clear authentication data
 */
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user'); // Remove any legacy user data
};

/**
 * Get auth headers for API requests
 * @returns {object} - Headers object with Authorization
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

/**
 * Check if user has specific role
 * @param {string} role - Role to check
 * @returns {boolean} - True if user has role
 */
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user && user.role === role;
};

/**
 * Redirect to login page
 */
export const redirectToLogin = () => {
  window.location.href = '/login';
}; 