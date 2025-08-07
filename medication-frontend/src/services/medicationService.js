import api from '../utils/axios';

export const medicationService = {
  async getMedications() {
    const res = await api.get('/api/medications');
    return res.data;
  },
  async createMedication(data) {
    const res = await api.post('/api/medications', data);
    return res.data;
  },
  async updateMedication(id, data) {
    const res = await api.put(`/api/medications/${id}`, data);
    return res.data;
  },
  async deleteMedication(id) {
    const res = await api.delete(`/api/medications/${id}`);
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
    const res = await api.post(`/api/medications/${medId}/log`, logData);
    return res.data;
  },
};