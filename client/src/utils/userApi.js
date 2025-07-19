import { buildApiUrl, getAuthHeaders } from '../config/api';

/**
 * Fetch current user profile from server
 * @returns {Promise<object|null>} - User profile data or null
 */
export const fetchUserProfile = async () => {
  try {
    const response = await fetch(buildApiUrl('/api/auth/profile'), {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (data.success) {
      return data.user;
    } else {
      console.error('Failed to fetch user profile:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

/**
 * Update user profile on server
 * @param {object} profileData - Updated profile data
 * @returns {Promise<object|null>} - Updated user data or null
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await fetch(buildApiUrl('/api/auth/profile'), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });

    const data = await response.json();
    
    if (data.success) {
      return data.user;
    } else {
      console.error('Failed to update user profile:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
}; 