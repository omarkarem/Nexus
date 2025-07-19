import { buildApiUrl, getAuthHeaders } from '../config/api';

/**
 * Fetch all tasks for a specific list
 * @param {string} listId - List ID
 * @returns {Promise<Array>} - Array of tasks or empty array
 */
export const fetchTasksByList = async (listId) => {
  try {
    const response = await fetch(buildApiUrl(`/api/tasks/list/${listId}`), {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (data.success && data.tasks) {
      return data.tasks;
    } else {
      console.error('Failed to fetch tasks:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

/**
 * Create a new task
 * @param {string} title - Task title
 * @param {string} board - Board name (backlog, thisWeek, today, Done)
 * @param {string} listId - List ID
 * @returns {Promise<object|null>} - Created task or null
 */
export const createTask = async (title, board, listId) => {
  try {
    const response = await fetch(buildApiUrl('/api/tasks'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title, board, listId })
    });

    const data = await response.json();
    
    if (data.success && data.task) {
      return data.task;
    } else {
      console.error('Failed to create task:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error creating task:', error);
    return null;
  }
};

/**
 * Update a task
 * @param {string} taskId - Task ID
 * @param {object} updates - Fields to update
 * @returns {Promise<object|null>} - Updated task or null
 */
export const updateTask = async (taskId, updates) => {
  try {
    const response = await fetch(buildApiUrl(`/api/tasks/${taskId}`), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });

    const data = await response.json();
    
    if (data.success && data.task) {
      return data.task;
    } else {
      console.error('Failed to update task:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error updating task:', error);
    return null;
  }
};

/**
 * Delete a task
 * @param {string} taskId - Task ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteTask = async (taskId) => {
  try {
    const response = await fetch(buildApiUrl(`/api/tasks/${taskId}`), {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (data.success) {
      return true;
    } else {
      console.error('Failed to delete task:', data.message);
      return false;
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
};

/**
 * Move a task between boards or update order
 * @param {string} taskId - Task ID
 * @param {string} targetBoard - Target board
 * @param {number} newOrder - New order position
 * @param {boolean} completedStatus - Completion status
 * @returns {Promise<object|null>} - Updated task or null
 */
export const moveTask = async (taskId, targetBoard, newOrder, completedStatus) => {
  try {
    const response = await fetch(buildApiUrl(`/api/tasks/${taskId}/move`), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ targetBoard, newOrder, completedStatus })
    });

    const data = await response.json();
    
    if (data.success && data.task) {
      return data.task;
    } else {
      console.error('Failed to move task:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error moving task:', error);
    return null;
  }
};

/**
 * Reorder multiple tasks
 * @param {Array} tasks - Array of {taskId, order} objects
 * @returns {Promise<boolean>} - Success status
 */
export const reorderTasks = async (tasks) => {
  try {
    const response = await fetch(buildApiUrl('/api/tasks/reorder'), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ tasks })
    });

    const data = await response.json();
    
    if (data.success) {
      return true;
    } else {
      console.error('Failed to reorder tasks:', data.message);
      return false;
    }
  } catch (error) {
    console.error('Error reordering tasks:', error);
    return false;
  }
};

/**
 * Add a subtask to a task
 * @param {string} taskId - Task ID
 * @param {string} title - Subtask title
 * @returns {Promise<object|null>} - Created subtask or null
 */
export const addSubTask = async (taskId, title) => {
  try {
    const response = await fetch(buildApiUrl(`/api/tasks/${taskId}/subtasks`), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title })
    });

    const data = await response.json();
    
    if (data.success && data.subTask) {
      return data.subTask;
    } else {
      console.error('Failed to add subtask:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error adding subtask:', error);
    return null;
  }
};

/**
 * Update a subtask
 * @param {string} taskId - Task ID
 * @param {string} subTaskId - Subtask ID
 * @param {object} updates - Fields to update
 * @returns {Promise<object|null>} - Updated subtask or null
 */
export const updateSubTask = async (taskId, subTaskId, updates) => {
  try {
    const response = await fetch(buildApiUrl(`/api/tasks/${taskId}/subtasks/${subTaskId}`), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });

    const data = await response.json();
    
    if (data.success && data.subTask) {
      return data.subTask;
    } else {
      console.error('Failed to update subtask:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error updating subtask:', error);
    return null;
  }
};

/**
 * Delete a subtask
 * @param {string} taskId - Task ID
 * @param {string} subTaskId - Subtask ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteSubTask = async (taskId, subTaskId) => {
  try {
    const response = await fetch(buildApiUrl(`/api/tasks/${taskId}/subtasks/${subTaskId}`), {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (data.success) {
      return true;
    } else {
      console.error('Failed to delete subtask:', data.message);
      return false;
    }
  } catch (error) {
    console.error('Error deleting subtask:', error);
    return false;
  }
}; 