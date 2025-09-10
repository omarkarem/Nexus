import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

let io;

/**
 * Initialize Socket.IO server
 * @param {Object} server - HTTP server instance
 */
export const initializeSocket = (server) => {
  // Configure CORS for WebSocket connections
  const corsOrigin = process.env.CLIENT_URL || "*";
  console.log('🔌 WebSocket CORS origin:', corsOrigin);
  
  io = new Server(server, {
    cors: {
      origin: corsOrigin,
      credentials: true,
      methods: ["GET", "POST"]
    },
    transports: ['websocket', 'polling']
  });

  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      // Add user to socket instance
      socket.user = user;
      socket.userId = user._id.toString();
      
      console.log(`🔌 User ${user.email} connected via WebSocket`);
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Handle new connections
  io.on('connection', (socket) => {
    console.log(`✅ Socket connected: ${socket.id} (User: ${socket.user.email})`);
    
    // Join user to their personal room for targeted updates
    socket.join(`user:${socket.userId}`);
    
    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`❌ Socket disconnected: ${socket.id} (Reason: ${reason})`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return io;
};

/**
 * Get the Socket.IO instance
 * @returns {Object} Socket.IO instance
 */
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initializeSocket first.');
  }
  return io;
};

/**
 * Emit event to a specific user
 * @param {string} userId - User ID to send the event to
 * @param {string} event - Event name
 * @param {Object} data - Event data
 */
export const emitToUser = (userId, event, data) => {
  if (io) {
    console.log(`📡 Emitting ${event} to user ${userId}:`, data);
    io.to(`user:${userId}`).emit(event, data);
  }
};

/**
 * Emit event to all connected clients
 * @param {string} event - Event name
 * @param {Object} data - Event data
 */
export const emitToAll = (event, data) => {
  if (io) {
    console.log(`📡 Broadcasting ${event} to all clients:`, data);
    io.emit(event, data);
  }
};

// WebSocket event constants
export const SOCKET_EVENTS = {
  // Task events
  TASK_CREATED: 'task:created',
  TASK_UPDATED: 'task:updated',
  TASK_DELETED: 'task:deleted',
  TASK_MOVED: 'task:moved',
  TASK_REORDERED: 'task:reordered',
  TASKS_DELETED_BULK: 'tasks:deleted_bulk',
  
  // Subtask events
  SUBTASK_CREATED: 'subtask:created',
  SUBTASK_UPDATED: 'subtask:updated',
  SUBTASK_DELETED: 'subtask:deleted',
  
  // List events
  LIST_CREATED: 'list:created',
  LIST_UPDATED: 'list:updated',
  LIST_DELETED: 'list:deleted',
  
  // Sync events
  SYNC_REQUESTED: 'sync:requested',
  SYNC_COMPLETED: 'sync:completed'
};
