import axios from 'axios';
import { getToken, setToken, removeToken } from '../utils/token';


const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ Uses the VITE_ environment variable
});

API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (credentials) => {
  console.log(API.baseURL,'bharat');
  
  const res = await API.post('/api/auth/login', credentials);
  setToken(res.data.token);
  return res.data;
};

export const register = async (credentials) => {
  const res = await API.post('/api/auth/register', credentials);
  return res.data;
};

export const logout = async () => {
  await API.post('/api/auth/logout');
  removeToken();
};

export const fetchProfile = async () => {
  const res = await API.get('/api/profile');
  return res.data;
};

export const updateProfile = async (profile) => {
  const res = await API.put('/api/profile', profile);
  return res.data;
};

export const fetchDoctors = async () => {
  const res = await API.get('/api/profile');
  return res.data.doctors || [];
};

export const updateDoctors = async (doctors) => {
  const res = await API.put('/api/profile/doctor', { doctors });
  return res.data;
};

export const requestPasswordReset = async (email) => {
  const res = await API.post('/api/auth/password-reset-request', { email });
  return res.data;
};

export const resetPassword = async (token, password) => {
  const res = await API.post('/api/auth/password-reset', { token, password });
  return res.data;
};

export const refreshToken = async () => {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await API.post('/api/auth/refresh-token');
    setToken(res.data.token);
    return res.data.token;
  } catch (err) {
    console.log(err);
    
    removeToken();
    return null;
  }
}; 