import axios from 'axios';
import { getToken } from '../utils/token';

export const analyticsService = {
  async getAdherenceStats() {
    const res = await axios.get('/api/analytics/adherence', {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
  },
  async getTrends() {
    const res = await axios.get('/api/analytics/trends', {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
  },
  async getStreaks() {
    const res = await axios.get('/api/analytics/streaks-badges', {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
  },
  async getSuggestions() {
    const res = await axios.get('/api/analytics/suggestions', {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
  },
}; 