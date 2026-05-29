// ═══════════════════════════════════════════════════
// Service Worker — حاسبة العطور الاحترافية
// ═══════════════════════════════════════════════════

const CACHE_NAME = "atour-v1.0";
const ASSETS = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "/js/data.js",
  "/icon-192.png",
  "/icon-512.png",
  "/manifest.json"
];

// ── Install: cache all assets ──
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: clean old caches ──
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first for local, network-first for API ──
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // API calls (Anthropic) — always network, no cache
  if (url.hostname.includes("anthropic.com")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Local assets — cache first, fallback to network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache new valid responses
        if (response && response.status === 200 && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback
        if (event.request.destination === "document") {
          return caches.match("/index.html");
        }
      });
    })
  );
});
