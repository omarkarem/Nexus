import express from 'express';
import { getLists, createList, updateList, deleteList } from '../controllers/listController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All list routes require authentication
router.use(authenticateToken);

// @route   GET /api/lists
// @desc    Get all lists for current user
router.get('/', getLists);

// @route   POST /api/lists
// @desc    Create a new list
router.post('/', createList);

// @route   PUT /api/lists/:id
// @desc    Update a list
router.put('/:id', updateList);

// @route   DELETE /api/lists/:id
// @desc    Delete a list
router.delete('/:id', deleteList);

export default router;