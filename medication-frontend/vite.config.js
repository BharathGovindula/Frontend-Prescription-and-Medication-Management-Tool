import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Medication Management Tool',
        short_name: 'MedManager',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#3182ce',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,json}'],
        runtimeCaching: [
          {
            urlPattern: /^\/api\/(reminders|medications)/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
              networkTimeoutSeconds: 5,
            },
          },
          {
            urlPattern: /^\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
            },
          },
        ],
        navigateFallback: '/index.html',
        sync: [
          {
            urlPattern: /^\/api\/(medications\/\w+\/log|reminders)/,
            options: {
              name: 'bgSyncQueue',
              maxRetentionTime: 24 * 60, // 24 hours
            },
          },
        ],
      },
      srcDir: 'src',
      filename: 'sw.js',
      strategies: 'injectManifest',
    }),
  ],
  server: {
    proxy: {
      '/api': 'https://backend-prescription-and-medication-4914.onrender.com',
    },
  },
});
