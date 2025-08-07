import api from '../utils/axios';
import { setToken, removeToken, getToken } from '../utils/token';

export const login = async (credentials) => {
  const res = await api.post('/api/auth/login', credentials);
  setToken(res.data.token);
  return res.data;
};

export const register = async (credentials) => {
  const res = await api.post('/api/auth/register', credentials);
  return res.data;
};

export const logout = async () => {
  await api.post('/api/auth/logout');
  removeToken();
};

export const fetchProfile = async () => {
  const res = await api.get('/api/profile');
  return res.data;
};

export const updateProfile = async (profile) => {
  const res = await api.put('/api/profile', profile);
  return res.data;
};

export const fetchDoctors = async () => {
  const res = await api.get('/api/profile');
  return res.data.doctors || [];
};

export const updateDoctors = async (doctors) => {
  const res = await api.put('/api/profile/doctor', { doctors });
  return res.data;
};

export const requestPasswordReset = async (email) => {
  const res = await api.post('/api/auth/password-reset-request', { email });
  return res.data;
};

export const resetPassword = async (token, password) => {
  const res = await api.post('/api/auth/password-reset', { token, password });
  return res.data;
};

export const refreshToken = async () => {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await api.post('/api/auth/refresh-token');
    setToken(res.data.token);
    return res.data.token;
  } catch (err) {
    console.log(err);
    
    removeToken();
    return null;
  }
};