// frontend/src/api.js
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// ---------------- Helper functions ----------------
export function getRateLimitExceededInfo() {
  const data = localStorage.getItem('rateLimitExceeded');
  return data ? JSON.parse(data) : null;
}

export function clearRateLimitExceeded() {
  localStorage.removeItem('rateLimitExceeded');
}

// ---------------- Request interceptor ----------------
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.method === 'get') {
    config.params = { ...config.params, _: Date.now() }; // cache busting
  }
  return config;
}, error => Promise.reject(error));

// ---------------- Response interceptor ----------------
api.interceptors.response.use(
  response => {
    // Warn when approaching rate limit
    if (response.headers['x-ratelimit-remaining'] <= 2) {
      toast.warn(`Approaching rate limit (${response.headers['x-ratelimit-remaining']} requests left)`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
    return response;
  },
  error => {
    if (error.response?.status === 429) {
      const retryAfter = error.response.data?.retryAfter || error.response.headers['retry-after'] || 60;

      // Store info for RateLimitNotifier
      localStorage.setItem('rateLimitExceeded', JSON.stringify({
        resetTime: Date.now() + retryAfter * 1000
      }));

      toast.error(`Too many requests. Try again in ${retryAfter} seconds.`, {
        position: "bottom-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        theme: "colored",
        style: { backgroundColor: '#dc3545' }
      });

      return Promise.reject({
        ...error,
        retryAfter,
        isRateLimitError: true
      });
    }

    // Other errors
    const message = error.response?.data?.message || 
                    error.response?.data?.error?.message || 
                    error.message || 'Request failed';
    
    toast.error(message, { position: "bottom-right", autoClose: 5000 });
    return Promise.reject(error);
  }
);

// ---------------- API methods ----------------
export const getEmployees = async () => {
  const response = await api.get('/employees');
  return {
    employees: response.data.employees || [],
    fromCache: response.data.fromCache || false,
    headers: response.headers
  };
};

export const createEmployee = async (employeeData) => {
  const response = await api.post('/employees', employeeData);
  //toast.success('Employee created successfully');
  return response.data;
};

export const updateEmployee = async (id, employeeData) => {
  const response = await api.put(`/employees/${id}`, employeeData);
  //toast.success('Employee updated successfully');
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await api.delete(`/employees/${id}`);
  //toast.success('Employee deleted successfully');
  return response.data;
};

export default api;
