// Service Worker — stale-while-revalidate for read-only Aurora API endpoints.
// Mutations (POST/PUT/DELETE) and auth/sync routes are bypassed.

const CACHE_NAME = 'aurora-api-v1';
const SWR_PATH_PREFIX = '/api/aurora/';
const BYPASS_PATHS = [
  '/api/aurora/sync', // explicit pull-then-push, must hit network
];

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(SWR_PATH_PREFIX)) return;
  if (BYPASS_PATHS.some((p) => url.pathname.startsWith(p))) return;

  event.respondWith(staleWhileRevalidate(req));
});

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    // Fire-and-forget background revalidation; return cached now.
    networkPromise.catch(() => {});
    return cached;
  }

  const fresh = await networkPromise;
  return fresh || new Response(JSON.stringify({ status: false, message: 'offline' }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' },
  });
}
