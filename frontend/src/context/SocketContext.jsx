import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  initSocket,
  disconnectSocket,
  getSocket,
  joinProject,
  leaveProject,
} from '../socket/socket';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

/**
 * SocketProvider - Manages Socket.IO connection and real-time events
 */
export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize socket when user is authenticated
  useEffect(() => {
    if (!user) {
      disconnectSocket();
      setSocket(null);
      setIsConnected(false);
      return;
    }

    const socketInstance = initSocket();
    setSocket(socketInstance);

    // Listen for connection events
    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for online users updates
    socketInstance.on('online-users', (users) => {
      setOnlineUsers(users);
    });

    // Cleanup on unmount
    return () => {
      disconnectSocket();
      setSocket(null);
      setIsConnected(false);
    };
  }, [user]);

  // Wrapper functions
  const joinProjectRoom = useCallback((projectId) => {
    joinProject(projectId);
  }, []);

  const leaveProjectRoom = useCallback((projectId) => {
    leaveProject(projectId);
  }, []);

  // Get users online in current project
  const getOnlineUsersForProject = useCallback(() => {
    return onlineUsers;
  }, [onlineUsers]);

  const contextValue = {
    socket,
    isConnected,
    onlineUsers,
    joinProject: joinProjectRoom,
    leaveProject: leaveProjectRoom,
    getOnlineUsers: getOnlineUsersForProject,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

/**
 * Custom hook to use Socket context
 */
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketContext;
