---
description: Guidance for Router - client-side navigation without page reloads
name: Router - Server
applyTo: |
  **/routes/**/*.{jsx,tsx,js,ts}
  **/*Router*.{jsx,tsx}
  **/*routes*.{js,ts}
---

# Router Instructions

## What is a Router?

Client-side routers enable SPA navigation without page reloads by intercepting link clicks, updating URLs via History API, and rendering matching components. This creates app-like experiences with preserved state.

## Key Principles

1. **Intercept, Don't Reload**: Router prevents default link behavior, updates URL with `history.pushState()`, and renders new component—no server request.

2. **Route Configuration**: Declaratively map URL patterns to components. Dynamic segments (`:id`) extract parameters.

3. **Preserve Application State**: Unlike page reloads, navigation keeps Redux store, React state, and JavaScript context intact.

## Best Practices

✅ **DO**:
- Use declarative route configuration
- Implement lazy loading for route components
- Handle protected routes with guards
- Manage focus for accessibility on navigation
- Use `Link` component instead of `<a>` for internal links

❌ **DON'T**:
- Use `<a>` tags for internal navigation (causes reload)
- Forget scroll restoration on navigation
- Ignore loading states during lazy load
- Skip 404 handling (catch-all route)
- Neglect accessibility (announce route changes)

## Code Patterns

### Basic Route Configuration

```jsx
// React Router setup
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Dynamic Parameters

```jsx
// pages/products/[id].jsx
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();  // Extract :id from URL
  const navigate = useNavigate();
  
  const handleBack = () => navigate(-1);  // Go back
  const handleHome = () => navigate('/');  // Programmatic navigation
  
  return (
    <div>
      <h1>Product {id}</h1>
      <button onClick={handleBack}>Back</button>
    </div>
  );
}
```

### Protected Routes

```jsx
// ProtectedRoute.jsx
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}

// Usage
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Lazy Loading Routes

```jsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

### Scroll Restoration

```jsx
// ScrollToTop.jsx
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// Add to app
<BrowserRouter>
  <ScrollToTop />
  <Routes>...</Routes>
</BrowserRouter>
```

## Related Terminologies

- **Page** (Server) - Routes map to pages
- **SSR/SSG** (Server) - Server-side route handling
- **Authentication** (Server) - Protected routes
- **App Shell** (Server) - Router within shell

## Quality Gates

- [ ] Declarative route configuration
- [ ] Dynamic segments handled
- [ ] Protected routes for auth
- [ ] Lazy loading implemented
- [ ] 404 catch-all route
- [ ] Accessibility (focus management)

**Source**: `/docs/server/router.md`
