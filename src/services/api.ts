import axios from 'axios';

const API_URL = 'https://levitation-backend-1.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const token = JSON.parse(userInfo).token;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;