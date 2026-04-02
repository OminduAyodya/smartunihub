import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return {};
};

const stallService = {
  getStallsByEvent: async (eventId) => {
    const response = await axios.get(`${API_BASE_URL}/stalls/event/${eventId}`, getAuthHeader());
    return response.data;
  },

  requestStall: async (stallData) => {
    const response = await axios.post(`${API_BASE_URL}/stalls`, stallData, getAuthHeader());
    return response.data;
  },

  getPendingStalls: async () => {
    const response = await axios.get(`${API_BASE_URL}/stalls/pending`, getAuthHeader());
    return response.data;
  },

  getStallDetails: async (stallId) => {
    const response = await axios.get(`${API_BASE_URL}/stalls/${stallId}`, getAuthHeader());
    return response.data;
  },

  updateStall: async (stallId, stallData) => {
    const response = await axios.put(`${API_BASE_URL}/stalls/${stallId}`, stallData, getAuthHeader());
    return response.data;
  },

  getApprovedStalls: async () => {
    const response = await axios.get(`${API_BASE_URL}/stalls/approved/user`, getAuthHeader());
    return response.data;
  },

  deleteStall: async (stallId) => {
    const response = await axios.delete(`${API_BASE_URL}/stalls/${stallId}`, getAuthHeader());
    return response.data;
  },
};

export default stallService;
