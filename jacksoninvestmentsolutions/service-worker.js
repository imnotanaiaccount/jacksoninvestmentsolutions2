// Basic service worker for offline support and PWA compliance
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  // You can add caching logic here for offline support
  // For now, just pass through
  return;
}); 