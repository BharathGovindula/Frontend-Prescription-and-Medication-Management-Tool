import axios from 'axios';
import { getToken } from '../utils/token';

export const medicationService = {
  async getMedications() {
    const res = await axios.get('/api/medications', {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
  },
  async createMedication(data) {
    const res = await axios.post('/api/medications', data, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
  },
  async updateMedication(id, data) {
    const res = await axios.put(`/api/medications/${id}`, data, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
  },
  async deleteMedication(id) {
    const res = await axios.delete(`/api/medications/${id}`, {
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
    const res = await axios.post(`/api/medications/${medId}/log`, logData, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
  },
}; 