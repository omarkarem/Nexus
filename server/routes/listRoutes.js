import express from 'express';
import { getLists, createList, updateList, deleteList } from '../controllers/listController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

// All list routes require authentication
router.use(authenticateToken);

// @route   GET /api/lists
// @desc    Get all lists for current user
router.get('/', getLists);

// @route   POST /api/lists
// @desc    Create a new list
router.post('/', upload.single('image'), createList);

// @route   PUT /api/lists/:id
// @desc    Update a list
router.put('/:id', upload.single('image'), updateList);

// @route   DELETE /api/lists/:id
// @desc    Delete a list
router.delete('/:id', deleteList);

export default router;