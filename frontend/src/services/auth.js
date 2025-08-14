// src/services/auth.js
import api from '../api';  // Changed from './api' to '../api'

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('tokenExpiry', Date.now() + response.data.expiresIn * 1000);
  }
  return response.data;
};

export const verifySession = async () => {
  try {
    const response = await api.get('/auth/verify');
    return response.data.valid;
  } catch (error) {
    return false;
  }
};

// Add the missing logout function
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiry');
  // Optional: You can add an API call to backend logout endpoint if needed
  // return api.post('/auth/logout');
};