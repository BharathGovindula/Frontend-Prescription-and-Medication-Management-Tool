import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';

export function useStreaks() {
  const [streaks, setStreaks] = useState({ currentStreak: 0, longestStreak: 0, badges: [] });
  const [streaksLoading, setStreaksLoading] = useState(true);
  const [streaksError, setStreaksError] = useState('');

  const fetchStreaks = useCallback(async () => {
    setStreaksLoading(true);
    setStreaksError('');
    try {
      const data = await analyticsService.getStreaks();
      setStreaks(data || { currentStreak: 0, longestStreak: 0, badges: [] });
    } catch (err) {
      setStreaksError('Failed to load streaks and badges');
    } finally {
      setStreaksLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStreaks();
  }, [fetchStreaks]);

  return {
    streaks,
    streaksLoading,
    streaksError,
    fetchStreaks,
    setStreaks,
  };
} 