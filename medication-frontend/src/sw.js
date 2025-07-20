/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

// Precache assets
precacheAndRoute(self.__WB_MANIFEST || []);

// Cache navigation requests (HTML)
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({ cacheName: 'html-cache' })
);

// Cache API responses for reminders and medications
registerRoute(
  /\/api\/(reminders|medications)/,
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 5,
  })
);

// Background sync for failed POST/PUT to /api/medications/log and /api/reminders
const bgSyncPlugin = new BackgroundSyncPlugin('bgSyncQueue', {
  maxRetentionTime: 24 * 60, // 24 hours
});
registerRoute(
  /\/api\/(medications\/\w+\/log|reminders)/,
  new NetworkFirst({
    plugins: [bgSyncPlugin],
  }),
  'POST'
);
registerRoute(
  /\/api\/(medications\/\w+\/log|reminders)/,
  new NetworkFirst({
    plugins: [bgSyncPlugin],
  }),
  'PUT'
); 