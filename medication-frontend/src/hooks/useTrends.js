import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';

export function useTrends() {
  const [trends, setTrends] = useState({ daily: [], weekly: [], monthly: [] });
  const [trendsLoading, setTrendsLoading] = useState(true);
  const [trendsError, setTrendsError] = useState('');

  const fetchTrends = useCallback(async () => {
    setTrendsLoading(true);
    setTrendsError('');
    try {
      const data = await analyticsService.getTrends();
      setTrends(data);
    } catch (err) {
      setTrendsError('Failed to load trends');
    } finally {
      setTrendsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);

  return {
    trends,
    trendsLoading,
    trendsError,
    fetchTrends,
    setTrends,
  };
} 