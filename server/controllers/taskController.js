import Task from '../models/Task.js';
import List from '../models/List.js';
import { emitToUser, SOCKET_EVENTS } from '../config/socket.js';

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
    const { title, board, listId } = req.body;

    // Get the highest order number for the board in this list
    const highestOrderTask = await Task.findOne({ 
      list: listId, 
      board: board, 
      owner: req.user.id 
    }).sort({ order: -1 });

    // Get the highest allListsOrder for this user
    const highestAllListsOrderTask = await Task.findOne({ 
      owner: req.user.id 
    }).sort({ allListsOrder: -1 });

    const newOrder = highestOrderTask ? highestOrderTask.order + 1 : 0;
    const newAllListsOrder = highestAllListsOrderTask ? highestAllListsOrderTask.allListsOrder + 1 : 0;

    // Create the task
    const task = await Task.create({
      title: title.trim(),
      board: board || 'backlog',
      originalBoard: board || 'backlog',
      lastBoard: board || 'backlog',
      order: newOrder,
      allListsOrder: newAllListsOrder,
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
      allListsOrder: task.allListsOrder,
      subTasks: task.subTasks
    };

    // Emit WebSocket event for real-time updates
    emitToUser(req.user.id, SOCKET_EVENTS.TASK_CREATED, {
      task: formattedTask,
      listId: listId
    });

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

    // Emit WebSocket event for real-time updates
    emitToUser(req.user.id, SOCKET_EVENTS.TASK_UPDATED, {
      task: formattedTask
    });

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

    // Emit WebSocket event for real-time updates
    emitToUser(req.user.id, SOCKET_EVENTS.TASK_DELETED, {
      taskId: taskId
    });

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

    // Emit WebSocket event for real-time updates
    emitToUser(req.user.id, SOCKET_EVENTS.TASK_MOVED, {
      task: formattedTask
    });

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

    // Emit WebSocket event for real-time updates
    emitToUser(req.user.id, SOCKET_EVENTS.TASK_REORDERED, {
      tasks: tasks,
      type: 'regular'
    });

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

    // Emit WebSocket event for real-time updates
    emitToUser(req.user.id, SOCKET_EVENTS.SUBTASK_CREATED, {
      taskId: taskId,
      subTask: {
        id: newSubTask._id,
        title: newSubTask.title,
        completed: newSubTask.completed
      }
    });

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

    // Emit WebSocket event for real-time updates
    emitToUser(req.user.id, SOCKET_EVENTS.SUBTASK_UPDATED, {
      taskId: taskId,
      subTask: {
        id: subTask._id,
        title: subTask.title,
        completed: subTask.completed
      }
    });

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

    // Emit WebSocket event for real-time updates
    emitToUser(req.user.id, SOCKET_EVENTS.SUBTASK_DELETED, {
      taskId: taskId,
      subTaskId: subTaskId
    });

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

/**
 * Get all tasks for "All Lists" view
 * @route GET /api/tasks/all-lists
 */
const getAllTasksForUser = async (req, res) => {
  try {
    // Get all tasks for this user
    let tasks = await Task.find({ owner: req.user.id })
      .populate('list', 'title color imageUrl')
      .sort({ board: 1, allListsOrder: 1 });

    // Check if any tasks don't have allListsOrder set
    const tasksWithoutAllListsOrder = tasks.filter(task => task.allListsOrder === undefined || task.allListsOrder === null);
    
    if (tasksWithoutAllListsOrder.length > 0) {
      console.log('🔄 Found tasks without allListsOrder, setting them now...');
      
      // Set allListsOrder for tasks that don't have it
      let currentAllListsOrder = 0;
      for (const task of tasks) {
        if (task.allListsOrder === undefined || task.allListsOrder === null) {
          task.allListsOrder = currentAllListsOrder++;
          await task.save();
        } else {
          currentAllListsOrder = Math.max(currentAllListsOrder, task.allListsOrder + 1);
        }
      }
      
      // Re-fetch tasks with updated allListsOrder
      tasks = await Task.find({ owner: req.user.id })
        .populate('list', 'title color imageUrl')
        .sort({ board: 1, allListsOrder: 1 });
        
      console.log('✅ Updated allListsOrder for existing tasks');
    }

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
      allListsOrder: task.allListsOrder,
      listInfo: {
        id: task.list._id,
        title: task.list.title,
        color: task.list.color,
        imageUrl: task.list.imageUrl
      },
      subTasks: task.subTasks.map(subTask => ({
        id: subTask._id,
        title: subTask.title,
        completed: subTask.completed
      }))
    }));

    console.log('📝 Returning', formattedTasks.length, 'tasks for All Lists view');

    res.status(200).json({
      success: true,
      tasks: formattedTasks
    });
  } catch (error) {
    console.error('Error fetching all tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks'
    });
  }
};

/**
 * Reorder tasks in "All Lists" view
 * @route PUT /api/tasks/reorder-all-lists
 */
const reorderTasksAllLists = async (req, res) => {
  try {
    const { tasks } = req.body; // Array of { taskId, allListsOrder }
    
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ success: false, message: 'Tasks array is required' });
    }
    
    console.log('🔄 Reordering tasks in All Lists:', tasks);
    
    // Update all tasks' allListsOrder in sequence
    for (const { taskId, allListsOrder } of tasks) {
      await Task.findOneAndUpdate(
        { _id: taskId, owner: req.user.id },
        { allListsOrder: allListsOrder },
        { new: true }
      );
    }
    
    console.log('✅ All Lists order updated successfully');
    
    // Emit WebSocket event for real-time updates
    emitToUser(req.user.id, SOCKET_EVENTS.TASK_REORDERED, {
      tasks: tasks,
      type: 'allLists'
    });
    
    res.status(200).json({ success: true, message: 'All Lists order updated successfully' });
  } catch (error) {
    console.error('Error reordering All Lists tasks:', error);
    res.status(500).json({ success: false, message: 'Failed to reorder All Lists tasks' });
  }
};

/**
 * Delete all completed tasks for a specific list
 * @route DELETE /api/tasks/list/:listId/completed
 */
const deleteAllCompletedTasks = async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`🗑️ [PERF-${requestId}] Starting deleteAllCompletedTasks request`);
  
  try {
    const { listId } = req.params;
    const startTime = Date.now();

    // Check if this is an "All Lists" request
    const list = await List.findById(listId);
    let result;

    if (list && (list.isAllLists || list.title === 'All Lists')) {
      console.log(`🎯 [PERF-${requestId}] Deleting all completed tasks from All Lists view`);
      // Delete all completed tasks for this user (from all lists)
      result = await Task.deleteMany({ 
        owner: req.user.id, 
        completed: true 
      });
    } else {
      console.log(`📝 [PERF-${requestId}] Deleting completed tasks from specific list: ${listId}`);
      // Delete all completed tasks for this specific list and owner
      result = await Task.deleteMany({ 
        list: listId, 
        owner: req.user.id, 
        completed: true 
      });
    }

    console.log(`✅ [PERF-${requestId}] Deleted ${result.deletedCount} completed tasks in ${Date.now() - startTime}ms`);

    // Emit WebSocket event for real-time updates
    const isAllLists = list && (list.isAllLists || list.title === 'All Lists');
    emitToUser(req.user.id, SOCKET_EVENTS.TASKS_DELETED_BULK, {
      listId: listId,
      isAllLists: isAllLists,
      deletedCount: result.deletedCount
    });

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} completed tasks`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error(`❌ [PERF-${requestId}] Error deleting completed tasks:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete completed tasks'
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
  getAllTasksForUser,
  reorderTasksAllLists,
  addSubTask, 
  updateSubTask, 
  deleteSubTask,
  deleteAllCompletedTasks
}; 