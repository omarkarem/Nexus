import express from 'express';
import {
  getTasksByList, createTask, updateTask, deleteTask, moveTask, reorderTasks,
  getAllTasksForUser, reorderTasksAllLists,
  addSubTask, updateSubTask, deleteSubTask
} from '../controllers/taskController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All task routes require authentication
router.use(authenticateToken);

// Task CRUD operations
router.get('/list/:listId', getTasksByList);    // GET /api/tasks/list/:listId
router.get('/all-lists', getAllTasksForUser);   // GET /api/tasks/all-lists
router.post('/', createTask);                   // POST /api/tasks

// Task movement and reordering - MUST come before /:taskId routes
router.put('/reorder', reorderTasks);           // PUT /api/tasks/reorder
router.put('/reorder-all-lists', reorderTasksAllLists); // PUT /api/tasks/reorder-all-lists
router.put('/:taskId/move', moveTask);          // PUT /api/tasks/:taskId/move

// Generic task operations - MUST come after specific routes
router.put('/:taskId', updateTask);             // PUT /api/tasks/:taskId
router.delete('/:taskId', deleteTask);          // DELETE /api/tasks/:taskId

// SubTask management
router.post('/:taskId/subtasks', addSubTask);                    // POST /api/tasks/:taskId/subtasks
router.put('/:taskId/subtasks/:subTaskId', updateSubTask);       // PUT /api/tasks/:taskId/subtasks/:subTaskId
router.delete('/:taskId/subtasks/:subTaskId', deleteSubTask);    // DELETE /api/tasks/:taskId/subtasks/:subTaskId

export default router; 