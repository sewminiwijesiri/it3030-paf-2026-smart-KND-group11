import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const bookingService = {
  getAllBookings: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.resourceId) params.append('resourceId', filters.resourceId);
    if (filters.status) params.append('status', filters.status);
    if (filters.date) params.append('date', filters.date);

    const response = await axiosInstance.get(`/bookings`, { params });
    return response.data;
  },

  getMyBookings: async () => {
    const response = await axiosInstance.get(`/bookings/me`);
    return response.data;
  },

  createBooking: async (bookingData) => {
    const response = await axiosInstance.post(`/bookings`, bookingData);
    return response.data;
  },

  updateStatus: async (id, status, reason = '') => {
    const response = await axiosInstance.put(`/bookings/${id}/status`, { status, reason });
    return response.data;
  },

  cancelBooking: async (id) => {
    const response = await axiosInstance.delete(`/bookings/${id}`);
    return response.data;
  }
};
