const CACHE_NAME = 'expense-tracker-pro-v2'; // Incremented version
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.js',
  '/App.js',
  '/types.js',
  '/constants.js',
  '/hooks/useLocalStorage.js',
  '/services/geminiService.js',
  '/services/reportingService.js',
  '/components/ui/Modal.js',
  '/components/ui/Card.js',
  '/components/DashboardView.js',
  '/components/ExpensesView.js',
  '/components/ExpenseModal.js',
  '/components/CameraCapture.js',
  '/components/Icons.js',
  '/icon-192x192.png',
  '/icon-512x512.png',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Use addAll to fetch and cache all resources.
        // It's atomic, if one fetch fails, the whole operation fails.
        return cache.addAll(URLS_TO_CACHE).catch(err => {
            console.error('Failed to cache resources during install:', err);
        });
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});