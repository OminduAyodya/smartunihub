import axios from "axios";

const NODE_API_BASE_URL = import.meta.env.VITE_NODE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: NODE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getDashboardSummary = () => api.get("/api/dashboard");

export const getFoods = () => api.get("/api/foods");
export const createFoodRequest = (payload) => api.post("/api/request", payload);
export const getUserRequests = (userId) => api.get(`/api/requests/${userId}`);
export const getIncomingRequests = (helperId, status) =>
  api.get(`/api/requests/incoming/${helperId}`, {
    params: status ? { status } : undefined,
  });
export const updateFoodRequest = (id, payload) => api.put(`/api/request/${id}`, payload);
export const updateOwnFoodRequest = (id, payload) => api.put(`/api/request/${id}/requester`, payload);
export const deleteOwnFoodRequest = (id, payload) => api.delete(`/api/request/${id}/requester`, { data: payload });

// Helper acceptance flow
export const acceptFoodRequest = (requestId, helperId, serviceCharge = 0) =>
  api.post(`/api/request/${requestId}/accept-help`, { helperId, serviceCharge });
export const getRequestAcceptances = (requestId) =>
  api.get(`/api/request/${requestId}/acceptances`);
export const selectHelperForRequest = (requestId, helperId) =>
  api.post(`/api/request/${requestId}/select-helper`, { helperId });

export const getUsers = () => api.get("/api/users");
export const updateUserProfile = (userId, payload) => api.put(`/api/users/${userId}`, payload);

export const getEvents = (status) =>
  api.get("/api/events", {
    params: status ? { status } : undefined,
  });
export const createEvent = (payload) => api.post("/api/events", payload);
export const submitEventForApproval = (eventId) => api.put(`/api/events/${eventId}/submit`);
export const reviewEvent = (eventId, payload) => api.put(`/api/events/${eventId}/review`, payload);
export const getCalendarEvents = () => api.get("/api/events/calendar");
export const requestEventStalls = (eventId, payload) => api.put(`/api/events/${eventId}/stalls`, payload);
export const getEventStallAllocation = (eventId) => api.get(`/api/events/${eventId}/stalls`);
export const getPastEvents = () => api.get("/api/events/past");
export const getEventGallery = () => api.get("/api/events/gallery");
export const addEventPhoto = (eventId, payload) => api.post(`/api/events/${eventId}/photos`, payload);
export const deleteEventPhoto = (eventId, photoId) => api.delete(`/api/events/${eventId}/photos/${photoId}`);

export const mockUsers = [
  {
    _id: "66a700000000000000000001",
    name: "Ayesha Perera",
    email: "ayesha@student.smartunihub.com",
    itNumber: "IT2023001",
    phoneNumber: "0771234567",
    role: "student",
    serviceCharge: 50,
  },
  {
    _id: "66a700000000000000000002",
    name: "Nimal Fernando",
    email: "nimal@student.smartunihub.com",
    itNumber: "IT2023002",
    phoneNumber: "0772345678",
    role: "student",
    serviceCharge: 50,
  },
  {
    _id: "66a700000000000000000003",
    name: "Kavindu Silva",
    email: "kavindu@student.smartunihub.com",
    itNumber: "IT2023003",
    phoneNumber: "0773456789",
    role: "student",
    serviceCharge: 50,
  },
];

export const mockFoods = [
  {
    _id: "66a710000000000000000001",
    name: "Chicken Kottu",
    price: 650,
    inStock: true,
    image: "https://images.unsplash.com/photo-1562967916-eb82221dfb36?w=800&q=80",
  },
  {
    _id: "66a710000000000000000002",
    name: "Veg Rice",
    price: 420,
    inStock: true,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
  },
  {
    _id: "66a710000000000000000003",
    name: "Egg Sandwich",
    price: 250,
    inStock: true,
    image: "https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?w=800&q=80",
  },
  {
    _id: "66a710000000000000000004",
    name: "Iced Coffee",
    price: 300,
    inStock: false,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
  },
  {
    _id: "66a710000000000000000005",
    name: "Fruit Bowl",
    price: 350,
    inStock: true,
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&q=80",
  },
];
