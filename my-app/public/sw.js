// Service Worker — network-first (cache as offline fallback) for read-only
// Aurora API endpoints. Mutations (POST/PUT/DELETE) and auth/sync routes are
// bypassed.
//
// Why network-first instead of stale-while-revalidate: SWR returned the
// PREVIOUS cached payload to the page on every navigation and only updated
// the cache in the background, so the UI was always one navigation behind
// (and stale responses overwrote optimistic updates in SpendingProvider).
// Instant first paint is already handled by the persistent context providers
// and the localStorage warm-start — the SW cache only needs to cover offline.

const CACHE_NAME = 'aurora-api-v2';
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

  event.respondWith(networkFirst(req));
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch {
    // Network unavailable — fall back to the last cached payload (offline).
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ status: false, message: 'offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
