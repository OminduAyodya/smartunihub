import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const notificationService = {
  getNotifications: async () => {
    const response = await axios.get(`${API_BASE_URL}/notifications`, getAuthHeader());
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await axios.put(
      `${API_BASE_URL}/notifications/${notificationId}/read`,
      {},
      getAuthHeader()
    );
    return response.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await axios.delete(
      `${API_BASE_URL}/notifications/${notificationId}`,
      getAuthHeader()
    );
    return response.data;
  },

  sendNotification: async (notificationData) => {
    const response = await axios.post(`${API_BASE_URL}/notifications`, notificationData, getAuthHeader());
    return response.data;
  },
};

export default notificationService;
