const CACHE_NAME = 'workout-cache-v2';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/log-workout.html',
  '/view-workouts.html',
  '/src/css/styles.css',
  '/src/js/app.js',
  '/src/js/log-workout.js',
  '/src/assets/icons/icon-192x192.png',
  '/src/assets/icons/icon-512x512.png'
];

// Install and cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Fetch resources from cache or network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
