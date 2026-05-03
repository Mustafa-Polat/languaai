const CACHE_NAME = 'linguaai-v1';

// Offline'da çalışması için önbelleğe alınacak dosyalar
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/bundle.js',
  '/manifest.json',
];

// Kurulum — statik dosyaları önbelleğe al
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Bazı dosyalar henüz yoksa sessizce geç
      });
    })
  );
  self.skipWaiting();
});

// Aktivasyon — eski cache'leri temizle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch — önce cache'e bak, yoksa ağdan al
self.addEventListener('fetch', (event) => {
  // Anthropic API isteklerini her zaman ağdan al (AI özelliği)
  if (event.request.url.includes('api.anthropic.com')) {
    return; // network-only
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Başarılı GET isteklerini önbelleğe al
        if (
          networkResponse.ok &&
          event.request.method === 'GET' &&
          !event.request.url.includes('chrome-extension')
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Ağ yoksa ve cache'de de yoksa index.html döndür (SPA fallback)
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
