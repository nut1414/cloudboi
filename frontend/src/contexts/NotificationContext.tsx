import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import Alert from '../components/Common/Alert';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  type: AlertType;
  message: string;
  autoDismiss?: boolean;
  duration?: number;
  timestamp: number;
}

interface NotificationContextProps {
  notifications: Notification[];
  addNotification: (type: AlertType, message: string, autoDismiss?: boolean, duration?: number) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

// Maximum number of notifications to show at one time
const MAX_NOTIFICATIONS = 5;

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lastTimestamp, setLastTimestamp] = useState(0);

  // Use useCallback to ensure stable identity for removeNotification function
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const addNotification = useCallback(
    (type: AlertType, message: string, autoDismiss = true, duration = 5000) => {
      // Prevent duplicate notifications with same message and type
      const isDuplicate = notifications.some(
        notification => 
          notification.message === message && 
          notification.type === type &&
          Date.now() - notification.timestamp < 2000 // Consider as duplicate if added within 2 seconds
      );
      
      if (isDuplicate) return;

      // Ensure unique timestamps even when called in rapid succession
      const now = Date.now();
      const timestamp = now > lastTimestamp ? now : lastTimestamp + 1;
      setLastTimestamp(timestamp);
      
      const id = `${timestamp}-${Math.random().toString(36).substr(2, 9)}`;
      const newNotification = { id, type, message, autoDismiss, duration, timestamp };
      
      setNotifications(prev => {
        // Add the new notification
        const updatedNotifications = [...prev, newNotification];
        
        // If we exceed the maximum number of notifications, keep only the most recent ones
        if (updatedNotifications.length > MAX_NOTIFICATIONS) {
          return updatedNotifications
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, MAX_NOTIFICATIONS);
        }
        
        return updatedNotifications;
      });
    },
    [notifications, lastTimestamp]
  );

  // Use useEffect for auto-dismissing notifications to prevent memory leaks
  useEffect(() => {
    // Create a map to track timeout IDs
    const timeoutIds: { [id: string]: number } = {};
    
    // Set up timeouts for auto-dismissing notifications
    notifications.forEach(notification => {
      if (notification.autoDismiss && !timeoutIds[notification.id]) {
        timeoutIds[notification.id] = window.setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration || 5000);
      }
    });
    
    // Cleanup function to clear timeouts when component unmounts or notifications change
    return () => {
      Object.values(timeoutIds).forEach(id => window.clearTimeout(id));
    };
  }, [notifications, removeNotification]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      addNotification, 
      removeNotification, 
      clearNotifications 
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Container that displays notifications in the UI
const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  // Sort notifications to show most recent first
  const sortedNotifications = [...notifications].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="fixed top-5 right-5 z-50 space-y-2 w-80">
      {sortedNotifications.map(notification => (
        <div key={notification.id} className="relative" onClick={() => removeNotification(notification.id)}>
          <Alert 
            type={notification.type} 
            message={notification.message} 
            className="cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationProvider; 