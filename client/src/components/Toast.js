import React from 'react';
import { useNotification } from '../context/NotificationContext';

const Toast = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="toast-container">
      {notifications.map((n) => (
        <div key={n.id} className={`toast toast-${n.type}`}>
          <span className="toast-message">{n.message}</span>
          <button className="toast-close" onClick={() => removeNotification(n.id)}>&times;</button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
