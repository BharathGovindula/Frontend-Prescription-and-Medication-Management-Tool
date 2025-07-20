import { useState, useEffect, useCallback } from 'react';
import { getLogs, setLogs as setOfflineLogs, clearLogs } from '../utils/db';
import axios from 'axios';
import { getToken } from '../utils/token';

export function useOfflineSync() {
  const [actionMessage, setActionMessage] = useState('');

  const syncLogs = useCallback(async () => {
    if (!navigator.onLine) return;
    const offlineLogs = (await getLogs()) || [];
    if (offlineLogs.length === 0) return;
    for (const log of offlineLogs) {
      try {
        await axios.post(`/api/medications/${log.medicationId}/log`, log, { headers: { Authorization: getToken() } });
      } catch (err) {
        // Optionally handle error
      }
    }
    await clearLogs();
    setActionMessage('Offline logs synced!');
  }, []);

  useEffect(() => {
    window.addEventListener('online', syncLogs);
    syncLogs();
    return () => window.removeEventListener('online', syncLogs);
  }, [syncLogs]);

  return {
    syncLogs,
    actionMessage,
    setActionMessage,
  };
} 