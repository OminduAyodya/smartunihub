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

const seatService = {
  getSeatsByEvent: async (eventId) => {
    const response = await axios.get(`${API_BASE_URL}/seats/event/${eventId}`, getAuthHeader());
    return response.data;
  },

  bookSeats: async (seatData) => {
    const response = await axios.post(`${API_BASE_URL}/seats`, seatData, getAuthHeader());
    return response.data;
  },

  getSeatDetails: async (seatId) => {
    const response = await axios.get(`${API_BASE_URL}/seats/${seatId}`, getAuthHeader());
    return response.data;
  },
};

export default seatService;
