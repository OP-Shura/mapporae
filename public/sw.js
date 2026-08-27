/**
 * ==============================================================================
 * Mapporae Progressive Web App: Service Worker
 * ==============================================================================
 * Caches core app assets and map tiles (CartoDB & OpenStreetMap) for offline
 * navigation across the narrow ghats and alleyways of Varanasi.
 */

const CACHE_NAME = 'mapporae-core-v1';
const TILE_CACHE_NAME = 'mapporae-tiles-v1';

const PRECACHE_ASSETS = [
  '/',
  '/explore',
  '/services',
  '/saved',
  '/manifest.json',
  '/favicon.ico',
];

// Install: Pre-cache core app shells
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS).catch(() => {
        // Continue even if some optional precache items fail
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== TILE_CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Strategy dispatcher
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Map Tiles Caching Strategy (Cache First for offline map browsing)
  const isMapTile =
    url.hostname.includes('tile.openstreetmap.org') ||
    url.hostname.includes('basemaps.cartocdn.com');

  if (isMapTile) {
    event.respondWith(
      caches.open(TILE_CACHE_NAME).then(async cache => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          // If offline and tile is not cached, return empty or fallback
          return cachedResponse || new Response('', { status: 408 });
        }
      })
    );
    return;
  }

  // 2. Ignore non-GET, API calls, and Supabase auth/RPC requests from service worker caching
  if (
    request.method !== 'GET' ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/auth/') ||
    url.hostname.includes('supabase.co')
  ) {
    return;
  }

  // 3. Navigation Requests: Network First with Cache Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        return cached || cache.match('/');
      })
    );
    return;
  }

  // 4. Static Assets: Stale While Revalidate
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      const fetchPromise = fetch(request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
