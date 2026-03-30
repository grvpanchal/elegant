---
title: Index file
layout: doc
slug: index-file
---

# Index File

## Key Insight

The index file is the **entry point contract** between servers and applications—when you visit `example.com/folder`, the server automatically looks for `folder/index.html`, making "index" the default filename convention across web infrastructure. This convention spans multiple contexts: `index.html` is the browser's entry point (loads first), `index.js` is JavaScript's module entry point (imported when you `import './folder'`), and package.json's `"main": "index.js"` tells Node.js where to start. Understanding index files prevents common bugs: forgetting `index.html` causes 403 Forbidden errors, misconfiguring Webpack's entry point (`entry: './src/index.js'`) breaks builds, and incorrectly setting package.json's main field makes your npm package unimportable. The power of index files lies in defaults—they reduce boilerplate (no need to specify `/index.html` in URLs) and create predictable project structure (every folder can be treated as a module).

## Detailed Description

### 1. index.html: The Web's Default Document

When a web server receives a request for a directory path (`https://example.com/products/`), it automatically looks for specific filenames in order of precedence (configurable, but typically `index.html`, `index.htm`, `default.html`). This behavior is defined in server configuration:

**Apache (.htaccess or httpd.conf)**:
```apache
DirectoryIndex index.html index.htm default.html
```

**Nginx (nginx.conf)**:
```nginx
index index.html index.htm;
```

This means:
- `https://example.com/` → Serves `example.com/index.html`
- `https://example.com/about/` → Serves `example.com/about/index.html`
- `https://example.com/products/` → Serves `example.com/products/index.html`

Without an index file, requesting a directory returns either a **403 Forbidden** (directory listing disabled) or **auto-generated file list** (directory listing enabled, security risk).

**SEO Implications**: URLs with and without trailing slash (`/products` vs `/products/`) are treated as different pages by search engines. Proper redirects and canonical tags prevent duplicate content issues.

### 2. index.html Structure and Best Practices

Modern index.html files follow semantic HTML5 structure and include critical metadata for SEO, performance, and accessibility:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Character encoding (must be first in <head>) -->
  <meta charset="UTF-8">
  
  <!-- Viewport for responsive design -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO metadata -->
  <title>Page Title - Brand Name</title>
  <meta name="description" content="150-160 character description for search results">
  <meta name="keywords" content="keyword1, keyword2">
  
  <!-- Open Graph (social media previews) -->
  <meta property="og:title" content="Page Title">
  <meta property="og:description" content="Description">
  <meta property="og:image" content="https://example.com/og-image.jpg">
  <meta property="og:url" content="https://example.com/">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  
  <!-- Favicon -->
  <link rel="icon" href="/favicon.ico">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  
  <!-- Preload critical resources -->
  <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
  
  <!-- Critical CSS (inlined for first paint) -->
  <style>
    /* Critical above-the-fold styles */
    body { margin: 0; font-family: system-ui; }
  </style>
  
  <!-- Defer non-critical CSS -->
  <link rel="stylesheet" href="/styles.css" media="print" onload="this.media='all'">
</head>
<body>
  <!-- App root for JavaScript frameworks -->
  <div id="root"></div>
  
  <!-- Defer JavaScript for better performance -->
  <script src="/app.js" defer></script>
</body>
</html>
```

**Performance Optimization Techniques**:
- **Critical CSS inlined**: Reduces render-blocking requests
- **JavaScript deferred**: Scripts load without blocking HTML parsing
- **Resource hints**: `preload`, `prefetch`, `preconnect` optimize resource loading
- **Minimal HTML**: SPAs often have minimal index.html, React/Vue inject content via JavaScript

### 3. index.js: JavaScript Module Entry Points

In JavaScript module systems (CommonJS, ES Modules), importing a directory automatically resolves to `index.js`:

```javascript
// Folder structure:
// components/
//   ├── index.js
//   ├── Button.js
//   └── Input.js

// components/index.js (barrel export)
export { default as Button } from './Button';
export { default as Input } from './Input';

// Other files can import from folder
import { Button, Input } from './components'; // Resolves to ./components/index.js
```

This **barrel pattern** centralizes exports, creating cleaner imports. Without `index.js`, you'd need:
```javascript
import Button from './components/Button';
import Input from './components/Input';
```

**Node.js Resolution Algorithm**:
1. Check if `./components` is a file (components.js)
2. If directory, check `./components/package.json` "main" field
3. If no package.json, default to `./components/index.js`
4. If no index.js, throw error: `Cannot find module './components'`

### 4. index.js in React Applications

React apps bootstrapped with Create React App use `src/index.js` as the application entry point:

```javascript
// src/index.js (React 18)
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Global styles
import App from './App';

// Create root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: Performance monitoring
reportWebVitals(console.log);
```

**Webpack Configuration** links index.js to build process:
```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js', // Entry point
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};
```

Webpack starts at index.js, follows all imports, bundles into output file. Changing entry point to a different file breaks the build.

### 5. index.ts in TypeScript Projects

TypeScript projects use `index.ts` as entry point, with additional type definition considerations:

```typescript
// src/index.ts
import { App } from './App';
import { render } from './utils/render';

const rootElement = document.getElementById('root');

if (rootElement) {
  render(App, rootElement);
} else {
  throw new Error('Root element not found');
}

// Export public API for library projects
export { Button } from './components/Button';
export { Input } from './components/Input';
export type { ButtonProps, InputProps } from './types';
```

**package.json for TypeScript Libraries**:
```json
{
  "main": "dist/index.js",      // CommonJS entry point
  "module": "dist/index.esm.js", // ES Module entry point
  "types": "dist/index.d.ts",    // Type definitions
  "files": ["dist"]
}
```

When someone installs your package:
- Node.js uses `main` (index.js compiled from index.ts)
- Bundlers use `module` for tree-shaking
- TypeScript uses `types` for autocomplete and type checking

### 6. index.html in Single-Page Applications (SPAs)

SPAs serve a minimal index.html with a single `<div id="root"></div>`, then JavaScript renders everything:

**Before JavaScript loads** (index.html):
```html
<body>
  <div id="root"></div>
  <script src="/bundle.js"></script>
</body>
```

**After JavaScript executes**:
```html
<body>
  <div id="root">
    <header>...</header>
    <nav>...</nav>
    <main>...</main>
    <footer>...</footer>
  </div>
  <script src="/bundle.js"></script>
</body>
```

**SEO Problem**: Search engines request index.html, see empty `<div id="root"></div>`, index no content. **Solution**: Server-Side Rendering (SSR) or Static Site Generation (SSG) pre-renders content into index.html.

### 7. index.html in Static Site Generators

Static Site Generators (Gatsby, Next.js, Hugo) build separate index.html for each route:

```
dist/
├── index.html               (homepage)
├── about/
│   └── index.html           (/about page)
└── blog/
    ├── index.html           (/blog page)
    ├── post-1/
    │   └── index.html       (/blog/post-1)
    └── post-2/
        └── index.html       (/blog/post-2)
```

Each index.html contains pre-rendered HTML, improving SEO and performance. **Clean URLs** work without file extensions: `/about` serves `/about/index.html`.

### 8. Custom Index Files and Security

**Directory Listing Security Risk**:
If no index file exists and directory listing is enabled:
```
Index of /uploads
- user-data.csv
- passwords-backup.txt
- private-keys.pem
```

**Solution**: Always include index.html (even empty) or disable directory listing:
```apache
# Apache
Options -Indexes
```

```nginx
# Nginx
autoindex off;
```

**Multi-language Sites**:
Some servers support locale-specific index files:
```
index.en.html  (English)
index.fr.html  (French)
index.de.html  (German)
```

Configured via server rules to redirect based on `Accept-Language` header.

### 9. Index Files in Package.json

npm packages use package.json's `main` field to specify entry point:

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "main": "index.js",       // Default: when someone does require('my-library')
  "module": "index.esm.js", // ES Module entry point
  "browser": "index.umd.js", // Browser-specific build
  "exports": {
    ".": {
      "require": "./index.js",
      "import": "./index.esm.js"
    },
    "./utils": "./utils/index.js" // Subpath exports
  }
}
```

**Resolution Priority**:
1. `exports` field (if present, overrides everything)
2. `module` field (for bundlers)
3. `main` field (CommonJS default)
4. `index.js` (fallback if no fields specified)

Misconfiguring causes errors: `Cannot find module 'my-library'`.

## Code Examples

### Example 1: Complete HTML5 Index Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Required meta tags -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  
  <!-- SEO -->
  <title>Modern Web App | Fast, Secure, Accessible</title>
  <meta name="description" content="A production-ready index.html template with performance optimizations and SEO best practices.">
  <meta name="keywords" content="web app, performance, seo, pwa">
  <meta name="author" content="Your Name">
  <link rel="canonical" href="https://example.com/">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com/">
  <meta property="og:title" content="Modern Web App">
  <meta property="og:description" content="Production-ready template">
  <meta property="og:image" content="https://example.com/og-image.jpg">
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://example.com/">
  <meta property="twitter:title" content="Modern Web App">
  <meta property="twitter:description" content="Production-ready template">
  <meta property="twitter:image" content="https://example.com/twitter-image.jpg">
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#ffffff">
  
  <!-- Preconnect to external domains -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Preload critical resources -->
  <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/app.js" as="script">
  
  <!-- Critical CSS (inline for fastest render) -->
  <style>
    *,*::before,*::after{box-sizing:border-box}
    body{margin:0;font-family:system-ui,-apple-system,sans-serif;line-height:1.5}
    #root{min-height:100vh;display:flex;flex-direction:column}
  </style>
  
  <!-- Non-critical CSS (defer loading) -->
  <link rel="stylesheet" href="/styles.css" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="/styles.css"></noscript>
  
  <!-- PWA support -->
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
</head>
<body>
  <!-- App container -->
  <div id="root">
    <!-- Fallback content for no-JS users -->
    <noscript>
      <div style="padding: 2rem; text-align: center;">
        <h1>JavaScript Required</h1>
        <p>This application requires JavaScript to run. Please enable JavaScript in your browser settings.</p>
      </div>
    </noscript>
    
    <!-- Loading indicator (shown until React hydrates) -->
    <div id="loading" style="display: flex; align-items: center; justify-content: center; min-height: 100vh;">
      <div style="text-align: center;">
        <svg width="50" height="50" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke="#333" stroke-width="4" 
                  stroke-dasharray="31.4 31.4" transform="rotate(-90 25 25)">
            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" 
                              dur="1s" repeatCount="indefinite"/>
          </circle>
        </svg>
        <p>Loading...</p>
      </div>
    </div>
  </div>
  
  <!-- Scripts (defer for non-blocking load) -->
  <script src="/app.js" defer></script>
  
  <!-- Service Worker registration -->
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('SW registered:', reg.scope))
          .catch(err => console.error('SW registration failed:', err));
      });
    }
  </script>
  
  <!-- Analytics (load asynchronously) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  </script>
</body>
</html>
```

### Example 2: React index.js with Providers

{% raw %}
```javascript
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App';
import { store } from './store';
import './index.css';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1
    }
  }
});

// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Something went wrong</h1>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

// Get root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Make sure index.html contains <div id="root"></div>');
}

// Hide loading indicator
const loadingElement = document.getElementById('loading');
if (loadingElement) {
  loadingElement.style.display = 'none';
}

// Create root and render
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Performance monitoring
if (process.env.NODE_ENV === 'production') {
  // Web Vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
}

// Hot Module Replacement (development only)
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    root.render(
      <React.StrictMode>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              <BrowserRouter>
                <NextApp />
              </BrowserRouter>
            </QueryClientProvider>
          </Provider>
        </ErrorBoundary>
      </React.StrictMode>
    );
  });
}
```
{% endraw %}

### Example 3: Barrel Export Pattern with index.js

```javascript
// components/index.js (Barrel export)

// Import all components
import { Button } from './Button/Button';
import { Input } from './Input/Input';
import { Checkbox } from './Checkbox/Checkbox';
import { Modal } from './Modal/Modal';
import { Card } from './Card/Card';

// Re-export for convenient imports
export { Button } from './Button/Button';
export { Input } from './Input/Input';
export { Checkbox } from './Checkbox/Checkbox';
export { Modal } from './Modal/Modal';
export { Card } from './Card/Card';

// Named exports with aliases
export { Button as Btn } from './Button/Button';

// Export types (TypeScript)
export type { ButtonProps } from './Button/Button';
export type { InputProps } from './Input/Input';
export type { CheckboxProps } from './Checkbox/Checkbox';

// Usage in other files:
// Before barrel:
// import { Button } from './components/Button/Button';
// import { Input } from './components/Input/Input';
// import { Checkbox } from './components/Checkbox/Checkbox';

// After barrel:
// import { Button, Input, Checkbox } from './components';

// components/Button/index.js (Individual component barrel)
export { Button } from './Button';
export { default } from './Button'; // For default imports
export type { ButtonProps } from './Button';

// utils/index.js (Utility functions barrel)
export { formatDate } from './date';
export { validateEmail } from './validation';
export { debounce, throttle } from './performance';
export { sortBy, groupBy } from './array';

// Selective exports (don't export internal helpers)
export { publicHelper } from './helpers';
// privateHelper is NOT exported, stays internal

// Usage:
// import { formatDate, validateEmail, debounce } from './utils';
```

## Common Mistakes

### 1. Missing index.html in Deployment

❌ **Wrong**: Deploying SPA without index.html fallback for client-side routing.

```nginx
# nginx.conf (BAD)
server {
  listen 80;
  server_name example.com;
  root /var/www/html;
  
  location / {
    # Missing try_files directive
  }
}

# Result:
# /               → 200 OK (serves index.html)
# /about          → 404 Not Found (no about.html file)
# /products/123   → 404 Not Found (SPA routing breaks)
```

✅ **Correct**: Configure server to fallback to index.html for all routes.

```nginx
# nginx.conf (GOOD)
server {
  listen 80;
  server_name example.com;
  root /var/www/html;
  
  location / {
    try_files $uri $uri/ /index.html;
    # Try requested file, then directory, then fallback to index.html
  }
  
  # Cache static assets
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}

# Result:
# /               → 200 OK (serves index.html)
# /about          → 200 OK (serves index.html, React Router handles /about)
# /products/123   → 200 OK (serves index.html, React Router handles route)
```

**Why it matters**: SPAs use client-side routing. Requesting `/products/123` doesn't mean there's a `products/123.html` file—it's handled by JavaScript. Without fallback, direct URL access or page refreshes return 404.

### 2. Incorrect Package.json Main Field

❌ **Wrong**: package.json points to non-existent file.

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "main": "lib/index.js"
}

// File structure:
// my-library/
//   ├── package.json
//   ├── src/
//   │   └── index.js
//   └── dist/
//       └── bundle.js

// Result:
// require('my-library') → Error: Cannot find module './lib/index.js'
```

✅ **Correct**: Main points to actual compiled output.

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "main": "dist/index.js",        // CommonJS build
  "module": "dist/index.esm.js",  // ES Module build
  "types": "dist/index.d.ts",     // TypeScript definitions
  "files": ["dist"],              // Only include dist in npm package
  "scripts": {
    "build": "rollup -c",
    "prepublishOnly": "npm run build"
  }
}

// rollup.config.js ensures dist/index.js exists
export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/index.js', format: 'cjs' },
    { file: 'dist/index.esm.js', format: 'esm' }
  ]
};

// Result:
// require('my-library') → Loads dist/index.js ✓
// import from 'my-library' → Loads dist/index.esm.js ✓
```

**Why it matters**: Wrong main field makes your package unimportable. Users install it, try to import, get errors. Always test your package locally before publishing: `npm link` in package directory, `npm link my-library` in test project.

### 3. Index.html Not Optimized for Performance

❌ **Wrong**: Render-blocking resources in `<head>`.

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
  
  <!-- ❌ Render-blocking CSS -->
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="/theme.css">
  <link rel="stylesheet" href="/vendor.css">
  
  <!-- ❌ Render-blocking JavaScript -->
  <script src="/jquery.js"></script>
  <script src="/app.js"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>

<!-- Result: Browser blocks rendering until all CSS/JS downloaded -->
<!-- First Contentful Paint: 3-5 seconds -->
```

✅ **Correct**: Optimize resource loading.

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
  
  <!-- ✅ Inline critical CSS (above-the-fold styles) -->
  <style>
    /* Critical CSS extracted from styles.css */
    body{margin:0;font-family:system-ui}
    #root{min-height:100vh}
  </style>
  
  <!-- ✅ Defer non-critical CSS -->
  <link rel="preload" href="/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/styles.css"></noscript>
  
  <!-- ✅ Preconnect to external domains -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
</head>
<body>
  <div id="root"></div>
  
  <!-- ✅ Defer JavaScript (non-blocking) -->
  <script src="/app.js" defer></script>
</body>
</html>

<!-- Result: Browser renders page immediately with critical CSS -->
<!-- First Contentful Paint: <1 second -->
<!-- Full CSS/JS loads in background -->
```

**Why it matters**: Every render-blocking resource in `<head>` delays First Contentful Paint. Users see blank screen while browser downloads resources. Inline critical CSS, defer non-critical resources = faster perceived performance.

## Quiz

### Question 1: Index File Resolution

**Q**: When you import a folder in JavaScript (`import utils from './utils'`), what does the module system look for, and in what order?

**A**:

**Node.js Module Resolution Algorithm** (for `import './utils'` or `require('./utils')`):

1. **Check if `./utils` is a file**:
   - `./utils.js`
   - `./utils.json`
   - `./utils.node` (native addon)
   
2. **If `./utils` is a directory**, check for package.json:
   - Read `./utils/package.json`
   - If `exports` field exists, use it (highest priority):
     ```json
     "exports": {
       ".": "./dist/index.js"
     }
     ```
   - Else if `module` field exists (ES modules):
     ```json
     "module": "./esm/index.js"
     ```
   - Else use `main` field (CommonJS):
     ```json
     "main": "./lib/index.js"
     ```
   
3. **If no package.json**, default to index files:
   - `./utils/index.js`
   - `./utils/index.json`
   - `./utils/index.node`

4. **If none found**, throw error:
   ```
   Error: Cannot find module './utils'
   ```

**Example**:
```
utils/
├── package.json  →  { "main": "dist/bundle.js" }
├── index.js
└── dist/
    └── bundle.js

import utils from './utils';
// Resolves to: ./utils/dist/bundle.js (package.json "main" wins)

// If package.json deleted:
import utils from './utils';
// Resolves to: ./utils/index.js (default fallback)
```

**Why it matters**: Understanding resolution prevents "module not found" errors. If you create `components/Button.js` but import `./components`, it fails unless you add `components/index.js` or configure package.json.

### Question 2: SPA Routing and index.html

**Q**: Why do Single-Page Applications need server configuration to fallback to index.html? What happens without it?

**A**:

**The Problem**:

SPAs use **client-side routing** (React Router, Vue Router). When you navigate from `/` to `/products/123`, the browser **doesn't request a new HTML file**—JavaScript changes the URL and renders new components.

But if user **refreshes page** or **visits `/products/123` directly**, browser makes HTTP request to server:

```
GET /products/123 HTTP/1.1
Host: example.com
```

Server looks for file `products/123.html` → **doesn't exist** → returns 404.

**Without Fallback Configuration**:
```nginx
# No try_files directive
server {
  root /var/www/html;
  location / { }
}

# User visits example.com/products/123
# → Server looks for /var/www/html/products/123.html
# → File doesn't exist
# → Returns 404 Not Found
```

**With Fallback Configuration**:
```nginx
server {
  root /var/www/html;
  location / {
    try_files $uri $uri/ /index.html;
  }
}

# User visits example.com/products/123
# 1. Try $uri → /var/www/html/products/123 (not found)
# 2. Try $uri/ → /var/www/html/products/123/ (not found)
# 3. Fallback → /var/www/html/index.html (found!)
# → Returns index.html with 200 OK
# → React Router sees URL is /products/123
# → Renders ProductPage component
```

**Apache Configuration**:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Why it matters**: Without fallback, SPAs break on page refresh or direct URL access. Users bookmark `/products/123`, return later, get 404. Search engines crawl links, get 404s, don't index pages. Fallback is **mandatory** for SPAs in production.

### Question 3: Critical CSS in index.html

**Q**: What is critical CSS, and why should you inline it in index.html instead of loading from a separate file?

**A**:

**Critical CSS** = Styles required to render **above-the-fold content** (visible without scrolling).

**Traditional Approach** (Render-Blocking):
```html
<head>
  <link rel="stylesheet" href="/styles.css">
</head>

<!-- Timeline:
   0ms: HTML parsing starts
  50ms: <link> found, CSS request sent
 250ms: CSS downloaded (200ms on 3G)
 250ms: CSS parsed
 250ms: First Contentful Paint (FCP)
 -->
```

Browser **blocks rendering** until CSS downloaded and parsed = 250ms blank screen.

**Optimized Approach** (Inline Critical CSS):
```html
<head>
  <style>
    /* Critical CSS (2-5KB, extracted from styles.css) */
    body { margin: 0; font-family: system-ui; }
    header { background: #333; padding: 1rem; }
    .hero { min-height: 100vh; }
  </style>
  
  <!-- Defer non-critical CSS -->
  <link rel="preload" href="/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/styles.css"></noscript>
</head>

<!-- Timeline:
   0ms: HTML parsing starts
  10ms: Inline CSS parsed (no network request!)
  10ms: First Contentful Paint (FCP)
 250ms: Full CSS downloaded (in background, doesn't block)
 -->
```

**Benefits**:
- **FCP reduced from 250ms to 10ms** (24x faster)
- Above-the-fold content renders immediately
- Full CSS loads in background without blocking

**How to Extract Critical CSS**:
1. **Manual**: Identify above-the-fold styles, inline them
2. **Automated tools**:
   - [Critical](https://github.com/addyosmani/critical) (npm package)
   - [Penthouse](https://github.com/pocketjoso/penthouse)
   - [Critters](https://github.com/GoogleChromeLabs/critters) (webpack plugin)

**Example with Critical**:
```javascript
// build.js
const critical = require('critical');

critical.generate({
  inline: true,
  base: 'dist/',
  src: 'index.html',
  target: {
    html: 'index.html'
  },
  width: 1300,
  height: 900
});

// Reads dist/index.html
// Extracts critical CSS for 1300x900 viewport
// Inlines it in <style> tag
// Defers original <link rel="stylesheet">
```

**Tradeoffs**:
- **Pros**: Faster FCP, better perceived performance
- **Cons**: Larger HTML file (2-5KB added), build step complexity

**Why it matters**: Google uses FCP as Core Web Vital ranking factor. Sites with FCP <1.8s rank higher. Inlining critical CSS is easiest way to improve FCP without changing functionality.

## References

- [HTML Living Standard - Directory Index](https://html.spec.whatwg.org/)
- [Node.js Module Resolution Algorithm](https://nodejs.org/api/modules.html#modules_all_together)
- [Webpack Entry Points](https://webpack.js.org/concepts/entry-points/)
- [Critical Rendering Path - Web.dev](https://web.dev/critical-rendering-path/)
- [SEO Best Practices - Google Search Central](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)



