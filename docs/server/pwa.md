---
title: Progressive Web App
layout: doc
slug: pwa
---

# Progressive Web App

## Glossary

- **App Shell**: The minimal HTML/CSS/JS scaffolding (header, nav, layout) cached up-front so the UI paints instantly even on cold starts or offline.
- **Service Worker**: A script that runs in a background thread, separate from the page, and acts as a programmable network proxy for fetch, push, and sync events.
- **Web App Manifest**: A JSON file describing the app's name, icons, start URL, and display mode — what the browser uses to install the site as an app.
- **VAPID**: Voluntary Application Server Identification. A public/private key pair the server uses to authenticate itself to the browser's push service.
- **Cache Storage API**: The `caches.*` API used inside service workers to store and look up `Request`/`Response` pairs by URL.
- **IndexedDB**: A transactional, async, in-browser key-value/object store used for larger or structured data that exceeds Cache Storage limits.
- **PRPL**: Push critical resources, Render initial route, Pre-cache remaining routes, Lazy-load the rest — a performance pattern for PWAs.

## Detailed Description

Progressive Web Apps resolve the long-standing tension between web reach and native capability. Web apps deploy universally — any browser, no install friction, instant updates, linkable URLs — but historically lacked offline support, push notifications, home-screen presence, and the smooth performance of installed apps. Native apps offer those capabilities but require app store approval, per-platform codebases, large downloads, and update delays. PWAs blend the two: write once, deploy everywhere, install on demand, work offline, and notify users — all without a gatekeeper.

Three technologies do the work together. **Service Workers** are background scripts that intercept network requests, serve cached responses when offline, replay queued work when connectivity returns, and receive push messages even with the page closed. The **Web App Manifest** is a JSON file describing name, icons, theme color, `start_url`, `scope`, and `display` mode — the browser reads it to power "Add to Home Screen." **HTTPS** is required for both, since a worker that intercepts traffic must run on a trusted origin.

A Service Worker moves through four lifecycle states — Register, Install, Activate, Fetch. Register happens when the page calls `navigator.serviceWorker.register('/sw.js')`. Install fires once per version and is where you pre-cache assets via `caches.open().addAll()`. Activate fires after the previous worker terminates and is where you delete old caches; `clients.claim()` lets the new worker control existing tabs immediately. Fetch intercepts every network request, and `event.respondWith()` decides whether to return cache, network, or a mix. A new worker normally waits in "installed" until all controlled tabs close, unless `skipWaiting()` forces an immediate takeover.

Cache strategy is the operational core, and choice depends on content type:

- **Cache First** — serve cache instantly, hit network only on miss. Best for hashed, immutable assets (JS/CSS/fonts/images).
- **Network First** — try network with a timeout, fall back to cache. Best for API responses where freshness matters.
- **Stale While Revalidate** — return cache immediately, refresh in the background. Best for feeds and frequently updated pages.
- **Network Only** / **Cache Only** — escape hatches for sensitive data and pre-cached critical assets.

On top of caching, PWAs add three engagement primitives. **Background Sync** queues a form submission to IndexedDB when offline and replays it once the browser fires a `sync` event. **Push Notifications** combine the Push API (server-to-worker transport, authenticated with VAPID keys) with the Notifications API (`self.registration.showNotification()`) — push delivers, notification displays. **Installability** is gated on HTTPS, a valid manifest with name/icons/start_url/display, a registered service worker with a fetch handler, and a small engagement signal; once satisfied, the browser fires `beforeinstallprompt`, which you can defer to wire up a custom "Install" button.

## Key Insight

Progressive Web Apps turn ordinary websites into installable, offline-capable, push-notifying apps — without an app store. Three pieces do the heavy lifting: a **Service Worker** (a programmable network proxy that intercepts fetches and caches responses), a **Web App Manifest** (JSON that tells the browser the app's name, icons, and how to launch it), and **HTTPS** (required for both). The payoff: web reach (billions of devices, search-discoverable, instant updates) plus native feel (offline, notifications, home-screen launch, 60fps) — with no gatekeepers and no multi-gigabyte downloads.

## Code Examples

### Basic Example: Service Worker Registration and Caching

Simple PWA setup with offline support:

```javascript
// ===== public/sw.js =====
// Service Worker with basic caching

const CACHE_NAME = 'my-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/app.js',
  '/offline.html'
];

// Install event: cache essential assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control immediately
  );
});

// Fetch event: serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone request for fetch
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone response to cache
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        }).catch(() => {
          // Network failed, return offline page
          return caches.match('/offline.html');
        });
      })
  );
});


// ===== public/manifest.json =====
{
  "name": "My Progressive Web App",
  "short_name": "MyPWA",
  "description": "A sample PWA demonstrating offline capabilities",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#4285f4",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}


// ===== public/index.html =====
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#4285f4">
  <title>My PWA</title>
  
  <!-- PWA manifest -->
  <link rel="manifest" href="/manifest.json">
  
  <!-- iOS support -->
  <link rel="apple-touch-icon" href="/icons/icon-192x192.png">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  
  <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
  <h1>My Progressive Web App</h1>
  <p id="status">Online</p>
  
  <script>
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered:', registration.scope);
          })
          .catch((error) => {
            console.error('SW registration failed:', error);
          });
      });
    }
    
    // Offline/online status
    window.addEventListener('online', () => {
      document.getElementById('status').textContent = 'Online';
    });
    window.addEventListener('offline', () => {
      document.getElementById('status').textContent = 'Offline';
    });
  </script>
</body>
</html>
```

### Practical Example: Advanced Cache Strategies

Different caching strategies for different resource types:

```javascript
// ===== public/sw.js =====
const CACHE_NAME = 'advanced-pwa-v1';
const RUNTIME_CACHE = 'runtime-cache-v1';
const IMAGE_CACHE = 'image-cache-v1';
const API_CACHE = 'api-cache-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/app.js',
  '/offline.html'
];

// Install: pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE, API_CACHE];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !currentCaches.includes(name))
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: apply different strategies based on request type
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // API requests: Network First (fresh data, fallback to cache)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }
  
  // Images: Cache First (fast, fallback to network)
  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }
  
  // HTML pages: Stale While Revalidate (instant + background update)
  if (request.mode === 'navigate') {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
    return;
  }
  
  // Static assets: Cache First
  event.respondWith(cacheFirst(request, CACHE_NAME));
});

// Strategy: Cache First (fast loading, good for static assets)
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return cache.match('/offline.html');
    }
    throw error;
  }
}

// Strategy: Network First (fresh data, good for API requests)
async function networkFirst(request, cacheName, timeout = 3000) {
  const cache = await caches.open(cacheName);
  
  try {
    // Race network request against timeout
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('timeout')), timeout)
      )
    ]);
    
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] Network failed, serving from cache:', request.url);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    throw error;
  }
}

// Strategy: Stale While Revalidate (instant response + background update)
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  // Fetch fresh copy in background
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });
  
  // Return cached immediately if available, otherwise wait for network
  return cached || fetchPromise;
}


// ===== Cache size management =====
// Limit cache size to prevent unbounded growth

const MAX_CACHE_SIZE = 50;

async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    trimCache(cacheName, maxItems); // Recursive
  }
}

// Trim caches periodically
self.addEventListener('message', (event) => {
  if (event.data.action === 'trimCaches') {
    event.waitUntil(
      Promise.all([
        trimCache(IMAGE_CACHE, MAX_CACHE_SIZE),
        trimCache(API_CACHE, 20)
      ])
    );
  }
});
```

### Advanced Example: Background Sync and Push Notifications

Offline form submission and push notifications:

```javascript
// ===== public/sw.js =====
// Background Sync for offline form submissions

self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-form-data') {
    event.waitUntil(syncFormData());
  }
});

async function syncFormData() {
  // Get pending form submissions from IndexedDB
  const db = await openDB();
  const tx = db.transaction('pendingForms', 'readonly');
  const store = tx.objectStore('pendingForms');
  const pendingForms = await store.getAll();
  
  for (const form of pendingForms) {
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.data)
      });
      
      if (response.ok) {
        // Remove from pending queue
        const deleteTx = db.transaction('pendingForms', 'readwrite');
        await deleteTx.objectStore('pendingForms').delete(form.id);
        console.log('[SW] Form synced successfully');
      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      console.error('[SW] Sync failed, will retry:', error);
      // Browser will retry automatically
    }
  }
}

// Push Notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event.data?.text());
  
  const data = event.data?.json() || {};
  const title = data.title || 'New Notification';
  const options = {
    body: data.body || 'You have a new message',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    },
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'close', title: 'Close' }
    ],
    tag: data.tag || 'default',
    renotify: true
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Check if already open
        for (const client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});


// ===== app.js (main application) =====
// Request notification permission and subscribe to push

async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    console.log('Notification permission granted');
    await subscribeToPush();
  } else {
    console.log('Notification permission denied');
  }
}

async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;
  
  // VAPID public key (from your server)
  const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY';
  const convertedKey = urlBase64ToUint8Array(vapidPublicKey);
  
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedKey
    });
    
    console.log('Push subscription:', subscription);
    
    // Send subscription to server
    await fetch('/api/push-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    });
  } catch (error) {
    console.error('Push subscription failed:', error);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Background sync for offline form submission
async function submitForm(formData) {
  if (!navigator.onLine) {
    // Save to IndexedDB for background sync
    const db = await openDB();
    const tx = db.transaction('pendingForms', 'readwrite');
    await tx.objectStore('pendingForms').add({
      id: Date.now(),
      data: formData,
      timestamp: new Date().toISOString()
    });
    
    // Register sync event
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register('sync-form-data');
    
    console.log('Form saved for background sync');
    return;
  }
  
  // Online - submit immediately
  const response = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  return response.json();
}

// IndexedDB helper
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PWA_DB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingForms')) {
        db.createObjectStore('pendingForms', { keyPath: 'id' });
      }
    };
  });
}


// ===== Install prompt handling =====
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent automatic prompt
  event.preventDefault();
  deferredPrompt = event;
  
  // Show custom install button
  document.getElementById('installButton').style.display = 'block';
});

document.getElementById('installButton').addEventListener('click', async () => {
  if (!deferredPrompt) return;
  
  // Show install prompt
  deferredPrompt.prompt();
  
  const { outcome } = await deferredPrompt.userChoice;
  console.log('Install prompt outcome:', outcome);
  
  deferredPrompt = null;
  document.getElementById('installButton').style.display = 'none';
});

// Detect when app was successfully installed
window.addEventListener('appinstalled', () => {
  console.log('PWA installed successfully');
  deferredPrompt = null;
});
```

## Common Mistakes

### 1. Not Handling Service Worker Updates Properly
**Mistake:** Users stuck with old Service Worker version.

```javascript
// ❌ BAD: No update mechanism
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open('v1').then(cache => cache.addAll(urls)));
});
// Users never get new version even after deploying updates
```

```javascript
// ✅ GOOD: Proper update flow with skipWaiting
const CACHE_NAME = 'my-pwa-v2'; // Increment version

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urls))
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(names => {
      return Promise.all(
        names.filter(n => n !== CACHE_NAME)
          .map(n => caches.delete(n)) // Delete old caches
      );
    }).then(() => self.clients.claim())
  );
});
```

**Why it matters:** Without proper updates, users are stuck with stale content. Change CACHE_NAME to trigger new Service Worker installation.

### 2. Caching Everything Without Limits
**Mistake:** Unbounded cache growth consuming storage.

```javascript
// ❌ BAD: Cache everything forever
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open('unlimited').then(cache => {
      return cache.match(event.request).then(response => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          cache.put(event.request, networkResponse.clone()); // Cache grows infinitely
          return networkResponse;
        });
        return response || fetchPromise;
      });
    })
  );
});
```

```javascript
// ✅ GOOD: Cache with size limits and expiration
const MAX_CACHE_SIZE = 50;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

async function cacheWithExpiration(request, response, cacheName) {
  const cache = await caches.open(cacheName);
  
  // Add expiration timestamp
  const clonedResponse = response.clone();
  const headers = new Headers(clonedResponse.headers);
  headers.append('sw-cache-timestamp', Date.now().toString());
  
  const responseWithExpiry = new Response(clonedResponse.body, {
    status: clonedResponse.status,
    statusText: clonedResponse.statusText,
    headers
  });
  
  cache.put(request, responseWithExpiry);
  
  // Trim cache if too large
  const keys = await cache.keys();
  if (keys.length > MAX_CACHE_SIZE) {
    cache.delete(keys[0]);
  }
}

async function getCachedResponse(request, cacheName) {
  const cache = await caches.open(cacheName);
  const response = await cache.match(request);
  
  if (!response) return null;
  
  // Check expiration
  const timestamp = response.headers.get('sw-cache-timestamp');
  if (timestamp && Date.now() - parseInt(timestamp) > CACHE_DURATION) {
    cache.delete(request);
    return null;
  }
  
  return response;
}
```

**Why it matters:** Unlimited caching fills device storage. Implement size limits and expiration to manage cache efficiently.

### 3. Missing Offline Fallback
**Mistake:** Broken experience when offline.

```javascript
// ❌ BAD: No fallback for offline navigation
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
// Navigating to uncached page shows browser error
```

```javascript
// ✅ GOOD: Graceful offline fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        
        return fetch(event.request).catch(() => {
          // Network failed - serve offline page for navigation
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
          
          // Serve placeholder image for image requests
          if (event.request.destination === 'image') {
            return caches.match('/images/offline-placeholder.png');
          }
          
          // For API requests, return meaningful error
          if (event.request.url.includes('/api/')) {
            return new Response(
              JSON.stringify({ error: 'Offline - data unavailable' }),
              { headers: { 'Content-Type': 'application/json' } }
            );
          }
        });
      })
  );
});

// Pre-cache offline page during install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/offline.html',
        '/images/offline-placeholder.png'
      ]);
    })
  );
});
```

**Why it matters:** Users expect graceful degradation. Offline fallbacks provide branded experience instead of browser errors.

## PRPL Pattern

PRPL is a pattern for optimizing PWA performance, especially for mobile and low-network conditions:

**P - Push** critical resources for initial route
- HTTP/2 Server Push for critical CSS/JS
- `<link rel="preload">` for above-fold assets
- Inline critical CSS in `<head>`

**R - Render** initial route ASAP
- Server-side render or static generation
- App shell loads instantly
- Progressive enhancement

**P - Pre-cache** assets for other routes
- Service Worker caches during install
- Background cache for anticipated navigation
- Cache on demand as user navigates

**L - Lazy-load** non-critical resources
- Code splitting per route
- `import()` for deferred modules
- Intersection Observer for images

**Benefits:**
- ⚡ Faster initial page load (FCP <1s)
- 📱 Works on low-end devices
- 🌐 Performs on slow networks (3G)
- ♻️ Efficient caching
- 🎯 Optimized per route

**Implementation:**
```javascript
// 1. Push critical resources
<link rel="preload" href="/critical.css" as="style">
<link rel="preload" href="/critical.js" as="script">

// 2. Render app shell immediately
<div id="app-shell">
  <header>...</header>
  <nav>...</nav>
  <main id="content">Loading...</main>
</div>

// 3. Pre-cache in Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('shell-v1').then(cache => 
      cache.addAll(['/shell.html', '/critical.css', '/critical.js'])
    )
  );
});

// 4. Lazy-load routes
const routes = {
  '/home': () => import('./routes/home.js'),
  '/products': () => import('./routes/products.js'),
  '/about': () => import('./routes/about.js')
};

router.on('navigate', async (path) => {
  const loadRoute = routes[path];
  const module = await loadRoute(); // Load on demand
  module.render();
});
```

## Quick Quiz

{% include quiz.html id="pwa-1"
   question="What are the states of a service worker's lifecycle?"
   options="A|Register, Compile, Run, Terminate — a single linear path identical to a normal script's load sequence;;B|Register (page calls navigator.serviceWorker.register), Install (fires once per version — pre-cache assets in the install event with caches.open().addAll()), Activate (fires after the previous SW terminates — clean up old caches; clients.claim() takes control immediately), and Fetch (intercepts network requests via event.respondWith). A new SW waits in 'installed' state until all controlled tabs close, unless skipWaiting() forces immediate activation;;C|Mount, Update, Unmount — the same lifecycle as a React component, just running off the main thread;;D|Open, Read, Write, Close — service workers are essentially file handles for the Cache API"
   correct="B"
   explanation="Knowing the lifecycle is how you implement &quot;new version available — reload?&quot; UX correctly. skipWaiting() and clients.claim() let you force takeover, at the cost of potentially interrupting the running page." %}

{% include quiz.html id="pwa-2"
   question="When should you use Cache First vs Network First caching?"
   options="A|Cache First for immutable, hashed assets (JS/CSS/fonts/images) — serve instantly, update in the background (stale-while-revalidate). Network First for dynamic or time-sensitive data (API responses, user-specific content) — fall back to cache only when offline;;B|Network First for all assets;;C|Cache First for everything;;D|Always go to the network and never cache"
   correct="A"
   explanation="Matching strategy to content is the whole point of a service worker. Immutable assets want Cache First; fresh data wants Network First with a cache fallback." %}

{% include quiz.html id="pwa-3"
   question="What are the minimum requirements for a site to be installable as a PWA?"
   options="A|Only a service worker;;B|Just a manifest.json;;C|A native app in the store first;;D|Served over HTTPS (or localhost for dev), a valid web app manifest with at least name/short_name, start_url, display (standalone/fullscreen/etc), and icons (typically 192px + 512px), plus a registered service worker"
   correct="D"
   explanation="Browsers gate the install prompt on these baseline signals. Missing any one (no HTTPS, missing icons, no service worker) typically suppresses the install affordance." %}

{% include quiz.html id="pwa-4"
   question="How does Background Sync help with offline form submissions?"
   options="A|The page registers a sync tag when offline submission fails; the service worker listens for the 'sync' event, which the browser fires once connectivity is restored, and replays the queued request from IndexedDB. The user gets confirmation without reopening the app;;B|It disables the form offline;;C|It caches the final URL only;;D|It is a server-side feature"
   correct="A"
   explanation="Background Sync (via Workbox queues or a manual IndexedDB queue) turns flaky networks from &quot;lost data&quot; into &quot;deferred success&quot; without the user doing anything." %}

{% include quiz.html id="pwa-5"
   question="What's the difference between the Push API and the Notifications API?"
   options="A|They are the same thing;;B|Push only works on Android;;C|Notifications are deprecated;;D|Push API delivers a message from a server to the service worker even when the app is closed (via a push service like FCM/APNS bridge + a VAPID-signed subscription). Notifications API displays a system-level notification. Push usually triggers a Notification, but each can be used without the other"
   correct="D"
   explanation="Push = transport (server -> SW). Notification = UI. Web push subscriptions require user permission; notifications can also be triggered from any page with the right permission." %}

## References
- [1] https://www.techtarget.com/whatis/definition/progressive-web-app-PWA
- [2] https://flancer32.com/minimal-pwa-585664286cda?gi=fb3b528a28c5
- [3] https://alokai.com/blog/pwa
- [4] https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html
- [5] https://web.dev/articles/what-are-pwas
- [6] https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/
- [7] https://en.wikipedia.org/wiki/Progressive_web_application
- [8] https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/js13kGames/Installable_PWAs
- [9] https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
- [10] https://www.freecodecamp.org/news/what-are-progressive-web-apps/
- [11] https://stackoverflow.com/questions/47055893/what-is-a-progressive-web-app-in-laymans-terms
- [12] https://web.dev/articles/install-criteria
- [13] https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/
- [14] https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable
- [15] https://asperbrothers.com/blog/pwa-2019-best-practices-checklist/
- [16] https://blog.logrocket.com/prpl-pattern-solutions-for-modern-web-app-optimization/ (PRPL)
- [17] https://www.gatsbyjs.com/blog/prpl-pattern/ (PRPL)
- [18] https://www.patterns.dev/vanilla/prpl/ (PRPL)
- [19] https://web.dev/articles/apply-instant-loading-with-prpl (PRPL)
- [20] https://polymer-library.polymer-project.org/3.0/docs/apps/prpl (PRPL)
- [21] https://polymer-library.polymer-project.org/2.0/docs/apps/prpl (PRPL)
- [22] https://houssein.me/thinking-prpl (PRPL)
- [23] https://mannes.tech/prpl-pattern/ (PRPL)
- [24] https://www.linkedin.com/pulse/how-structure-pwas-prpl-patterns-getinrhythm (PRPL)
