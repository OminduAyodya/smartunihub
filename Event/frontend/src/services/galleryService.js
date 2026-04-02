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

const galleryService = {
  getGalleryByEvent: async (eventId) => {
    const response = await axios.get(`${API_BASE_URL}/gallery/event/${eventId}`, getAuthHeader());
    return response.data;
  },

  uploadPhoto: async (eventId, formData) => {
    const response = await axios.post(`${API_BASE_URL}/gallery`, formData, {
      ...getAuthHeader(),
      headers: {
        ...getAuthHeader().headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deletePhoto: async (photoId) => {
    const response = await axios.delete(`${API_BASE_URL}/gallery/${photoId}`, getAuthHeader());
    return response.data;
  },
};

export default galleryService;
