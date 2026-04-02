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

const artistService = {
  getArtistsByEvent: async (eventId) => {
    const response = await axios.get(`${API_BASE_URL}/artists/event/${eventId}`, getAuthHeader());
    return response.data;
  },

  voteForArtist: async (artistId) => {
    const response = await axios.post(`${API_BASE_URL}/artists/${artistId}/vote`, {}, getAuthHeader());
    return response.data;
  },

  getArtistDetails: async (artistId) => {
    const response = await axios.get(`${API_BASE_URL}/artists/${artistId}`, getAuthHeader());
    return response.data;
  },
};

export default artistService;
