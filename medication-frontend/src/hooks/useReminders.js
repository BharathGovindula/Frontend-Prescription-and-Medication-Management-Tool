import { useState, useEffect, useCallback } from 'react';
import { reminderService } from '../services/reminderService';

export function useReminders() {
  const [reminders, setReminders] = useState([]);
  const [remindersLoading, setRemindersLoading] = useState(true);
  const [remindersError, setRemindersError] = useState('');

  const fetchReminders = useCallback(async () => {
    setRemindersLoading(true);
    setRemindersError('');
    try {
      const data = await reminderService.getReminders();
      setReminders(data || []);
    } catch (err) {
      setRemindersError('Failed to load reminders');
    } finally {
      setRemindersLoading(false);
    }
  }, []);

  // Optionally expose updateReminder from the service
  const updateReminder = reminderService.updateReminder;

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  return {
    reminders,
    remindersLoading,
    remindersError,
    fetchReminders,
    setReminders,
    updateReminder,
  };
} 