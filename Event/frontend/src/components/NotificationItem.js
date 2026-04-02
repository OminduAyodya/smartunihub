import React from 'react';
import '../styles/Components.css';

const NotificationItem = ({ notification, onRead, onDelete }) => {
  return (
    <div className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
      <div className="notification-icon">
        <span className={`icon type-${notification.type}`}>
          {notification.type === 'approval' && '✓'}
          {notification.type === 'rejection' && '✗'}
          {notification.type === 'update' && '↻'}
          {notification.type === 'reminder' && '🔔'}
          {notification.type === 'booking' && '🎫'}
        </span>
      </div>
      <div className="notification-content">
        <p className="notification-message">{notification.message}</p>
        <p className="notification-date">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>
      <div className="notification-actions">
        {!notification.read && (
          <button className="btn-mark-read" onClick={() => onRead(notification._id)}>
            Mark as read
          </button>
        )}
        <button className="btn-delete" onClick={() => onDelete(notification._id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
