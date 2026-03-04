import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Trip APIs
export const getTrips = () => api.get('/trips');
export const getTrip = (id) => api.get(`/trips/${id}`);
export const createTrip = (data) => api.post('/trips', data);
export const updateTrip = (id, data) => api.put(`/trips/${id}`, data);
export const deleteTrip = (id) => api.delete(`/trips/${id}`);

// Expense APIs
export const getExpenses = (tripId) => api.get(`/expenses/trip/${tripId}`);
export const addExpense = (data) => api.post('/expenses', data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

// Recommendation APIs
export const getHotels = (destination) => api.get(`/recommendations/hotels/${destination}`);
export const getRestaurants = (destination) => api.get(`/recommendations/food/${destination}`);

// Route APIs
export const getOptimizedRoute = (data) => api.post('/routes/optimize', data);

export default api;
