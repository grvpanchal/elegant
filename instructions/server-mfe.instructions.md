---
description: Guidance for Micro Frontends - independently deployable UI modules
name: MFE - Server
applyTo: |
  **/mfe/**/*.{jsx,tsx,js,ts}
  **/remote/**/*.{js,ts}
  **/shell/**/*.{js,ts}
---

# Micro Frontend Instructions

## What are Micro Frontends?

Micro frontends extend microservices to the UI—independently deployable, framework-agnostic modules (ProductCatalog, Checkout, UserProfile) that communicate through well-defined contracts. Enables team autonomy at scale.

## Key Principles

1. **Independent Deployment**: Each MFE deploys separately. Team A ships Checkout v2.3 without waiting for Team B's ProductCatalog release.

2. **Bounded Contexts**: MFE boundaries align with team/domain boundaries. Each MFE owns its UI, state, and API integration end-to-end.

3. **Shared Dependencies**: Use Module Federation or import maps to share React/Vue across MFEs, avoiding 5x bundle duplication.

## Best Practices

✅ **DO**:
- Define clear MFE boundaries by domain
- Use Module Federation for shared dependencies
- Version MFE contracts (props interface)
- Implement centralized design system
- Set performance budgets per MFE (<200KB)

❌ **DON'T**:
- Create too many tiny MFEs (overhead)
- Allow framework proliferation without governance
- Skip contract versioning (breaks integration)
- Ignore global load time (sum of all MFEs)
- Forget shared auth/routing strategy

## Code Patterns

### Module Federation Setup

```javascript
// Shell webpack.config.js
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

// MFE webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'checkout',
      filename: 'remoteEntry.js',
      exposes: {
        './Cart': './src/Cart',
        './Checkout': './src/Checkout'
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' }
      }
    })
  ]
};
```

### Shell Loading MFEs

```jsx
// Shell/App.jsx
import { lazy, Suspense } from 'react';

const CheckoutCart = lazy(() => import('checkout/Cart'));
const ProductCatalog = lazy(() => import('catalog/ProductGrid'));

function App() {
  return (
    <div className="shell">
      <Header /> {/* Shell-owned */}
      
      <Suspense fallback={<Skeleton />}>
        <Routes>
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/cart" element={<CheckoutCart />} />
        </Routes>
      </Suspense>
      
      <Footer /> {/* Shell-owned */}
    </div>
  );
}
```

### Event Bus Communication

```javascript
// Shared event bus for MFE communication
window.MFEBus = {
  subscribers: {},
  
  publish(event, data) {
    this.subscribers[event]?.forEach(fn => fn(data));
  },
  
  subscribe(event, fn) {
    this.subscribers[event] = this.subscribers[event] || [];
    this.subscribers[event].push(fn);
    return () => this.unsubscribe(event, fn);
  },
  
  unsubscribe(event, fn) {
    this.subscribers[event] = this.subscribers[event]?.filter(f => f !== fn);
  }
};

// MFE1: Publish event
MFEBus.publish('cart:item-added', { sku: '123', qty: 1 });

// MFE2: Subscribe to event
useEffect(() => {
  const unsubscribe = MFEBus.subscribe('cart:item-added', updateCartBadge);
  return unsubscribe;
}, []);
```

## Integration Strategies

| Strategy | Shared Deps | Isolation | Complexity |
|----------|-------------|-----------|------------|
| Module Federation | ✅ Excellent | Medium | Medium |
| Web Components | ⚠️ Manual | High | High |
| Iframes | ❌ None | Maximum | Low |
| Import Maps | ✅ CDN-based | Medium | Low |

## Related Terminologies

- **App Shell** (Server) - Shell orchestrates MFEs
- **Router** (Server) - Routes to MFE components
- **Store** (State) - Shared vs isolated state
- **Component** (UI) - MFEs expose components

## Quality Gates

- [ ] Clear domain boundaries
- [ ] Shared dependencies configured
- [ ] Contracts versioned
- [ ] Performance budget per MFE
- [ ] Communication pattern defined
- [ ] Design system shared

**Source**: `/docs/server/mfe.md`
