import { getToken } from '../utils/token';
import { API } from './userService';

export const medicationService = {
  async getMedications() {
    const res = await API.get('/api/medications', {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
  },
  async createMedication(data) {
    const res = await API.post('/api/medications', data, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
  },
  async updateMedication(id, data) {
    const res = await API.put(`/api/medications/${id}`, data, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
  },
  async deleteMedication(id) {
    const res = await API.delete(`/api/medications/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
  },
  async logMedicationAction(medId, status, notes = '') {
    const logData = {
      medicationId: medId,
      status,
      scheduledTime: new Date(),
      takenTime: status === 'taken' ? new Date() : null,
      notes,
    };
    const res = await API.post(`/api/medications/${medId}/log`, logData, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
  },
}; 