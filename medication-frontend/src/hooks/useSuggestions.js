import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getToken } from '../utils/token';

export function useSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [suggestionsError, setSuggestionsError] = useState('');

  const fetchSuggestions = useCallback(async () => {
    setSuggestionsLoading(true);
    setSuggestionsError('');
    try {
      const res = await axios.get('/api/analytics/suggestions', { headers: { Authorization: `Bearer ${getToken()}` } });
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      setSuggestionsError('Failed to load personalized suggestions');
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  return {
    suggestions,
    suggestionsLoading,
    suggestionsError,
    fetchSuggestions,
    setSuggestions,
  };
} 