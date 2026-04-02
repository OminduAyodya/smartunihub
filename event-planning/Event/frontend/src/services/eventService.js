import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

const eventService = {
  getAllEvents: async () => {
    const response = await axios.get(`${API_BASE_URL}/events`, getAuthHeader());
    return response.data;
  },

  getEventById: async (eventId) => {
    const response = await axios.get(`${API_BASE_URL}/events/${eventId}`, getAuthHeader());
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await axios.post(`${API_BASE_URL}/events`, eventData, getAuthHeader());
    return response.data;
  },

  updateEvent: async (eventId, eventData) => {
    const response = await axios.put(`${API_BASE_URL}/events/${eventId}`, eventData, getAuthHeader());
    return response.data;
  },

  getApprovedEvents: async () => {
    // Approved events only (upcoming events for home page)
    const response = await axios.get(`${API_BASE_URL}/events?status=approved`, getAuthHeader());
    return response.data;
  },

  getEventsForStallBooking: async () => {
    // Get both approved and completed events for stall booking
    const responseApproved = await axios.get(`${API_BASE_URL}/events?status=approved`, getAuthHeader());
    const responseCompleted = await axios.get(`${API_BASE_URL}/events?status=completed`, getAuthHeader());
    return [...(responseApproved.data || []), ...(responseCompleted.data || [])];
  },

  getPastEvents: async () => {
    const response = await axios.get(`${API_BASE_URL}/events?status=completed`, getAuthHeader());
    return response.data;
  },

  uploadEventThumbnail: async (eventId, formData) => {
    const response = await axios.post(
      `${API_BASE_URL}/events/${eventId}/upload-thumbnail`,
      formData,
      {
        ...getAuthHeader(),
        headers: {
          ...getAuthHeader().headers,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  deleteEvent: async (eventId) => {
    const response = await axios.delete(`${API_BASE_URL}/events/${eventId}`, getAuthHeader());
    return response.data;
  },
};

export default eventService;
