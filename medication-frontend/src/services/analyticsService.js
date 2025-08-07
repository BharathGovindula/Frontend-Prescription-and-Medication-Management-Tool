import api from '../utils/axios';

export const analyticsService = {
  async getAdherenceStats() {
    const res = await api.get('/api/analytics/adherence');
    return res.data;
  },
  async getTrends() {
    const res = await api.get('/api/analytics/trends');
    return res.data;
  },
  async getStreaks() {
    const res = await api.get('/api/analytics/streaks-badges');
    return res.data;
  },
  async getSuggestions() {
    const res = await api.get('/api/analytics/suggestions');
    return res.data;
  },
};