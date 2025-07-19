import Task from '../models/Task.js';
import List from '../models/List.js';

/**
 * Get all tasks for a specific list
 * @route GET /api/tasks/list/:listId
 */
const getTasksByList = async (req, res) => {
  try {
    const { listId } = req.params;
    
    // Verify list exists and belongs to user
    const list = await List.findOne({ _id: listId, owner: req.user.id });
    if (!list) {
      return res.status(404).json({
        success: false,
        message: 'List not found'
      });
    }

    // Get all tasks for this list
    const tasks = await Task.find({ 
      list: listId, 
      owner: req.user.id 
    }).sort({ board: 1, order: 1 });

    // Format tasks for frontend
    const formattedTasks = tasks.map(task => ({
      id: task._id,
      title: task.title,
      note: task.note,
      completed: task.completed,
      board: task.board,
      originalBoard: task.originalBoard,
      lastBoard: task.lastBoard,
      order: task.order,
      subTasks: task.subTasks.map(subTask => ({
        id: subTask._id,
        title: subTask.title,
        completed: subTask.completed
      }))
    }));

    res.status(200).json({
      success: true,
      tasks: formattedTasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks'
    });
  }
};

/**
 * Create a new task
 * @route POST /api/tasks
 */
const createTask = async (req, res) => {
  try {
    const { title, board = 'backlog', listId } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    if (!listId) {
      return res.status(400).json({
        success: false,
        message: 'List ID is required'
      });
    }

    // Verify list exists and belongs to user
    const list = await List.findOne({ _id: listId, owner: req.user.id });
    if (!list) {
      return res.status(404).json({
        success: false,
        message: 'List not found'
      });
    }

    // Get the highest order number for this board in this list
    const lastTask = await Task.findOne({
      list: listId,
      board: board,
      owner: req.user.id
    }).sort({ order: -1 });

    const nextOrder = lastTask ? lastTask.order + 1 : 0;

    // Create new task
    const task = await Task.create({
      title: title.trim(),
      board: board,
      originalBoard: board,
      lastBoard: board,
      order: nextOrder,
      list: listId,
      owner: req.user.id
    });

    // Format response
    const formattedTask = {
      id: task._id,
      title: task.title,
      note: task.note,
      completed: task.completed,
      board: task.board,
      originalBoard: task.originalBoard,
      lastBoard: task.lastBoard,
      order: task.order,
      subTasks: []
    };

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: formattedTask
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task'
    });
  }
};

/**
 * Update a task
 * @route PUT /api/tasks/:taskId
 */
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, note, completed, board, originalBoard, order } = req.body;

    // Find task and verify ownership
    const task = await Task.findOne({ _id: taskId, owner: req.user.id });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Track lastBoard when moving between boards
    if (board !== undefined && board !== task.board) {
      task.lastBoard = task.board; // Always save current board as lastBoard before moving
    }

    // Update fields
    if (title !== undefined) task.title = title.trim();
    if (note !== undefined) task.note = note;
    if (completed !== undefined) task.completed = completed;
    if (board !== undefined) task.board = board;
    if (originalBoard !== undefined) task.originalBoard = originalBoard;
    if (order !== undefined) task.order = order;

    await task.save();

    // Format response
    const formattedTask = {
      id: task._id,
      title: task.title,
      note: task.note,
      completed: task.completed,
      board: task.board,
      originalBoard: task.originalBoard,
      lastBoard: task.lastBoard,
      order: task.order,
      subTasks: task.subTasks.map(subTask => ({
        id: subTask._id,
        title: subTask.title,
        completed: subTask.completed
      }))
    };

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task: formattedTask
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task'
    });
  }
};

/**
 * Delete a task
 * @route DELETE /api/tasks/:taskId
 */
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Find and delete task
    const task = await Task.findOneAndDelete({ _id: taskId, owner: req.user.id });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task'
    });
  }
};

/**
 * Move task between boards or reorder within board
 * @route PUT /api/tasks/:taskId/move
 */
const moveTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { targetBoard, newOrder, completedStatus } = req.body;

    // Find task and verify ownership
    const task = await Task.findOne({ _id: taskId, owner: req.user.id });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Track lastBoard when moving to a different board
    if (targetBoard !== undefined && targetBoard !== task.board) {
      task.lastBoard = task.board; // Always save current board as lastBoard before moving
    }

    // Update task
    if (targetBoard !== undefined) task.board = targetBoard;
    if (newOrder !== undefined) task.order = newOrder;
    if (completedStatus !== undefined) task.completed = completedStatus;

    await task.save();

    // Format response
    const formattedTask = {
      id: task._id,
      title: task.title,
      note: task.note,
      completed: task.completed,
      board: task.board,
      originalBoard: task.originalBoard,
      lastBoard: task.lastBoard,
      order: task.order,
      subTasks: task.subTasks.map(subTask => ({
        id: subTask._id,
        title: subTask.title,
        completed: subTask.completed
      }))
    };

    res.status(200).json({
      success: true,
      message: 'Task moved successfully',
      task: formattedTask
    });
  } catch (error) {
    console.error('Error moving task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to move task'
    });
  }
};

/**
 * Bulk update task orders (for reordering)
 * @route PUT /api/tasks/reorder
 */
const reorderTasks = async (req, res) => {
  try {
    const { tasks } = req.body; // Array of { taskId, order }

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tasks array is required'
      });
    }

    console.log('🔄 Reordering tasks:', tasks);

    // Update all tasks in sequence to ensure proper order
    for (const { taskId, order } of tasks) {
      await Task.findOneAndUpdate(
        { _id: taskId, owner: req.user.id },
        { order: order },
        { new: true }
      );
    }

    console.log('✅ Tasks reordered successfully');

    res.status(200).json({
      success: true,
      message: 'Tasks reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder tasks'
    });
  }
};

/**
 * Add a subtask to a task
 * @route POST /api/tasks/:taskId/subtasks
 */
const addSubTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Subtask title is required'
      });
    }

    // Find task and verify ownership
    const task = await Task.findOne({ _id: taskId, owner: req.user.id });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Add subtask
    task.subTasks.push({
      title: title.trim(),
      completed: false
    });

    await task.save();

    // Get the newly added subtask
    const newSubTask = task.subTasks[task.subTasks.length - 1];

    res.status(201).json({
      success: true,
      message: 'Subtask added successfully',
      subTask: {
        id: newSubTask._id,
        title: newSubTask.title,
        completed: newSubTask.completed
      }
    });
  } catch (error) {
    console.error('Error adding subtask:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add subtask'
    });
  }
};

/**
 * Update a subtask
 * @route PUT /api/tasks/:taskId/subtasks/:subTaskId
 */
const updateSubTask = async (req, res) => {
  try {
    const { taskId, subTaskId } = req.params;
    const { title, completed } = req.body;

    // Find task and verify ownership
    const task = await Task.findOne({ _id: taskId, owner: req.user.id });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Find subtask
    const subTask = task.subTasks.id(subTaskId);
    if (!subTask) {
      return res.status(404).json({
        success: false,
        message: 'Subtask not found'
      });
    }

    // Update subtask
    if (title !== undefined) subTask.title = title.trim();
    if (completed !== undefined) subTask.completed = completed;

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Subtask updated successfully',
      subTask: {
        id: subTask._id,
        title: subTask.title,
        completed: subTask.completed
      }
    });
  } catch (error) {
    console.error('Error updating subtask:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subtask'
    });
  }
};

/**
 * Delete a subtask
 * @route DELETE /api/tasks/:taskId/subtasks/:subTaskId
 */
const deleteSubTask = async (req, res) => {
  try {
    const { taskId, subTaskId } = req.params;

    // Find task and verify ownership
    const task = await Task.findOne({ _id: taskId, owner: req.user.id });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Remove subtask
    const subTask = task.subTasks.id(subTaskId);
    if (!subTask) {
      return res.status(404).json({
        success: false,
        message: 'Subtask not found'
      });
    }

    subTask.deleteOne();
    await task.save();

    res.status(200).json({
      success: true,
      message: 'Subtask deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subtask:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete subtask'
    });
  }
};

export {
  getTasksByList,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  reorderTasks,
  addSubTask,
  updateSubTask,
  deleteSubTask
}; 