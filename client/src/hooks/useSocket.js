import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// WebSocket event constants (matching backend)
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

const useSocket = (user, eventHandlers = {}) => {
  const socketRef = useRef(null);
  const isConnectedRef = useRef(false);

  useEffect(() => {
    if (!user || !user.token) {
      console.log('🔌 No user token, skipping socket connection');
      return;
    }

    // Don't create multiple connections
    if (socketRef.current && isConnectedRef.current) {
      console.log('🔌 Socket already connected, skipping');
      return;
    }

    console.log('🔌 Initializing WebSocket connection...');

    // Create socket connection
    socketRef.current = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
      auth: {
        token: user.token
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      console.log('✅ WebSocket connected:', socket.id);
      isConnectedRef.current = true;
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      isConnectedRef.current = false;
    });

    socket.on('connect_error', (error) => {
      console.error('🔌 WebSocket connection error:', error);
      isConnectedRef.current = false;
    });

    // Register event handlers
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      if (typeof handler === 'function') {
        console.log(`📡 Registering handler for event: ${event}`);
        socket.on(event, (data) => {
          console.log(`📨 Received ${event}:`, data);
          handler(data);
        });
      }
    });

    // Cleanup function
    return () => {
      console.log('🔌 Cleaning up WebSocket connection');
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
      }
      socketRef.current = null;
      isConnectedRef.current = false;
    };
  }, [user?.token, user?.id]); // Re-run if user token changes

  // Update event handlers when they change
  useEffect(() => {
    if (!socketRef.current || !isConnectedRef.current) return;

    const socket = socketRef.current;

    // Remove old handlers
    Object.values(SOCKET_EVENTS).forEach(event => {
      socket.removeAllListeners(event);
    });

    // Register new handlers
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      if (typeof handler === 'function') {
        socket.on(event, (data) => {
          console.log(`📨 Received ${event}:`, data);
          handler(data);
        });
      }
    });
  }, [eventHandlers]);

  return {
    socket: socketRef.current,
    isConnected: isConnectedRef.current,
    emit: (event, data) => {
      if (socketRef.current && isConnectedRef.current) {
        console.log(`📤 Emitting ${event}:`, data);
        socketRef.current.emit(event, data);
      } else {
        console.warn('⚠️ Socket not connected, cannot emit:', event);
      }
    }
  };
};

export default useSocket;
