import { set, get, del } from 'idb-keyval';

const REMINDERS_KEY = 'offlineReminders';
const LOGS_KEY = 'offlineLogs';

export const setReminders = (reminders) => set(REMINDERS_KEY, reminders);
export const getReminders = () => get(REMINDERS_KEY);
export const clearReminders = () => del(REMINDERS_KEY);

export const setLogs = (logs) => set(LOGS_KEY, logs);
export const getLogs = () => get(LOGS_KEY);
export const clearLogs = () => del(LOGS_KEY); 