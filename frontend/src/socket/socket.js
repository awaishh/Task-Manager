import { io } from 'socket.io-client';

let socket = null;

/**
 * Initialize Socket.IO connection
 * @param {Object} options - Connection options
 * @param {string} [options.url] - Backend URL (default: same origin)
 * @param {string} [options.token] - JWT token for authentication
 * @returns {Socket} - Socket.IO client instance
 */
export const initSocket = (options = {}) => {
  const { url = '', token = '' } = options;

  if (socket) {
    console.log('⚠️ Socket already initialized, disconnecting first...');
    socket.disconnect();
    socket = null;
  }

  const socketUrl = url || window.location.origin;

  socket = io(socketUrl, {
    auth: {
      token: token || '',
    },
    withCredentials: true,
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  // Connection events
  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  return socket;
};

/**
 * Get the current socket instance
 */
export const getSocket = () => {
  if (!socket) {
    console.warn('⚠️ Socket not initialized. Call initSocket() first.');
  }
  return socket;
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('🔌 Socket disconnected');
  }
};

/**
 * Join a project room
 * @param {string} projectId
 */
export const joinProject = (projectId) => {
  if (socket) {
    socket.emit('join-project', projectId);
    console.log(`📁 Joining project: ${projectId}`);
  }
};

/**
 * Leave a project room
 * @param {string} projectId
 */
export const leaveProject = (projectId) => {
  if (socket) {
    socket.emit('leave-project', projectId);
    console.log(`📁 Leaving project: ${projectId}`);
  }
};

/**
 * Broadcast task update
 * @param {string} projectId
 * @param {string} taskId
 * @param {Object} updates
 */
export const broadcastTaskUpdate = (projectId, taskId, updates) => {
  if (socket) {
    socket.emit('task-update-request', { projectId, taskId, updates });
  }
};

/**
 * Broadcast task creation
 * @param {string} projectId
 * @param {Object} task
 */
export const broadcastTaskCreated = (projectId, task) => {
  if (socket) {
    socket.emit('task-created-broadcast', { projectId, task });
  }
};

/**
 * Broadcast task deletion
 * @param {string} projectId
 * @param {string} taskId
 */
export const broadcastTaskDeleted = (projectId, taskId) => {
  if (socket) {
    socket.emit('task-deleted-broadcast', { projectId, taskId });
  }
};

/**
 * Broadcast note update
 * @param {string} projectId
 * @param {string} noteId
 * @param {Object} updates
 */
export const broadcastNoteUpdate = (projectId, noteId, updates) => {
  if (socket) {
    socket.emit('note-update-broadcast', { projectId, noteId, updates });
  }
};

/**
 * Emit typing presence
 * @param {string} projectId
 * @param {string} entityId
 * @param {string} entityType
 */
export const emitTyping = (projectId, entityId, entityType) => {
  if (socket) {
    socket.emit('typing', { projectId, entityId, entityType });
  }
};

/**
 * Send a chat message via socket
 * @param {string} projectId 
 * @param {string} content 
 */
export const sendSocketMessage = (projectId, content) => {
  if (socket) {
    socket.emit('send-message', { projectId, content });
  }
};

export default socket;
