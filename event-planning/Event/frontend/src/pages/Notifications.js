import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import notificationService from '../services/notificationService';
import NotificationItem from '../components/NotificationItem';
import '../styles/Pages.css';
import { toast } from 'react-toastify';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      // Ensure notifications is always an array
      const notificationsArray = Array.isArray(data) ? data : (data?.data ? data.data : []);
      setNotifications(notificationsArray);
    } catch (error) {
      toast.error('Failed to fetch notifications');
      setNotifications([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to update notification');
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(notifications.filter(n => n._id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const filteredNotifications = filterType === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filterType);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-page">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
      <div className="page-header">
        <h1>Notifications</h1>
        <p>You have {unreadCount} unread notifications</p>
      </div>

      <div className="notification-filters">
        <button 
          className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filterType === 'approval' ? 'active' : ''}`}
          onClick={() => setFilterType('approval')}
        >
          Approvals
        </button>
        <button 
          className={`filter-btn ${filterType === 'rejection' ? 'active' : ''}`}
          onClick={() => setFilterType('rejection')}
        >
          Rejections
        </button>
        <button 
          className={`filter-btn ${filterType === 'booking' ? 'active' : ''}`}
          onClick={() => setFilterType('booking')}
        >
          Bookings
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading notifications...</div>
      ) : filteredNotifications.length > 0 ? (
        <div className="notifications-list">
          {filteredNotifications.map(notification => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="no-events">
          <p>No notifications</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
