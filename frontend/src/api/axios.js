import axios from 'axios';

const instance = axios.create({
  // Pointing to the live Render backend
  baseURL: process.env.REACT_APP_API_URL || 'https://thefolio-paint-path.onrender.com/api',
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;