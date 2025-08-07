import api from './axios';

export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

// Stub for token refresh logic
export const refreshToken = async () => {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await api.post('/api/auth/refresh-token', null);
    setToken(res.data.token);
    return res.data.token;
  } catch (err) {
    removeToken();
    return null;
  }
};