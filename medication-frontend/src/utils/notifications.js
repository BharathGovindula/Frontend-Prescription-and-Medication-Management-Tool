let userInteracted = false;
if (typeof window !== 'undefined') {
  window.addEventListener('click', () => { userInteracted = true; }, { once: true });
  window.addEventListener('keydown', () => { userInteracted = true; }, { once: true });
  window.addEventListener('touchstart', () => { userInteracted = true; }, { once: true });
}

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const showNotification = (title, options = {}) => {
  if (!('Notification' in window)) {
    alert(title + (options.body ? `\n${options.body}` : ''));
    return;
  }
  if (Notification.permission === 'granted') {
    new Notification(title, options);
    // Play sound if enabled in preferences
    try {
      const prefs = JSON.parse(localStorage.getItem('notificationPreferences')) || {};
      if (prefs.sound !== false && userInteracted) {
        const soundFile = prefs.soundFile || 'notification-chime.mp3';
        const audio = new Audio(`/${soundFile}`);
        audio.play();
      }
    } catch(err) {
      console.log(err)
    }
  }
}; 