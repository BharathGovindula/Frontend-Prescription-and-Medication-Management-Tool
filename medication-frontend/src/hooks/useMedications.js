import { useState, useEffect, useCallback } from 'react';
import { medicationService } from '../services/medicationService';

export function useMedications() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMedications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await medicationService.getMedications();
      setMedications(data || []);
    } catch (err) {
      setError('Failed to load medications');
    } finally {
      setLoading(false);
    }
  }, []);

  // Optionally expose CRUD methods from the service
  const createMedication = medicationService.createMedication;
  const updateMedication = medicationService.updateMedication;
  const deleteMedication = medicationService.deleteMedication;
  const logMedicationAction = medicationService.logMedicationAction;

  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

  return {
    medications,
    loading,
    error,
    fetchMedications,
    setMedications, // expose for local updates if needed
    createMedication,
    updateMedication,
    deleteMedication,
    logMedicationAction,
  };
} 