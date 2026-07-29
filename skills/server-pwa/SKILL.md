---
name: server-pwa
description: Progressive Web Apps — web app manifest fields and icon sizes, service-worker lifecycle (register/install/activate/fetch) with `skipWaiting`/`clients.claim`, cache strategies (cache-first, network-first, stale-while-revalidate), offline fallbacks and cache trimming, Background Sync via IndexedDB, Push + Notifications with VAPID, `beforeinstallprompt`, and the PRPL pattern. Use when making a site installable, adding or debugging a service worker, choosing a cache strategy, or shipping offline/push behaviour.
when_to_use: Writing or reviewing a `manifest.json`/`manifest.webmanifest`; registering or versioning a service worker; picking a cache strategy per resource type; adding an offline fallback page; queueing offline form submissions with Background Sync; wiring web push with VAPID keys; building a custom install button; diagnosing why the install prompt never fires or why users are stuck on a stale worker.
paths:
  - "**/manifest.{json,webmanifest}"
  - "**/{sw,service-worker,serviceWorker}.{js,ts}"
  - "**/workbox-config.{js,cjs,mjs}"
---

# Progressive Web App

## What is a PWA?

A Progressive Web App is an ordinary website that adds three things: a **service worker** (a background script acting as a programmable network proxy), a **web app manifest** (JSON describing name, icons, `start_url`, `display`), and **HTTPS** (required for both). Together they buy offline support, home-screen installation, and push notifications without an app store, a native codebase, or a review queue.

## Key Principles

1. **The Service Worker Is a Proxy, Not a Cache**: It intercepts every `fetch` and *decides* the response — cache, network, a race between them, or a synthesised fallback. The Cache Storage API is just its backing store.

2. **Lifecycle Governs Updates**: Register → install (pre-cache) → activate (purge old caches) → fetch. A new worker idles in `installed` until every controlled tab closes unless `skipWaiting()` forces takeover and `clients.claim()` adopts open tabs. Version the cache name or users never see a deploy.

3. **Strategy Follows Content Type**: Hashed immutable assets want cache-first. API responses want network-first with a timeout. Feeds want stale-while-revalidate. Credentials and payments want network-only.

4. **Installability Is a Checklist**: HTTPS, a valid manifest with `name`/`short_name`/`start_url`/`display`/192px+512px icons, and a registered worker with a `fetch` handler. Miss one and `beforeinstallprompt` never fires.

## Best Practices

✅ **DO**:
- Version the cache name (`app-v3`) and delete non-current caches on `activate`
- Match a strategy to each request type in one `fetch` handler that dispatches by URL/destination
- Pre-cache an `offline.html` and a placeholder image during `install`
- Bound every runtime cache with a size cap or timestamp expiry
- Provide a maskable 512px icon and honest `theme_color`/`background_color`
- Defer `beforeinstallprompt` and surface your own install button

❌ **DON'T**:
- Cache API responses in the same bucket as the app shell
- Let a runtime cache grow unbounded — it fills device storage
- Cache authenticated or personalised responses
- Call `skipWaiting()` blindly while a user has unsaved work in an open tab
- Ship a stock manifest with placeholder names and no maskable icons
- Assume Background Sync or Push exist — feature-detect and degrade

## Code Patterns

### Web App Manifest

```json
{
  "name": "Elegant Todo",
  "short_name": "Todo",
  "description": "Offline-capable todo app",
  "start_url": ".",
  "scope": "/",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff",
  "icons": [
    { "src": "favicon.ico", "sizes": "64x64 32x32 16x16", "type": "image/x-icon" },
    { "src": "logo192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "logo512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

Link it from the host document alongside the iOS affordances:

```html
<link rel="manifest" href="/manifest.json" />
<link rel="apple-touch-icon" href="/logo192.png" />
<meta name="theme-color" content="#000000" />
```

### Lifecycle and Cache Versioning

```javascript
// sw.js
const CACHE = 'app-v3';
const SHELL = ['/', '/index.html', '/offline.html', '/assets/app.css'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});
```

### Strategy Dispatch

```javascript
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;                              // never cache mutations
  if (url.pathname.startsWith('/api/')) return event.respondWith(networkFirst(request));
  if (request.mode === 'navigate')     return event.respondWith(staleWhileRevalidate(request));
  event.respondWith(cacheFirst(request));                            // hashed assets
});

async function networkFirst(request, timeout = 3000) {
  const cache = await caches.open('api-v1');
  try {
    const res = await Promise.race([
      fetch(request),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout)),
    ]);
    if (res.ok) cache.put(request, res.clone());
    return res;
  } catch {
    return (await cache.match(request)) ?? Response.json({ error: 'offline' }, { status: 503 });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open('pages-v1');
  const cached = await cache.match(request);
  const fresh = fetch(request)
    .then((res) => { if (res.ok) cache.put(request, res.clone()); return res; })
    .catch(() => cache.match('/offline.html'));
  return cached ?? fresh;
}
```

### Background Sync and Push

```javascript
// Page: queue offline, then ask the browser to replay
async function submit(data) {
  if (navigator.onLine) return fetch('/api/submit', { method: 'POST', body: JSON.stringify(data) });
  await queueInIndexedDB(data);
  const reg = await navigator.serviceWorker.ready;
  if ('sync' in reg) await reg.sync.register('sync-forms');
}

// sw.js: replay on reconnect, then notify
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-forms') event.waitUntil(drainQueue());
});

self.addEventListener('push', (event) => {
  const { title = 'Update', body = '', url = '/' } = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(title, { body, icon: '/logo192.png', data: { url } })
  );
});
```

Push is transport (server → worker, authenticated with a VAPID key pair); the Notifications API is the UI. Either can be used without the other.

### Custom Install Prompt

```javascript
let deferred;
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferred = event;
  installButton.hidden = false;
});

installButton.addEventListener('click', async () => {
  if (!deferred) return;
  deferred.prompt();
  await deferred.userChoice;
  deferred = null;
  installButton.hidden = true;
});
```

### In the elegant templates

`templates/chota-react-saga` (and its mirrors, e.g. `chota-react-zustand`) is **manifest-ready but not yet a PWA**. It ships `public/manifest.json` with `start_url: "."`, `display: "standalone"`, `theme_color: "#000000"`, and favicon/`logo192.png`/`logo512.png` icons, and `index.html` links the manifest, an `apple-touch-icon`, and a `theme-color`. There is **no service worker** anywhere in the template and nothing calls `navigator.serviceWorker.register` — so the app is not installable and has no offline capability. To finish the job:

1. Add a `public/sw.js` (or adopt `vite-plugin-pwa` for precache-manifest generation) and register it from `src/index.jsx`.
2. Replace the stock Create-React-App manifest values — `short_name: "React App"` and `name: "Create React App Sample"` are placeholders that would ship as the installed app's name.
3. Mark the 192px icon `"purpose": "any maskable"` so Android does not letterbox it.

Note `vite.config.js` sets `base: './'`; a service worker's `scope` is tied to its own served path, so verify registration when the build is hosted from a subdirectory.

## Related Terminologies

- **App Shell** (Server) - The pre-cached skeleton a PWA paints instantly
- **Index File** (Server) - Host document links the manifest and registers the worker
- **Skeleton** (UI) - Shown while cached shell awaits data
- **SEO** (Server) - Installability and Core Web Vitals overlap on Page Experience
- **Images** (Server) - Icon sizes and cache-first image strategy

## Quality Gates

- [ ] Served over HTTPS with a valid manifest (name, `start_url`, `display`, 192+512 icons)
- [ ] Manifest values customised per app — no framework placeholder names
- [ ] Service worker registered and versioned; old caches deleted on `activate`
- [ ] A distinct strategy per resource type (assets vs API vs navigation)
- [ ] Offline fallback page pre-cached and reachable
- [ ] Runtime caches size-capped or expiring; no cached mutations or personalised responses

**Source**: `/docs/server/pwa.md`
