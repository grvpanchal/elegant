---
title: Progressive Web App
layout: doc
slug: pwa
---
Progressive Web Apps (PWAs) are web applications that provide a native app-like experience using modern web technologies. They offer the best of both worlds: the reach of web apps and the capabilities of native apps.

## Key Features of PWAs

- **Installable**: Can be added to the device's home screen
- **Offline Functionality**: Works with poor or no internet connection
- **Fast Performance**: Loads quickly and responds smoothly to user interactions
- **Push Notifications**: Can send updates to users even when the app is closed
- **Cross-Platform**: Works on multiple devices and operating systems

## Basic Setup for a PWA

### 1. Web App Manifest

Create a JSON file (usually named `manifest.json`) with essential information about your app:

```json
{
  "name": "My PWA",
  "short_name": "PWA",
  "start_url": "/",
  "display": "standalone",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 2. Service Worker

Create a JavaScript file (e.g., `sw.js`) to handle offline functionality and caching:

```javascript
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('my-pwa-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/app.js'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

### 3. HTTPS

Ensure your app is served over HTTPS, which is required for PWAs.

### 4. Register the Service Worker

In your main JavaScript file, register the service worker:

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      console.log('Service Worker registered');
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}
```

By implementing these basic components, you can transform your web app into a Progressive Web App, providing users with an enhanced, app-like experience across various devices and platforms.

## PRPL Pattern
PRPL is a pattern for optimizing web application performance, especially for mobile and low-network conditions. It stands for:

Push: Prioritize sending critical resources for the initial route quickly, often using techniques like preloading and HTTP/2 server push.

Render: Focus on rendering the initial route as soon as possible to improve perceived load time.

Pre-cache: Use service workers to cache assets for other routes and future visits.

Lazy-load: Defer loading of non-critical resources and routes until they are needed.

Key benefits of the PRPL pattern include:

- Faster initial page loads and time to interactivity
- Improved performance on low-end devices and poor network conditions
- Better offline functionality
- Efficient use of browser caching
- Optimized delivery of resources across routes

The PRPL pattern is not tied to specific technologies but rather represents an approach to structuring and serving web applications with a focus on performance optimization[1][3][5].


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
- [1] https://blog.logrocket.com/prpl-pattern-solutions-for-modern-web-app-optimization/
- [2] https://www.gatsbyjs.com/blog/prpl-pattern/
- [3] https://www.patterns.dev/vanilla/prpl/
- [4] https://web.dev/articles/apply-instant-loading-with-prpl
- [5] https://polymer-library.polymer-project.org/3.0/docs/apps/prpl
- [6] https://polymer-library.polymer-project.org/2.0/docs/apps/prpl
- [7] https://houssein.me/thinking-prpl
- [8] https://mannes.tech/prpl-pattern/
- [9] https://www.linkedin.com/pulse/how-structure-pwas-prpl-patterns-getinrhythm
