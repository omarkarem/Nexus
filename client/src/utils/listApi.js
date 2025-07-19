import { buildApiUrl, getAuthHeaders } from '../config/api';

/**
 * Fetch all lists for the current user
 * @returns {Promise<Array>} - Array of lists or empty array
 */
export const fetchLists = async () => {
  try {
    const response = await fetch(buildApiUrl('/api/lists'), {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (data.success && data.lists) {
      return data.lists;
    } else {
      console.error('Failed to fetch lists:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching lists:', error);
    return [];
  }
};

/**
 * Create a new list
 * @param {string} title - List title
 * @param {string} color - List color
 * @param {string} description - List description
 * @returns {Promise<object|null>} - Created list or null
 */
export const createList = async (title, color, description = '') => {
  try {
    const response = await fetch(buildApiUrl('/api/lists'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title, color, description })
    });

    const data = await response.json();
    
    if (data.success && data.list) {
      return data.list;
    } else {
      console.error('Failed to create list:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error creating list:', error);
    return null;
  }
};

/**
 * Update an existing list
 * @param {string} listId - List ID
 * @param {string} title - New title
 * @param {string} color - New color
 * @param {string} description - New description
 * @returns {Promise<object|null>} - Updated list or null
 */
export const updateList = async (listId, title, color, description) => {
  try {
    const response = await fetch(buildApiUrl(`/api/lists/${listId}`), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title, color, description })
    });

    const data = await response.json();
    
    if (data.success && data.list) {
      return data.list;
    } else {
      console.error('Failed to update list:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error updating list:', error);
    return null;
  }
};

/**
 * Delete a list
 * @param {string} listId - List ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteList = async (listId) => {
  try {
    const response = await fetch(buildApiUrl(`/api/lists/${listId}`), {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (data.success) {
      return true;
    } else {
      console.error('Failed to delete list:', data.message);
      return false;
    }
  } catch (error) {
    console.error('Error deleting list:', error);
    return false;
  }
}; 