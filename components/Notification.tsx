import React, { useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'info';

export interface NotificationComponentProps {
  id: number;
  message: string;
  type: NotificationType;
  onDismiss: (id: number) => void;
}

const Notification: React.FC<NotificationComponentProps> = ({ id, message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const baseClasses = 'p-4 rounded-lg shadow-lg text-white flex items-center justify-between transition-all duration-300 transform animate-fade-in-right';
  
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-600',
    info: 'bg-blue-500',
  };

  const iconPaths = {
    success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    error: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
    info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPaths[type]} />
      </svg>
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button onClick={() => onDismiss(id)} className="ml-4 p-1 rounded-full hover:bg-black hover:bg-opacity-20">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
  );
};

export default Notification;
