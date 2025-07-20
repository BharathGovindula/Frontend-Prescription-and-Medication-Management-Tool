import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';

export function useAdherenceStats() {
  const [adherenceStats, setAdherenceStats] = useState(null);
  const [adherenceLoading, setAdherenceLoading] = useState(true);
  const [adherenceError, setAdherenceError] = useState('');

  const fetchAdherenceStats = useCallback(async () => {
    setAdherenceLoading(true);
    setAdherenceError('');
    try {
      const data = await analyticsService.getAdherenceStats();
      setAdherenceStats(data);
    } catch (err) {
      setAdherenceError('Failed to load adherence stats');
    } finally {
      setAdherenceLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdherenceStats();
  }, [fetchAdherenceStats]);

  return {
    adherenceStats,
    adherenceLoading,
    adherenceError,
    fetchAdherenceStats,
    setAdherenceStats, // expose for local updates if needed
  };
} 