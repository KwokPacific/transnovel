import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';
import Notification, { NotificationType } from '../components/Notification';

interface NotificationData {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  addNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const nextId = useRef(0);

  const addNotification = useCallback((message: string, type: NotificationType = 'info') => {
    const id = nextId.current++;
    setNotifications(current => [...current, { id, message, type }]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(current => current.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] space-y-3 w-full max-w-sm">
        {notifications.map(n => (
          <Notification key={n.id} id={n.id} message={n.message} type={n.type} onDismiss={removeNotification} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
