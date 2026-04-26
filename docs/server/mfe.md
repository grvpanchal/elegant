---
title: Micro Frontend
layout: doc
slug: mfe
---

# Micro Frontend

> - Independently deployable, framework-agnostic UI modules
> - Enables autonomous team deployments at scale
> - Extends microservices architecture to the UI layer

## Key Insight

Micro-frontends extend microservices architecture to the UI layer, decomposing monolithic frontends into independently deployable, framework-agnostic modules that communicate through well-defined contracts. This enables large-scale teams to ship features autonomously without coordinating releases, at the cost of increased orchestration complexity. The challenge lies in choosing the right integration strategy—Module Federation for zero-duplication shared dependencies, Web Components for framework-agnostic boundaries, or iframes for maximum isolation—while maintaining consistent UX, shared authentication, and performant bundle sizes. Success hinges on strict governance: versioned contracts prevent breakage, centralized design systems ensure consistency, and performance budgets (e.g., <200KB per MFE) prevent the tragedy of the commons where each team optimizes locally but degrades global load times.

## Detailed Description

### 1. Architectural Philosophy

Micro-frontends apply Conway's Law deliberately: team boundaries align with code boundaries. Instead of a single 500,000-line React monolith requiring synchronized deployments across 10 teams, you split into bounded contexts (e.g., ProductCatalog, Checkout, UserProfile MFEs). Each MFE owns its domain end-to-end—UI components, state management, API integration, even E2E tests—deployed independently via CI/CD to versioned URLs (`/mfe/checkout@v2.3.1/remoteEntry.js`). The App Shell orchestrates MFEs using dynamic imports: `const Checkout = lazy(() => import('checkout/Cart'))`. When Team A deploys Checkout v2.3.1, only Checkout users download new code; ProductCatalog stays on v1.8.0 until Team B deploys. This decouples release schedules but introduces distributed system problems: version skew (Shell on v1, Checkout on v2), runtime errors from mismatched contracts, and "works on my machine" failures when MFEs integrate.

The fundamental trade-off: autonomy vs. coherence. High autonomy (full tech stack freedom) risks fragmented UX and bloated bundles (5 MFEs each loading React = 500KB duplication). High coherence (mandated framework, shared UI library) reduces autonomy but achieves 50KB shared vendor bundle. Governance mechanisms—architecture decision records (ADRs), performance budgets, integration tests—balance this tension.

### 2. Integration Patterns

**Module Federation (Webpack 5+ / Rspack)**:

Shared runtime model where MFEs expose ES modules via `remoteEntry.js` manifests. Shell imports MFEs as dynamic imports: `import('mfe1/Component')` fetches over HTTP at runtime, resolves shared dependencies (React, React-DOM) using singleton pattern. If Shell uses React 18.2.0 and MFE1 specifies `react: { singleton: true, requiredVersion: '^18.0.0' }`, both share one React instance (50KB saved). If versions conflict (Shell 18.2.0, MFE2 needs 17.0.0), two React instances load (200KB total).

**Benefits**: Zero-duplication for compatible semver ranges, type-safe imports (TypeScript support via `@module-federation/typescript`), lazy loading with code splitting. **Drawbacks**: Requires Webpack/Rspack (framework lock-in), runtime version negotiation complexity, network waterfalls (Shell → remoteEntry.js → chunk-vendor.js → chunk-app.js).

**Web Components**:

Framework-agnostic Custom Elements (`<product-catalog sku="12345"></product-catalog>`) encapsulated via Shadow DOM. Each MFE publishes a Web Component bundle (`catalog.min.js`), Shell loads via `<script src="...">`. Communication via Custom Events (`dispatchEvent(new CustomEvent('cart:add', { detail: { sku } }))`) or properties (`catalogEl.user = { id: 123 }`).

**Benefits**: True framework independence (React MFE, Vue Shell, Angular MFE), browser-native isolation, progressive enhancement. **Drawbacks**: Shadow DOM CSS encapsulation breaks global styles (need CSS custom properties for theming), event bubbling only works with `composed: true`, polyfills needed for Safari <14, larger bundle sizes (each MFE ships framework runtime).

**Iframes**:

Maximum isolation—each MFE runs in separate browsing context. Shell embeds `<iframe src="/mfe/checkout">`, communicates via `postMessage`. Authentication passed via URL token or postMessage after load.

**Benefits**: Complete isolation (CSS, JavaScript, global variables), multi-origin support, legacy code integration. **Drawbacks**: Poor SEO (iframes not crawled), accessibility issues (screen readers struggle), cross-origin restrictions, heavyweight (each iframe = full document + styles), poor UX (scrolling, focus management).

**Import Maps (ESM CDN)**:

Native ES module resolution via `<script type="importmap">` mapping logical names to CDN URLs. Shell declares `{ "react": "https://esm.sh/react@18" }`, MFEs import `from 'react'`, browser fetches from CDN.

**Benefits**: No build-time bundling, HTTP/2 multiplexing, browser-native, shared CDN cache. **Drawbacks**: Cutting-edge (limited IE11/old browser support), no code splitting by default, CDN dependency for runtime resolution.

### 3. Communication Strategies

**Event Bus Pattern**:

```javascript
// Shared event bus singleton
window.MFEBus = {
  subscribers: {},
  publish(event, data) {
    this.subscribers[event]?.forEach(fn => fn(data));
  },
  subscribe(event, fn) {
    this.subscribers[event] = this.subscribers[event] || [];
    this.subscribers[event].push(fn);
  }
};

// MFE1: Publish cart update
MFEBus.publish('cart:updated', { items: 3 });

// MFE2: Subscribe to cart updates
MFEBus.subscribe('cart:updated', (data) => {
  updateCartBadge(data.items);
});
```

**Benefits**: Decoupled, framework-agnostic, pub-sub pattern. **Drawbacks**: No type safety, debugging hard (who publishes what?), memory leaks if unsubscribe forgotten.

**Shared State (Redux, Zustand)**:

Shell provides Redux store, MFEs dispatch actions:

```javascript
// Shell creates store
const store = createStore(rootReducer);
window.SHARED_STORE = store;

// MFE dispatches action
window.SHARED_STORE.dispatch({ type: 'ADD_TO_CART', sku: '123' });
```

**Benefits**: Centralized state, time-travel debugging, predictable. **Drawbacks**: Framework coupling (requires Redux), tight coupling to state shape, version skew if MFEs expect different schemas.

**Props / Callback Pattern (Module Federation)**:

Shell passes props to MFE components:

```jsx
const Checkout = lazy(() => import('checkout/Cart'));
<Checkout user={user} onComplete={handleCheckout} />
```

**Benefits**: Type-safe, React-native, explicit contracts. **Drawbacks**: Only works with shared framework (React), tight coupling if props change frequently.

### 4. Versioning and Deployment

**Semantic Versioning**: MFEs publish `v1.2.3` following semver. Shell specifies `checkout@^1.0.0` (accepts 1.2.3, rejects 2.0.0). Breaking changes increment major version, triggering Shell update.

**Blue-Green Deployments**: Deploy Checkout v2 to `/mfe/checkout-v2/`, test with Shell staging, flip traffic via config: `{ "checkout": { "url": "/mfe/checkout-v2/" } }`. Rollback = revert config.

**Canary Releases**: Route 10% traffic to Checkout v2.1.0, monitor errors, ramp to 100%. Requires feature flags or A/B testing infrastructure.

**Independent vs. Synchronized**: Independent = each MFE deploys anytime (risk: breaking contract changes). Synchronized = all MFEs deploy together (defeats autonomy). Middle ground: contract testing (Pact, GraphQL schema validation) ensures backward compatibility.

### 5. Authentication and Authorization

**Shared Auth Token (Cookie/LocalStorage)**:

Shell authenticates user, stores JWT in httpOnly cookie. MFEs read cookie for API calls. Cookie shared across same-origin MFEs (`/mfe/checkout`, `/mfe/profile`).

**SSO / OAuth Flow**:

Shell handles OAuth redirect, obtains token, broadcasts to MFEs via postMessage or shared state. MFEs use token for backend requests.

**Role-Based Access Control (RBAC)**:

Shell fetches user permissions (`{ canViewReports: true }`), passes to MFEs as props. MFEs conditionally render features:

```jsx
{user.canViewReports && <ReportsLink />}
```

**Challenges**: Token refresh coordination (if Shell refreshes token, MFEs must use new token), logout propagation (one MFE logs out, all must clear state), cross-origin iframes (need postMessage for token passing).

### 6. Performance Optimization

**Shared Vendor Bundle**:

Shell loads React/React-DOM once (50KB gzipped), MFEs consume via Module Federation singletons. Saves 50KB per MFE.

**Code Splitting**:

MFEs lazy-load routes: `const ReportPage = lazy(() => import('./Report'))`. Only users visiting `/reports` download 120KB Report bundle.

**Preloading**:

Shell preloads likely-next MFE: `<link rel="prefetch" href="/mfe/checkout/remoteEntry.js">` when user adds item to cart.

**Bundle Analysis**:

Run Webpack Bundle Analyzer per MFE. Identify duplicate lodash (30KB in MFE1, 30KB in MFE2), move to shared dependencies.

**Performance Budget**:

Enforce <200KB per MFE (gzipped). CI fails if budget exceeded. Prevents gradual bloat.

**Critical CSS**:

Inline above-fold styles in Shell (<5KB), defer MFE-specific CSS via `<link rel="stylesheet" media="print" onload="this.media='all'">`.

### 7. Testing Strategy

**Unit Tests**: Each MFE tests components in isolation (Jest, React Testing Library). Mock shared dependencies (auth, event bus).

**Integration Tests**: Shell + MFE integration tested via Cypress/Playwright. Load Shell, verify MFE renders, test cross-MFE workflows (add to cart → checkout).

**Contract Testing**: Use Pact to define MFE API contracts. MFE1 publishes contract (`POST /api/cart expects { sku: string }`), backend verifies. Prevents breaking changes.

**Visual Regression**: Percy/Chromatic screenshots. Detect unintended CSS changes when Shell updates global styles.

**End-to-End**: Full user flows (login → browse → checkout) tested in production-like environment. Catches integration bugs (CORS, authentication).

### 8. Governance and Standards

**Shared Design System**:

Centralized UI component library (e.g., `@company/ui-kit`) consumed by all MFEs. Ensures consistent buttons, inputs, colors. Versioned (`v2.5.0`) to allow gradual upgrades.

**Performance Budget**:

Document states: "Each MFE <200KB, Shell <50KB, total FCP <1.5s on 3G." Lighthouse CI enforces in PR checks.

**Architecture Decision Records (ADRs)**:

Team decides Module Federation vs Web Components, documents rationale in ADR-005.md. Future teams reference ADR when choosing integration pattern.

**Code Ownership (CODEOWNERS)**:

`/mfe/checkout` owned by @checkout-team, auto-assigned PRs. Prevents unauthorized changes.

**API Contracts (OpenAPI/GraphQL)**:

Backend APIs documented via Swagger. MFEs generate TypeScript types from schema, breaking changes caught at compile time.

### 9. Developer Experience

**Local Development**:

Shell runs on `localhost:3000`, MFEs on `localhost:3001`, `localhost:3002`. Module Federation dev server proxies MFE requests. Hot reload works per-MFE.

**Mocking MFEs**:

Shell can mock unavailable MFEs: `if (env === 'dev') import('./mocks/CheckoutMock')` instead of loading remote. Unblocks Shell development when Checkout team deploys broken version.

**Shared Tooling**:

Centralized ESLint config (`@company/eslint-config`), Prettier, TypeScript config. Reduces setup friction, enforces consistency.

**Documentation**:

Living style guide (Storybook) shows all MFE components. README per MFE explains local setup, API contracts, deployment process.

## Code Examples

### Example 1: Basic Module Federation Setup (Webpack 5)

```javascript
// Shell: webpack.config.js
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        checkout: 'checkout@http://localhost:3001/remoteEntry.js',
        catalog: 'catalog@http://localhost:3002/remoteEntry.js'
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' }
      }
    })
  ]
};

// Shell: src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Checkout = lazy(() => import('checkout/Cart'));
const Catalog = lazy(() => import('catalog/ProductList'));

function App() {
  return (
    <BrowserRouter>
      <header>
        <h1>E-Commerce Platform</h1>
        <nav>
          <a href="/catalog">Products</a>
          <a href="/checkout">Cart</a>
        </nav>
      </header>
      
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  );
}

export default App;

// Checkout MFE: webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'checkout',
      filename: 'remoteEntry.js',
      exposes: {
        './Cart': './src/Cart' // Expose Cart component
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true }
      }
    })
  ]
};

// Checkout MFE: src/Cart.js
import React, { useState, useEffect } from 'react';

export default function Cart() {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    fetch('/api/cart')
      .then(r => r.json())
      .then(setItems);
  }, []);
  
  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item.id}>
              {item.name} - ${item.price}
            </li>
          ))}
        </ul>
      )}
      <button>Checkout</button>
    </div>
  );
}

// Catalog MFE: webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'catalog',
      filename: 'remoteEntry.js',
      exposes: {
        './ProductList': './src/ProductList'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true }
      }
    })
  ]
};

// Catalog MFE: src/ProductList.js
import React, { useState, useEffect } from 'react';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(setProducts);
  }, []);
  
  const addToCart = (productId) => {
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    });
    
    // Notify other MFEs via event bus
    window.dispatchEvent(new CustomEvent('cart:updated'));
  };
  
  return (
    <div className="product-list">
      <h2>Products</h2>
      <div className="grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button onClick={() => addToCart(product.id)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Example 2: Web Components with Framework-Agnostic Integration

{% raw %}
```javascript
// Checkout MFE: Built with React, exported as Web Component
// checkout-mfe/src/CheckoutComponent.js
import React from 'react';
import ReactDOM from 'react-dom/client';

class CheckoutWebComponent extends HTMLElement {
  connectedCallback() {
    // Create React root
    const root = ReactDOM.createRoot(this);
    
    // Parse attributes as props
    const userId = this.getAttribute('user-id');
    
    // Render React component
    root.render(<CheckoutApp userId={userId} />);
    
    // Listen for property changes
    this._observer = new MutationObserver(() => {
      root.render(<CheckoutApp userId={this.getAttribute('user-id')} />);
    });
    this._observer.observe(this, { attributes: true });
  }
  
  disconnectedCallback() {
    this._observer?.disconnect();
  }
}

customElements.define('checkout-widget', CheckoutWebComponent);

function CheckoutApp({ userId }) {
  const [cart, setCart] = React.useState([]);
  
  React.useEffect(() => {
    fetch(`/api/cart?userId=${userId}`)
      .then(r => r.json())
      .then(setCart);
  }, [userId]);
  
  const handleCheckout = () => {
    // Dispatch custom event for cross-MFE communication
    this.dispatchEvent(new CustomEvent('checkout:complete', {
      bubbles: true,
      composed: true, // Escape Shadow DOM
      detail: { orderId: '12345', total: 99.99 }
    }));
  };
  
  return (
    <div>
      <h2>Checkout</h2>
      <ul>
        {cart.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
      <button onClick={handleCheckout}>Complete Order</button>
    </div>
  );
}

// Catalog MFE: Built with Vue, exported as Web Component
// catalog-mfe/src/CatalogComponent.js
import { createApp } from 'vue';
import CatalogApp from './CatalogApp.vue';

class CatalogWebComponent extends HTMLElement {
  connectedCallback() {
    const app = createApp(CatalogApp, {
      category: this.getAttribute('category')
    });
    
    app.mount(this);
  }
}

customElements.define('catalog-widget', CatalogWebComponent);

// catalog-mfe/src/CatalogApp.vue
<template>
  <div class="catalog">
    <h2>Products</h2>
    <div v-for="product in products" :key="product.id">
      <h3>{{ product.name }}</h3>
      <button @click="addToCart(product)">Add to Cart</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['category'],
  data() {
    return { products: [] };
  },
  mounted() {
    fetch(`/api/products?category=${this.category}`)
      .then(r => r.json())
      .then(data => this.products = data);
  },
  methods: {
    addToCart(product) {
      // Emit event for other MFEs
      this.$el.dispatchEvent(new CustomEvent('cart:add', {
        bubbles: true,
        composed: true,
        detail: { productId: product.id }
      }));
    }
  }
};
</script>

// Shell: index.html (Framework-agnostic)
<!DOCTYPE html>
<html>
<head>
  <title>Micro-Frontend App</title>
  <script src="https://cdn.example.com/checkout-mfe.js"></script>
  <script src="https://cdn.example.com/catalog-mfe.js"></script>
</head>
<body>
  <header>
    <h1>E-Commerce</h1>
  </header>
  
  <main>
    <!-- Vue-based catalog -->
    <catalog-widget category="electronics"></catalog-widget>
    
    <!-- React-based checkout -->
    <checkout-widget user-id="123"></checkout-widget>
  </main>
  
  <script>
    // Listen for cross-MFE events
    document.addEventListener('cart:add', (e) => {
      console.log('Product added:', e.detail.productId);
      updateCartBadge();
    });
    
    document.addEventListener('checkout:complete', (e) => {
      console.log('Order complete:', e.detail.orderId);
      showThankYouPage();
    });
  </script>
</body>
</html>
```
{% endraw %}

### Example 3: Advanced Module Federation with Shared State and Authentication

{% raw %}
```javascript
// Shell: webpack.config.js
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        dashboard: 'dashboard@https://dashboard.example.com/remoteEntry.js',
        settings: 'settings@https://settings.example.com/remoteEntry.js'
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0', eager: true },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0', eager: true },
        'react-router-dom': { singleton: true },
        '@company/auth': { singleton: true, eager: true }, // Shared auth lib
        '@company/ui-kit': { singleton: true } // Shared components
      }
    })
  ]
};

// Shell: src/AuthProvider.js (Shared authentication)
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${savedToken}` }
      })
        .then(r => r.json())
        .then(userData => {
          setUser(userData);
          setToken(savedToken);
        })
        .catch(() => {
          localStorage.removeItem('authToken');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);
  
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
    
    // Broadcast login event to other MFEs
    window.dispatchEvent(new CustomEvent('auth:login', { detail: { user } }));
  };
  
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    
    // Broadcast logout event
    window.dispatchEvent(new CustomEvent('auth:logout'));
  };
  
  // Provide API client with token
  const apiClient = {
    get: (url) => fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),
    post: (url, data) => fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  };
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout, apiClient, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
```
{% endraw %}

{% raw %}
```javascript
// Shell: src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthProvider';

const Dashboard = lazy(() => import('dashboard/DashboardApp'));
const Settings = lazy(() => import('settings/SettingsApp'));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/dashboard/*" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/settings/*" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Suspense>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = React.useContext(AuthContext);
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  
  return children;
}

function AppLayout({ children }) {
  const { user, logout } = React.useContext(AuthContext);
  
  return (
    <div className="app-layout">
      <header>
        <h1>Enterprise Dashboard</h1>
        {user && (
          <div>
            <span>Welcome, {user.name}</span>
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
}

// Dashboard MFE: webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'dashboard',
      filename: 'remoteEntry.js',
      exposes: {
        './DashboardApp': './src/DashboardApp'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        '@company/auth': { singleton: true }, // Consume shared auth
        '@company/ui-kit': { singleton: true }
      }
    })
  ]
};

// Dashboard MFE: src/DashboardApp.js
import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from '@company/auth'; // Provided by Shell
import { Button, Card } from '@company/ui-kit'; // Shared UI components

function DashboardApp() {
  const { user, apiClient } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    apiClient.get('/api/dashboard/stats')
      .then(r => r.json())
      .then(setStats);
  }, [apiClient]);
  
  return (
    <div className="dashboard">
      <h2>Dashboard for {user.name}</h2>
      
      <Routes>
        <Route path="/" element={<Overview stats={stats} />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </div>
  );
}

function Overview({ stats }) {
  if (!stats) return <div>Loading stats...</div>;
  
  return (
    <div className="overview">
      <Card>
        <h3>Total Users</h3>
        <p>{stats.users}</p>
      </Card>
      <Card>
        <h3>Revenue</h3>
        <p>${stats.revenue}</p>
      </Card>
      <Button>View Details</Button>
    </div>
  );
}

export default DashboardApp;

// Settings MFE: src/SettingsApp.js
import React, { useContext, useState } from 'react';
import { AuthContext } from '@company/auth';

function SettingsApp() {
  const { user, apiClient } = useContext(AuthContext);
  const [preferences, setPreferences] = useState({
    theme: 'light',
    notifications: true
  });
  
  const savePreferences = async () => {
    await apiClient.post('/api/settings', preferences);
    alert('Settings saved!');
  };
  
  return (
    <div className="settings">
      <h2>Settings for {user.name}</h2>
      
      <label>
        Theme:
        <select
          value={preferences.theme}
          onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      
      <label>
        <input
          type="checkbox"
          checked={preferences.notifications}
          onChange={(e) => setPreferences({ ...preferences, notifications: e.target.checked })}
        />
        Enable Notifications
      </label>
      
      <button onClick={savePreferences}>Save</button>
    </div>
  );
}

export default SettingsApp;
```
{% endraw %}

## Common Mistakes

### 1. Duplicating Shared Dependencies Across MFEs

❌ **Wrong**: Each MFE bundles React, lodash, moment—5 MFEs × 150KB = 750KB duplication.

```javascript
// Dashboard MFE: webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'dashboard',
      exposes: { './App': './src/App' },
      shared: {} // No shared dependencies! Each MFE bundles React
    })
  ]
};

// Result: Shell loads React (150KB), Dashboard loads React (150KB), Settings loads React (150KB) = 450KB total
```

✅ **Correct**: Use Module Federation `shared` with `singleton: true` to share dependencies.

```javascript
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'dashboard',
      exposes: { './App': './src/App' },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        lodash: { singleton: true }
      }
    })
  ]
};

// Result: Shell loads React once (150KB), all MFEs share = 150KB total (600KB saved)
```

**Why it matters**: A 5-MFE app without shared dependencies downloads 750KB of duplicate React/vendor code. Users on 3G wait 10+ seconds. Shared dependencies reduce this to 150KB, achieving <2s load time.

### 2. No Versioning or Contract Testing Between MFEs

❌ **Wrong**: Dashboard MFE expects `user.email`, Shell changes to `user.emailAddress`—runtime crash.

{% raw %}
```javascript
// Shell v2.0: Changed user schema
<Dashboard user={{ id: 123, emailAddress: 'user@example.com' }} />

// Dashboard MFE: Still expects old schema
function Dashboard({ user }) {
  return <div>Email: {user.email}</div>; // CRASH: user.email is undefined
}
```
{% endraw %}

✅ **Correct**: Use semantic versioning + contract testing to catch breaking changes.

```javascript
// contracts/user.contract.json (Pact-style contract)
{
  "consumer": "Dashboard MFE",
  "provider": "Shell",
  "interactions": [
    {
      "description": "User object",
      "request": { "path": "/user" },
      "response": {
        "status": 200,
        "body": {
          "id": 123,
          "email": "user@example.com" // Contract specifies `email` field
        }
      }
    }
  ]
}

// Shell CI pipeline runs contract test
npm run test:contracts
// FAIL: Shell returns `emailAddress`, contract expects `email`. Breaking change detected!
```

**Alternative: TypeScript Shared Types**:

```typescript
// @company/contracts package
export interface User {
  id: number;
  email: string; // v1.0.0
}

// Shell v2.0 changes to emailAddress
export interface User {
  id: number;
  emailAddress: string; // v2.0.0 (BREAKING)
}

// Dashboard MFE pins contracts v1.0.0 in package.json
// "dependencies": { "@company/contracts": "1.0.0" }
import { User } from '@company/contracts';

// TypeScript compiler catches mismatch:
// Error: Type '{ emailAddress: string }' is not assignable to type '{ email: string }'
```

**Why it matters**: Without versioning, a Shell deployment breaks all MFEs silently. Users see blank screens, error logs flood Sentry. Contract tests catch breaking changes in CI before deployment, preventing production outages.

### 3. MFEs Tightly Coupled to Shell Implementation

❌ **Wrong**: MFE directly imports Shell's Redux store, breaks when Shell migrates to Zustand.

```javascript
// Dashboard MFE: Directly imports Shell's store
import { store } from 'shell/store'; // Tight coupling!

function Dashboard() {
  const state = store.getState();
  const dispatch = store.dispatch;
  
  return <div>User: {state.user.name}</div>;
}

// Shell v2.0 migrates from Redux to Zustand
// Dashboard MFE crashes: `store` is now Zustand, no `.dispatch()` method
```

✅ **Correct**: MFEs consume abstractions (Context, props, events), not Shell internals.

{% raw %}
```javascript
// Shell provides AuthContext (abstraction layer)
<AuthContext.Provider value={{ user, login, logout }}>
  <Dashboard />
</AuthContext.Provider>

// Dashboard MFE consumes context (decoupled)
function Dashboard() {
  const { user } = useContext(AuthContext);
  return <div>User: {user.name}</div>;
}

// Shell migrates from Redux to Zustand internally—Dashboard unaffected
// AuthContext still provides same API ({ user, login, logout })
```
{% endraw %}

**Why it matters**: Tight coupling forces synchronized deployments. If Shell changes Redux to Zustand, all 10 MFEs must update simultaneously—defeating micro-frontend autonomy. Abstractions (Context API, event bus, versioned APIs) enable independent evolution.

## Quick Quiz

{% include quiz.html id="mfe-1"
   question="Compare Module Federation and Web Components for integrating micro-frontends. When would you pick each?"
   options="A|They are identical;;B|Module Federation (Webpack/Rspack) dynamically loads ESM at runtime and shares dependencies (React, lodash) as singletons to avoid duplication — best for teams on the same framework version aligned on shared deps. Web Components wrap each MFE as a custom element with its own internal stack — best for framework-heterogeneous teams that need strict isolation at the cost of some bundle duplication;;C|Web Components are deprecated;;D|Only Module Federation works in production"
   correct="B"
   explanation="Module Federation optimises for sharing (less duplication, tighter coupling on deps). Web Components optimise for isolation (more duplication, looser coupling). Pick based on org structure and framework diversity." %}

{% include quiz.html id="mfe-2"
   question="How should authentication be handled across multiple micro-frontends?"
   options="A|Auth can't be shared;;B|Use cookies only and hope;;C|Hoist auth to the shell — shell owns sign-in, token storage (httpOnly refresh cookie + in-memory access token), and exposes an auth context / event bus to MFEs. MFEs read the current user and react to logout broadcasts, but don't duplicate the login flow. Refresh and rotation happen once, centrally;;D|Each MFE ships its own login form and token storage"
   correct="C"
   explanation="Centralising auth prevents inconsistent sessions (logged in here, out there), coordinates token refresh, and keeps the single-sign-on UX coherent across MFEs." %}

{% include quiz.html id="mfe-3"
   question="How do you prevent MFE bundle bloat from killing performance?"
   options="A|Only use Web Components;;B|Ship every MFE at once regardless of route;;C|Set per-MFE performance budgets; deduplicate shared deps via Module Federation singletons or import maps; lazy-load MFEs on route entry; preload the next likely MFE on hover/idle; audit with tools like bundlewatch / webpack-bundle-analyzer per MFE; treat an MFE's bundle size as a cross-team contract;;D|Budgets don't matter"
   correct="C"
   explanation="Without per-MFE budgets and shared-dep deduplication, every MFE ships its own React + its own utils — bundle cost scales linearly with MFE count. Lazy loading + preloading + dedup keeps cost sub-linear." %}

## References

- [Micro Frontends - Martin Fowler](https://martinfowler.com/articles/micro-frontends.html)
- [Module Federation - Webpack](https://webpack.js.org/concepts/module-federation/)
- [Web Components - MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Single-SPA Framework](https://single-spa.js.org/)
- [Import Maps Specification](https://github.com/WICG/import-maps)
- [Pact Contract Testing](https://docs.pact.io/)
- [Micro Frontends: An Introduction](https://micro-frontends.org/)
- [Import Maps: Next Evolution for MFEs](https://www.angulararchitects.io/en/blog/import-maps-the-next-evolution-step-for-micro-frontends-article/)
