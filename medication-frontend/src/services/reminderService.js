import api from '../utils/axios';

export const reminderService = {
  async getReminders() {
    const res = await api.get('/api/reminders');
    return res.data;
  },
  async updateReminder(id, data) {
    const res = await api.patch(`/api/reminders/${id}`, data);
    return res.data;
  },
  // Add more methods as needed (create, delete, etc.)
};