import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';
import { ChatMessage } from '../models/chatMessage.models.js';
import { ProjectMember } from '../models/projectmember.models.js';

// In-memory store for online users (use Redis in production)
const onlineUsers = new Map(); // userId -> { socketId, user }

/**
 * Initialize Socket.IO server with Express HTTP server
 * @param {import('http').Server} httpServer - Express HTTP server
 * @returns {Server} - Socket.IO server instance
 */
export const initSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:8000'].filter(Boolean),
      credentials: true,
      methods: ['GET', 'POST'],
    },
    // Optimize for real-time collaboration
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      // 1. Check handshake auth token (if passed explicitly)
      // 2. Check headers cookie (if passed automatically via withCredentials)
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.cookie
          ?.split(';')
          .find((c) => c.trim().startsWith('accessToken='))
          ?.split('=')[1];

      if (!token) {
        return next(new Error('Authentication error: Token not found'));
      }

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded._id).select('-password');

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.username} (${socket.id})`);

    // Track online user
    onlineUsers.set(socket.user._id.toString(), {
      socketId: socket.id,
      user: {
        _id: socket.user._id,
        username: socket.user.username,
        email: socket.user.email,
        avatar: socket.user.avatar,
      },
    });

    // Broadcast updated online users list
    broadcastOnlineUsers(io);

    // Join project room
    socket.on('join-project', (projectId) => {
      if (!projectId) return;

      socket.join(`project:${projectId}`);
      console.log(
        `📁 ${socket.user.username} joined project:${projectId}`
      );

      // Notify others in the room
      socket.to(`project:${projectId}`).emit('user-joined-project', {
        userId: socket.user._id,
        username: socket.user.username,
        socketId: socket.id,
      });
    });

    // Leave project room
    socket.on('leave-project', (projectId) => {
      if (!projectId) return;

      socket.leave(`project:${projectId}`);
      console.log(
        `📁 ${socket.user.username} left project:${projectId}`
      );

      socket.to(`project:${projectId}`).emit('user-left-project', {
        userId: socket.user._id,
        username: socket.user.username,
      });
    });

    // Handle task updates (optimistic sync)
    socket.on('task-update-request', (data) => {
      const { projectId, taskId, updates } = data;

      // Broadcast to all other users in the project room
      socket.to(`project:${projectId}`).emit('task-updated', {
        taskId,
        updates,
        updatedBy: {
          _id: socket.user._id,
          username: socket.user.username,
        },
        timestamp: new Date().toISOString(),
      });
    });

    // Handle task creation
    socket.on('task-created-broadcast', (data) => {
      const { projectId, task } = data;

      socket.to(`project:${projectId}`).emit('task-created-realtime', {
        task,
        createdBy: {
          _id: socket.user._id,
          username: socket.user.username,
        },
        timestamp: new Date().toISOString(),
      });
    });

    // Handle task deletion
    socket.on('task-deleted-broadcast', (data) => {
      const { projectId, taskId } = data;

      socket.to(`project:${projectId}`).emit('task-deleted-realtime', {
        taskId,
        deletedBy: {
          _id: socket.user._id,
          username: socket.user.username,
        },
        timestamp: new Date().toISOString(),
      });
    });

    // Handle note updates
    socket.on('note-update-broadcast', (data) => {
      const { projectId, noteId, updates } = data;

      socket.to(`project:${projectId}`).emit('note-updated-realtime', {
        noteId,
        updates,
        updatedBy: {
          _id: socket.user._id,
          username: socket.user.username,
        },
        timestamp: new Date().toISOString(),
      });
    });

    // Handle real-time chat messages
    socket.on('send-message', async (data) => {
      const { projectId, content } = data;

      if (!projectId || !content?.trim()) return;

      try {
        // 1. Verify membership
        const member = await ProjectMember.findOne({
          project: projectId,
          user: socket.user._id,
        });

        if (!member) {
          return socket.emit('error', { message: 'Unauthorized to send messages in this project' });
        }

        // 2. Save to database
        const message = await ChatMessage.create({
          project: projectId,
          sender: socket.user._id,
          content: content.trim(),
        });

        // 3. Populate and broadcast
        const populatedMessage = await ChatMessage.findById(message._id).populate(
          'sender',
          'username avatar'
        );

        io.to(`project:${projectId}`).emit('chat-message', {
          message: populatedMessage,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('❌ Socket chat-message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing/cursor presence (for future collaborative editing)
    socket.on('typing', (data) => {
      const { projectId, entityId, entityType } = data;

      socket.to(`project:${projectId}`).emit('user-typing', {
        userId: socket.user._id,
        username: socket.user.username,
        entityId,
        entityType, // 'task', 'note', etc.
        timestamp: new Date().toISOString(),
      });
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.user.username} (${socket.id})`);

      // Remove from online users
      onlineUsers.delete(socket.user._id.toString());

      // Broadcast updated online users list
      broadcastOnlineUsers(io);

      // Notify all project rooms user was in
      socket.rooms.forEach((room) => {
        if (room.startsWith('project:')) {
          io.to(room).emit('user-left-project', {
            userId: socket.user._id,
            username: socket.user.username,
          });
        }
      });
    });
  });

  return io;
};

/**
 * Broadcast online users list to all connected clients
 */
const broadcastOnlineUsers = (io) => {
  const usersList = Array.from(onlineUsers.values()).map(({ user, socketId }) => ({
    ...user,
    socketId,
  }));

  io.emit('online-users', usersList);
};

/**
 * Helper: Get online users for a specific project
 */
export const getOnlineUsersForProject = (projectId) => {
  // This is a simplified version; in production, track room memberships
  return Array.from(onlineUsers.values()).map(({ user }) => user);
};

/**
 * Helper: Emit event to a specific project room
 */
export const emitToProject = (io, projectId, event, data) => {
  io.to(`project:${projectId}`).emit(event, data);
};

export { onlineUsers };
