// api.js
import axios from 'axios';
import { getAccessToken } from '../context/AuthContext';

const api = axios.create({
  baseURL: "http:/192.168.1.20:3001/api/", // e.g. 'https://your-api.com/api'
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  console.log('Auth Token:', token);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
