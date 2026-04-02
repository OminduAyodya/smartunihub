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

const adminService = {
  getPendingEvents: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/events/pending`, getAuthHeader());
    return response.data;
  },

  approveEvent: async (eventId, remarks = '') => {
    const response = await axios.post(
      `${API_BASE_URL}/admin/events/${eventId}/approve`,
      { remarks },
      getAuthHeader()
    );
    return response.data;
  },

  rejectEvent: async (eventId, reason = '') => {
    const response = await axios.post(
      `${API_BASE_URL}/admin/events/${eventId}/reject`,
      { reason },
      getAuthHeader()
    );
    return response.data;
  },

  // Stall approval methods
  getPendingStalls: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/stalls/pending`, getAuthHeader());
    return response.data;
  },

  approveStall: async (stallId, remarks = '') => {
    const response = await axios.post(
      `${API_BASE_URL}/admin/stalls/${stallId}/approve`,
      { remarks },
      getAuthHeader()
    );
    return response.data;
  },

  rejectStall: async (stallId, reason = '') => {
    const response = await axios.post(
      `${API_BASE_URL}/admin/stalls/${stallId}/reject`,
      { reason },
      getAuthHeader()
    );
    return response.data;
  },

  getAnalytics: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/analytics`, getAuthHeader());
    return response.data;
  },
};

export default adminService;
