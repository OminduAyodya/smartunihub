import axios from "axios";

const NODE_API_BASE_URL = import.meta.env.VITE_NODE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: NODE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor to silently handle 404s for unimplemented endpoints
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Silently handle 404s for dashboard and events endpoints
    if (error.response?.status === 404) {
      const config = error.config;
      if (
        config?.url?.includes("/api/dashboard") ||
        config?.url?.includes("/api/events") ||
        config?.url?.includes("/api/users")
      ) {
        // Return empty data structure instead of throwing
        return Promise.resolve({ data: [] });
      }
    }
    return Promise.reject(error);
  }
);

// Event APIs
export const getPendingEvents = () => api.get("/api/events?status=pending");
export const getApprovedEvents = () => api.get("/api/events?status=approved");
export const getAllEvents = () => api.get("/api/events");
export const reviewEvent = (eventId, payload) => api.put(`/api/events/${eventId}/review`, payload);

// User APIs
export const getUsers = () => api.get("/api/users");

// Dashboard APIs
export const getDashboardSummary = () => api.get("/api/dashboard");
