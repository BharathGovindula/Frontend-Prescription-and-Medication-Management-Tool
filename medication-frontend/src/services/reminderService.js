import axios from 'axios';
import { getToken } from '../utils/token';

export const reminderService = {
  async getReminders() {
    const res = await axios.get('/api/reminders', {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
  },
  async updateReminder(id, data) {
    const res = await axios.patch(`/api/reminders/${id}`, data, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
  },
  // Add more methods as needed (create, delete, etc.)
}; 