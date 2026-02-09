---
title: App Shell
layout: doc
slug: app-shell
---
# App Shell

An **App Shell** is the minimal HTML, CSS, and JavaScript required to power the user interface framework of a web application. It loads instantly (cached via Service Worker), providing the structural skeleton (header, navigation, footer) while dynamic content loads asynchronously. This architecture pattern, fundamental to Progressive Web Apps, separates the static application framework from dynamic content, enabling instant-loading UIs that feel native.

## Key Insight

The App Shell model inverts traditional server-rendering by caching the application infrastructure (shell) on first visit and streaming only data on subsequent loads, achieving instant perceived load times (<200ms) through aggressive Service Worker caching. This requires architecting your application into two distinct layers: the **static shell** (navigation, layout, critical CSS/JS cached for 1 year) and **dynamic content** (data fetched via API, populated client-side), with special attention to initial render path optimization (critical CSS inline, skeleton screens), hydration strategies (progressive enhancement, SSR for first paint), and cache invalidation patterns (versioned assets, stale-while-revalidate).

## Detailed Description

### 1. App Shell Architecture Fundamentals

The App Shell pattern emerged from Google's Progressive Web App initiatives, observing that most web apps repeatedly download the same header, navigation, and footer HTML on every page request—wasteful when those elements rarely change. The solution: deliver the application shell once, cache it aggressively, then load only content that actually changes.

Traditional multi-page app (MPA): Each navigation requests full HTML including redundant shell markup, parsing CSS/JS on every page load. App Shell model: First visit downloads complete shell + content, Service Worker caches shell assets, subsequent navigations load only JSON data (~5KB) instead of full HTML (~50KB), application already parsed and ready to render.

The shell typically includes: (1) **Navigation** – Menu, header, routing framework; (2) **Layout structure** – Sidebar, content container, footer grid; (3) **Critical CSS** – Above-fold styles inlined, theme CSS loaded async; (4) **JavaScript framework** – React/Vue/Angular runtime, routing library, state management; (5) **Offline fallback** – Service Worker, offline page template.

### 2. Service Worker Caching Strategy

Service Workers enable the App Shell model by intercepting network requests and serving cached responses. The cache-first strategy ensures instant shell loading:

```javascript
// Cache shell assets on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('app-shell-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles/main.css',
        '/scripts/app.js',
        '/images/logo.svg'
      ]);
    })
  );
});

// Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

Cache versioning (`app-shell-v1`, `app-shell-v2`) ensures updates deploy cleanly—when new version deploys, Service Worker installs new cache, deletes old cache on activation. Users get updates on next page load without stale content issues.

**Cache strategies by resource type**: (1) **Shell assets (HTML/CSS/JS)** – Cache-first with versioned URLs (`app.a3f2.js`), 1-year max-age; (2) **API data** – Network-first with fallback to cache (stale-while-revalidate), short TTL; (3) **Images/media** – Cache-first with size limits, lazy eviction; (4) **Third-party scripts** – Network-only (analytics, ads not cached).

### 3. Initial Render Path Optimization

The App Shell must render instantly (<200ms) to feel native. Achieving this requires optimizing the critical rendering path:

**Critical CSS Inlining**: Extract above-the-fold styles (header, navigation, skeleton screen) and inline in `<head>` to avoid render-blocking CSS request. Remaining styles load asynchronously:

```html
<head>
  <style>
    /* Critical CSS inlined (~5KB) */
    .header { background: #fff; height: 60px; }
    .nav { display: flex; }
    .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); }
  </style>
  <link rel="preload" href="/styles/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
</head>
```

**Skeleton Screens**: Instead of blank white screen or loading spinner, show content placeholders matching final layout. Users perceive faster load when seeing structure immediately, even if data pending. Skeleton animates (shimmer effect) signaling ongoing load.

**Resource Prioritization**: Modern browsers support `<link rel="preload">` to fetch critical resources early (fonts, hero images), and `<link rel="prefetch">` for likely next navigation. Combine with `fetchpriority="high"` on critical images.

### 4. Server-Side Rendering (SSR) + Hydration

Pure client-side App Shell has poor SEO (search engines see empty shell) and slow First Contentful Paint (FCP) on cold start (no cache). Solution: Server-Side Render initial content, then hydrate into interactive SPA.

**SSR Flow**: (1) Server renders app shell + initial content to HTML string, (2) Browser receives full HTML, displays immediately (fast FCP), (3) JavaScript downloads and executes, (4) Framework "hydrates" static HTML into interactive React/Vue components, attaching event listeners and state.

**Hydration challenges**: Mismatch between server HTML and client re-render causes errors. Ensure deterministic rendering (same props produce same HTML), avoid randomness (Math.random(), Date.now()), use stable IDs. Frameworks like Next.js handle this automatically.

**Progressive Hydration**: Don't hydrate entire app at once—prioritize visible, interactive components (navigation, CTA button), defer off-screen components (footer, comments section) until scroll. Reduces Time-to-Interactive (TTI) from 3s to <1s.

### 5. Providers and Dependency Injection

In micro-frontend architectures, the App Shell acts as a provider layer, injecting shared services (authentication, theme, i18n) to child micro-apps without tight coupling.

**Provider Pattern**: Shell wraps micro-frontends in context providers, exposing APIs via React Context, Angular DI, or custom event bus:

```javascript
// App Shell provides auth to all micro-frontends
<AuthProvider user={currentUser} login={handleLogin} logout={handleLogout}>
  <ThemeProvider theme={selectedTheme}>
    <MicroFrontend name="dashboard" />
    <MicroFrontend name="settings" />
  </ThemeProvider>
</AuthProvider>
```

Micro-frontends consume providers without knowing implementation:
```javascript
// Dashboard micro-frontend consumes auth
const Dashboard = () => {
  const { user, logout } = useAuth(); // From shell's AuthProvider
  return <div>Welcome {user.name} <button onClick={logout}>Logout</button></div>;
};
```

**Benefits**: (1) **Shared state** – Single source of truth for user session across all micro-apps, (2) **Decoupling** – Micro-apps don't import shell modules directly, only context APIs, (3) **Testability** – Mock providers in tests without complex setup, (4) **Flexibility** – Swap provider implementations (mock auth in dev, real OAuth in prod).

### 6. Routing and Navigation

App Shell routing must handle both shell navigation (switching micro-frontends) and micro-frontend internal routing (within dashboard, settings), preventing conflicts.

**Shell Router**: Owns top-level routes, mounts micro-frontends based on path:
```javascript
// App Shell router
<Router>
  <Route path="/dashboard/*" component={DashboardMFE} />
  <Route path="/settings/*" component={SettingsMFE} />
  <Route path="/reports/*" component={ReportsMFE} />
</Router>
```

**Micro-Frontend Sub-Routes**: Each MFE manages internal routes under its base path:
```javascript
// Dashboard MFE internal routes (under /dashboard/*)
<Router basename="/dashboard">
  <Route path="/" component={Overview} />
  <Route path="/analytics" component={Analytics} />
  <Route path="/users" component={Users} />
</Router>
```

**Navigation Coordination**: When Dashboard MFE wants to navigate to Settings, it uses shared navigation service provided by shell instead of directly manipulating history (which could cause conflicts):

```javascript
// Wrong: Direct history manipulation
history.push('/settings'); // May conflict with shell router

// Correct: Use shell navigation service
const { navigate } = useShellNavigation(); // Provided by App Shell
navigate('/settings'); // Shell handles transition between MFEs
```

### 7. State Management Across Micro-Frontends

App Shell often centralizes global state (user session, theme, notifications) while allowing micro-frontends local autonomy.

**Shared State Pattern**: Shell maintains Redux/Zustand store for global state, exposes selectors/actions via providers:

```javascript
// Shell Redux store
const shellStore = createStore({
  user: userReducer,
  theme: themeReducer,
  notifications: notificationsReducer
});

// Shell provides store to MFEs
<Provider store={shellStore}>
  <MicroFrontendContainer />
</Provider>
```

**Isolated State**: Micro-frontends maintain local state (form inputs, pagination) separate from shell, preventing coupling:

```javascript
// Dashboard MFE has own Redux store for local state
const dashboardStore = createStore({
  filters: filtersReducer,
  chartData: chartReducer
});

// Combines shell global state + MFE local state
const Dashboard = () => {
  const globalUser = useSelector(state => state.user); // From shell store
  const localFilters = useLocalSelector(state => state.filters); // From MFE store
};
```

### 8. Code Splitting and Lazy Loading

App Shell must be minimal (~50KB initial bundle) to load instantly. Achieve this through aggressive code splitting:

**Route-Based Splitting**: Load micro-frontends on-demand when routes match:
```javascript
// Lazy load MFEs
const DashboardMFE = lazy(() => import('./micro-frontends/dashboard'));
const SettingsMFE = lazy(() => import('./micro-frontends/settings'));

<Suspense fallback={<ShellSkeleton />}>
  <Router>
    <Route path="/dashboard/*" component={DashboardMFE} />
    <Route path="/settings/*" component={SettingsMFE} />
  </Router>
</Suspense>
```

When user navigates to `/dashboard`, Dashboard MFE bundle loads asynchronously (~200KB), shell shows skeleton while loading, then mounts component when ready.

**Vendor Splitting**: Separate vendor libraries (React, lodash) from application code, enabling long-term caching:
```javascript
// webpack config
optimization: {
  splitChunks: {
    cacheGroups: {
      vendor: {
        test: /node_modules/,
        name: 'vendors',
        chunks: 'all'
      }
    }
  }
}
```

Result: `app-shell.js` (30KB), `vendors.js` (150KB cached 1 year), `dashboard-mfe.js` (200KB loaded on-demand).

### 9. Polyfills and Browser Compatibility

Modern App Shell features (Service Workers, ES2020, CSS Grid) need polyfills for older browsers (IE11, Safari 12).

**Conditional Polyfill Loading**: Detect missing features, load only needed polyfills:
```javascript
// Load polyfills only if needed
async function loadPolyfills() {
  const polyfills = [];
  
  if (!('serviceWorker' in navigator)) {
    polyfills.push(import('serviceworker-polyfill'));
  }
  
  if (!window.IntersectionObserver) {
    polyfills.push(import('intersection-observer'));
  }
  
  await Promise.all(polyfills);
}

loadPolyfills().then(() => {
  // Initialize app after polyfills loaded
  initApp();
});
```

**Differential Serving**: Send modern ES2020 code to modern browsers, ES5 transpiled code to old browsers:
```html
<!-- Modern browsers get smaller ES2020 bundle -->
<script type="module" src="/app-shell.modern.js"></script>
<!-- Old browsers fallback to ES5 bundle -->
<script nomodule src="/app-shell.legacy.js"></script>
```

Modern bundle: 50KB (ES2020 with async/await, optional chaining). Legacy bundle: 120KB (ES5 with polyfills). Modern browsers save 70KB, old browsers still work.

Modern bundle: 50KB (ES2020 with async/await, optional chaining). Legacy bundle: 120KB (ES5 with polyfills). Modern browsers save 70KB, old browsers still work.

## Code Examples

### Example 1: Basic App Shell with Service Worker

```javascript
// public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>App Shell Demo</title>
  
  <!-- Critical CSS inlined -->
  <style>
    body { margin: 0; font-family: system-ui; }
    .app-shell { display: flex; flex-direction: column; min-height: 100vh; }
    .header { background: #1976d2; color: white; padding: 1rem; }
    .nav { display: flex; gap: 1rem; padding: 1rem; background: #f5f5f5; }
    .content { flex: 1; padding: 1rem; }
    .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
               background-size: 200% 100%; animation: shimmer 1.5s infinite; height: 20px; margin: 10px 0; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  </style>
</head>
<body>
  <div id="root" class="app-shell">
    <!-- Static shell renders immediately -->
    <header class="header">
      <h1>My Progressive Web App</h1>
    </header>
    
    <nav class="nav">
      <a href="#/">Home</a>
      <a href="#/dashboard">Dashboard</a>
      <a href="#/settings">Settings</a>
    </nav>
    
    <main id="content" class="content">
      <!-- Skeleton while content loads -->
      <div class="skeleton" style="width: 60%;"></div>
      <div class="skeleton" style="width: 80%;"></div>
      <div class="skeleton" style="width: 40%;"></div>
    </main>
  </div>
  
  <script src="/app.js" defer></script>
  
  <!-- Register Service Worker -->
  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('SW registered:', reg.scope))
        .catch(err => console.error('SW registration failed:', err));
    }
  </script>
</body>
</html>

// public/sw.js (Service Worker)
const CACHE_NAME = 'app-shell-v1';
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/styles.css',
  '/offline.html'
];

// Install: Cache shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Shell cache-first, API network-first
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // API requests: network-first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone and cache API response
          const copy = response.clone();
          caches.open('api-cache').then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(request);
        })
    );
    return;
  }
  
  // Shell assets: cache-first
  event.respondWith(
    caches.match(request)
      .then(response => response || fetch(request))
      .catch(() => caches.match('/offline.html'))
  );
});

// src/app.js (Client-side app)
class AppShell {
  constructor() {
    this.contentEl = document.getElementById('content');
    this.currentRoute = null;
    this.init();
  }
  
  init() {
    // Setup routing
    window.addEventListener('hashchange', () => this.route());
    this.route();
  }
  
  async route() {
    const hash = window.location.hash.slice(1) || '/';
    
    if (hash === this.currentRoute) return;
    this.currentRoute = hash;
    
    // Show skeleton while loading
    this.showSkeleton();
    
    // Load route content
    try {
      if (hash === '/') {
        await this.loadHome();
      } else if (hash === '/dashboard') {
        await this.loadDashboard();
      } else if (hash === '/settings') {
        await this.loadSettings();
      }
    } catch (error) {
      this.showError(error);
    }
  }
  
  showSkeleton() {
    this.contentEl.innerHTML = `
      <div class="skeleton" style="width: 60%;"></div>
      <div class="skeleton" style="width: 80%;"></div>
      <div class="skeleton" style="width: 40%;"></div>
    `;
  }
  
  async loadHome() {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.contentEl.innerHTML = `
      <h2>Welcome Home</h2>
      <p>This is the home page content loaded dynamically.</p>
    `;
  }
  
  async loadDashboard() {
    // Fetch dashboard data from API
    const response = await fetch('/api/dashboard');
    const data = await response.json();
    
    this.contentEl.innerHTML = `
      <h2>Dashboard</h2>
      <div>Users: ${data.users}</div>
      <div>Revenue: $${data.revenue}</div>
    `;
  }
  
  async loadSettings() {
    // Lazy load settings module
    const { renderSettings } = await import('./settings.js');
    renderSettings(this.contentEl);
  }
  
  showError(error) {
    this.contentEl.innerHTML = `
      <h2>Error</h2>
      <p>${error.message}</p>
    `;
  }
}

// Initialize app
new AppShell();
```

### Example 2: App Shell with SSR and Hydration (Next.js)

```javascript
// pages/_app.js (App Shell wrapper)
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AppLayout } from '../components/AppLayout';
import '../styles/critical.css'; // Critical CSS bundled

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;

// components/AppLayout.js (Shell structure)
import { useAuth } from '../contexts/AuthContext';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

{% raw %}
export function AppLayout({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <ShellSkeleton />;
  }
  
  return (
    <div className="app-shell">
      <Header user={user} />
      <Navigation />
      <main className="content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function ShellSkeleton() {
  return (
    <div className="app-shell">
      <div className="header-skeleton skeleton" />
      <div className="nav-skeleton skeleton" />
      <div className="content-skeleton">
        <div className="skeleton" style={{ width: '60%' }} />
        <div className="skeleton" style={{ width: '80%' }} />
      </div>
    </div>
  );
}
{% endraw %}

// contexts/AuthContext.js (Shared provider)
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

{% raw %}
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Restore session from cookie/localStorage
    restoreSession()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);
  
  const login = async (credentials) => {
    const user = await apiLogin(credentials);
    setUser(user);
    return user;
  };
  
  const logout = async () => {
    await apiLogout();
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
{% endraw %}

export const useAuth = () => useContext(AuthContext);

// pages/dashboard.js (Page using shell providers)
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Dashboard({ data }) {
  const { user } = useAuth(); // From App Shell provider
  const { theme } = useTheme(); // From App Shell provider
  
  return (
    <div className={`dashboard theme-${theme}`}>
      <h1>Welcome, {user.name}</h1>
      <div>Dashboard data: {JSON.stringify(data)}</div>
    </div>
  );
}

// Server-side rendering
export async function getServerSideProps() {
  const data = await fetchDashboardData();
  return { props: { data } };
}
```

### Example 3: Micro-Frontend Integration in App Shell

```javascript
// app-shell/src/Shell.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { ShellLayout } from './components/ShellLayout';

// Lazy load micro-frontends
const DashboardMFE = lazy(() => import('dashboard/App'));
const SettingsMFE = lazy(() => import('settings/App'));
const ReportsMFE = lazy(() => import('reports/App'));

{% raw %}
export function Shell() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <ShellLayout>
            <Suspense fallback={<MFESkeleton />}>
              <Routes>
                <Route path="/dashboard/*" element={<DashboardMFE />} />
                <Route path="/settings/*" element={<SettingsMFE />} />
                <Route path="/reports/*" element={<ReportsMFE />} />
              </Routes>
            </Suspense>
          </ShellLayout>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

function MFESkeleton() {
  return (
    <div className="mfe-skeleton">
      <div className="skeleton" style={{ height: '40px', width: '200px' }} />
      <div className="skeleton" style={{ height: '300px', marginTop: '20px' }} />
    </div>
  );
}
{% endraw %}

// app-shell/src/providers/AuthProvider.js
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  const login = async (credentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const { user, token } = await response.json();
    setUser(user);
    setToken(token);
    localStorage.setItem('authToken', token);
  };
  
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };
  
  // Restore session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${savedToken}` }
      })
        .then(r => r.json())
        .then(user => {
          setUser(user);
          setToken(savedToken);
        })
        .catch(() => logout());
    }
  }, []);
  
  const api = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user
  };
  
  return (
    <AuthContext.Provider value={api}>
      {children}
    </AuthContext.Provider>
  );
}

// dashboard-mfe/src/App.js (Micro-frontend consuming shell providers)
import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthContext } from 'app-shell/providers/AuthProvider'; // Provided by shell

function DashboardMFE() {
  const { user, logout } = useContext(AuthContext);
  
  return (
    <div className="dashboard-mfe">
      <h1>Dashboard for {user.name}</h1>
      <button onClick={logout}>Logout</button>
      
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </div>
  );
}

export default DashboardMFE;

// webpack.config.js (Module Federation for MFEs)
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'dashboard',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App'
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        'react-router-dom': { singleton: true }
      }
    })
  ]
};
```

## Common Mistakes

### 1. Not Caching Shell Assets Aggressively

❌ **Wrong**: Shell HTML/CSS/JS cached with short TTL or not cached at all.

```javascript
// Service Worker with weak caching
self.addEventListener('fetch', (event) => {
  // Always hits network, slow repeated loads
  event.respondWith(fetch(event.request));
});
```

✅ **Correct**: Cache shell assets permanently with versioned URLs.

```javascript
const CACHE_NAME = 'app-shell-v2'; // Version in cache name
const SHELL_ASSETS = [
  '/',
  '/app.a3f2e1.js', // Content hash in filename
  '/styles.4b8c9d.css'
];

self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Shell: cache-first (instant load)
  if (SHELL_ASSETS.some(asset => request.url.includes(asset))) {
    event.respondWith(
      caches.match(request).then(response => response || fetch(request))
    );
  }
});
```

**Why it matters**: The entire point of App Shell is instant loading from cache. Without aggressive caching, users download the same 50KB shell on every visit, defeating the performance benefit.

### 2. Hydration Mismatch Between Server and Client

❌ **Wrong**: Server renders different HTML than client re-renders.

```javascript
// Server renders timestamp
function Header() {
  return <div>Generated at: {new Date().toISOString()}</div>;
}
// Server: "2025-01-11T10:00:00Z"
// Client hydrates: "2025-01-11T10:00:05Z" (5 seconds later)
// MISMATCH! React throws hydration error
```

✅ **Correct**: Ensure deterministic rendering or use client-only rendering for dynamic values.

```javascript
import { useState, useEffect } from 'react';

function Header() {
  const [timestamp, setTimestamp] = useState(null);
  
  // Only set timestamp on client after hydration
  useEffect(() => {
    setTimestamp(new Date().toISOString());
  }, []);
  
  return (
    <div>
      Generated at: {timestamp || 'Loading...'}
    </div>
  );
}

// Server renders: "Generated at: Loading..."
// Client hydrates: matches! Then updates to actual timestamp
```

**Why it matters**: Hydration mismatches cause React to discard server-rendered HTML and re-render everything from scratch, wasting the SSR performance benefit and causing layout flicker.

### 3. Loading All Micro-Frontends Upfront

❌ **Wrong**: App Shell eagerly imports all MFEs, bloating initial bundle.

```javascript
// Importing all MFEs synchronously
import DashboardMFE from './mfe/dashboard';
import SettingsMFE from './mfe/settings';
import ReportsMFE from './mfe/reports';
import AdminMFE from './mfe/admin';

// Initial bundle: 800KB (shell + all MFEs)
```

✅ **Correct**: Lazy load MFEs on-demand when routes match.

```javascript
import { lazy, Suspense } from 'react';

// Lazy load MFEs
const DashboardMFE = lazy(() => import('./mfe/dashboard'));
const SettingsMFE = lazy(() => import('./mfe/settings'));
const ReportsMFE = lazy(() => import('./mfe/reports'));

function Shell() {
  return (
    <Suspense fallback={<MFESkeleton />}>
      <Routes>
        <Route path="/dashboard/*" element={<DashboardMFE />} />
        <Route path="/settings/*" element={<SettingsMFE />} />
        <Route path="/reports/*" element={<ReportsMFE />} />
      </Routes>
    </Suspense>
  );
}

// Initial bundle: 50KB (shell only)
// Dashboard loads on demand: +200KB
```

**Why it matters**: User navigating to `/dashboard` doesn't need Settings and Reports MFEs loaded. Lazy loading reduces initial bundle from 800KB to 50KB, achieving <1s load time on 3G.

## Quiz

### Question 1: App Shell vs Traditional MPA

**Q**: What are the key differences between an App Shell architecture and a traditional Multi-Page Application (MPA), and when would you choose each?

**A**:

**App Shell Architecture**:
- **Loading**: First visit downloads shell + content (~100KB), subsequent navigations load only data (~5KB JSON)
- **Caching**: Service Worker caches shell assets permanently, instant repeated loads
- **Performance**: Sub-200ms navigation after initial load (shell already parsed/ready)
- **Offline**: Shell works offline, shows cached UI even without network
- **SEO**: Requires SSR for initial crawl, client-side navigation after hydration

**Traditional MPA**:
- **Loading**: Every navigation requests full HTML document (~50KB) including redundant header/footer
- **Caching**: Browser HTTP caching, but still parses/renders HTML on each page
- **Performance**: 1-3s navigation (full page reload, parsing, rendering)
- **Offline**: Doesn't work offline unless heavily cached
- **SEO**: Each page fully server-rendered, excellent crawlability

**When to choose App Shell**:
- **Dashboard/SaaS applications** – Authenticated users navigate frequently between views (analytics dashboard, admin panel)
- **Mobile-first apps** – Targeting mobile users on slow networks where instant navigation critical
- **Offline-required** – Apps needing offline functionality (field service, travel apps)

**When to choose MPA**:
- **Content sites** – Blogs, news sites, documentation where SEO critical and navigation infrequent
- **E-commerce** – Product pages need server-rendered content for crawlers, shopping cart can be App Shell
- **Progressive enhancement** – Sites requiring no-JS fallback for accessibility

**Hybrid**: Many apps use both—MPA for marketing pages (SEO), App Shell for logged-in dashboard (performance).

### Question 2: Progressive Hydration

**Q**: Explain progressive hydration in the context of an App Shell. How does it improve Time-to-Interactive (TTI)?

**A**:

**Traditional Hydration Problem**:

Server renders full HTML (header, nav, content, footer). Client downloads 200KB JavaScript bundle, parses all modules, hydrates entire component tree at once—even off-screen footer and invisible modal dialogs. User waits 3-5 seconds before buttons become clickable.

**Progressive Hydration Solution**:

Prioritize hydrating visible, interactive components first, defer off-screen components until needed:

```javascript
// 1. Hydrate critical components immediately (above-fold)
hydrate(<Header />, headerEl); // 10KB, 50ms
hydrate(<Navigation />, navEl); // 15KB, 75ms
hydrate(<CTAButton />, ctaEl); // 5KB, 20ms

// User can interact with header/nav/CTA in ~150ms!

// 2. Defer less critical components
requestIdleCallback(() => {
  hydrate(<SidebarWidget />, sidebarEl); // 30KB, 150ms
});

// 3. Lazy hydrate off-screen components on scroll
observer.observe(footerEl, {
  onVisible: () => hydrate(<Footer />, footerEl) // 20KB
});

// 4. Never hydrate until interaction
commentSection.addEventListener('click', () => {
  hydrate(<Comments />, commentSection); // 80KB only when user clicks
}, { once: true });
```

**Benefits**:
- **Faster TTI**: 150ms (critical components only) vs 5s (everything)
- **Reduced JavaScript**: Only hydrate visible components, save mobile data
- **Better UX**: User can interact with above-fold content while rest loads

**Implementation Strategies**:

1. **React 18 Server Components**: Only hydrate client components, server components stay static
2. **Next.js Partial Hydration**: Mark components with `"use client"` directive for selective hydration
3. **Astro Islands**: Framework-agnostic islands of interactivity in static ocean
4. **Custom Implementation**: Use Intersection Observer + dynamic import

**Tradeoffs**: More complex than full hydration, requires careful planning of interaction boundaries, potential for layout shift if deferred components alter layout.

### Question 3: Providers in Micro-Frontend App Shell

**Q**: How does the App Shell provide shared services (auth, theme, i18n) to multiple micro-frontends without tight coupling? Compare Context API vs Custom Events approaches.

**A**:

**Context API Approach** (React/Preact):

{% raw %}
```javascript
// App Shell provides context
<AuthContext.Provider value={{ user, login, logout }}>
  <ThemeContext.Provider value={{ theme, setTheme }}>
    <DashboardMFE />
    <SettingsMFE />
  </ThemeContext.Provider>
</AuthContext.Provider>

// Micro-frontends consume context
function DashboardMFE() {
  const { user } = useContext(AuthContext); // From shell
  const { theme } = useContext(ThemeContext);
  return <div className={`theme-${theme}`}>Hello {user.name}</div>;
}
```
{% endraw %}

**Pros**: (1) Type-safe with TypeScript, (2) Reactive updates (context changes trigger re-render), (3) Standard React pattern, (4) Easy testing (mock providers).

**Cons**: (1) Framework lock-in (requires React), (2) MFEs must import shell's context definitions (coupling), (3) Context updates re-render entire tree if not optimized.

---

**Custom Events Approach** (Framework-agnostic):

```javascript
// App Shell publishes events
window.dispatchEvent(new CustomEvent('shell:auth', {
  detail: { user, isAuthenticated: true }
}));

window.dispatchEvent(new CustomEvent('shell:theme', {
  detail: { theme: 'dark' }
}));

// Micro-frontends subscribe to events
class DashboardMFE {
  constructor() {
    window.addEventListener('shell:auth', (e) => {
      this.user = e.detail.user;
      this.render();
    });
    
    window.addEventListener('shell:theme', (e) => {
      this.theme = e.detail.theme;
      this.updateTheme();
    });
  }
}
```

**Pros**: (1) Framework-agnostic (React, Vue, Angular, Web Components all work), (2) Loose coupling (no imports needed), (3) MFEs can be written in different frameworks.

**Cons**: (1) No type safety (events are strings), (2) Manual state management (no reactive updates), (3) More boilerplate, (4) Debugging harder (event bus complexity).

---

**Hybrid Approach** (Best of both):

```javascript
// App Shell provides both Context and Events
function Shell() {
  const auth = useAuth();
  
  // Publish auth changes as events for non-React MFEs
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('shell:auth', {
      detail: auth
    }));
  }, [auth]);
  
  return (
    <AuthContext.Provider value={auth}>
      {/* React MFEs use context */}
      <ReactMFE />
      
      {/* Non-React MFEs use events */}
      <web-component-mfe></web-component-mfe>
    </AuthContext.Provider>
  );
}
```

**Recommendation**: Use **Context API** if all MFEs use same framework (React). Use **Custom Events** for polyglot micro-frontends (mixing React, Vue, Web Components). Use **Hybrid** for mixed environments (most MFEs React, one legacy jQuery widget).

## References

- [App Shell Model - Google Developers](https://developers.google.com/web/fundamentals/architecture/app-shell)
- [Service Worker API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Progressive Hydration - Patterns.dev](https://www.patterns.dev/posts/progressive-hydration/)
- [React 18 Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
- [Module Federation - Webpack](https://webpack.js.org/concepts/module-federation/)
- [Critical Rendering Path - Web.dev](https://web.dev/critical-rendering-path/)
