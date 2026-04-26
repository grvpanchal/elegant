---
title: Router
layout: doc
slug: router
---

# Router

> - Enables SPA navigation without page reloads
> - Intercepts links and updates URL via History API
> - Creates app-like experience with component swapping

## Key Insight

Client-side routers enable **Single Page Applications (SPAs) to navigate without full page reloads** by intercepting link clicks and updating the URL using the **History API**, then rendering the matching component for that route. This creates an **app-like experience** where clicking a link updates only the content area (component swap) instead of requesting a new HTML document from the server, preserving JavaScript state and avoiding the "white flash" of traditional multi-page navigation.

## Detailed Description

In traditional Multi-Page Applications (MPAs), clicking a link sends an HTTP request to the server, which responds with a completely new HTML document. The browser discards the current page, downloads the new one, and re-executes all JavaScript. This causes a "white flash," loses application state, and feels slow.

**Client-side routers solve this by:**

1. **Intercepting Navigation**: Listen for link clicks and `<a>` tag interactions, preventing default browser behavior (`event.preventDefault()`)
2. **Updating the URL**: Use the browser's History API (`history.pushState()`) to change the URL bar without triggering a page reload
3. **Matching Routes**: Compare the new URL against a route table (e.g., `/users/:id` matches `/users/123`)
4. **Rendering Components**: Unmount the old component, mount the new component for the matched route
5. **Preserving State**: Keep Redux store, React context, and global JavaScript state intact across navigation

**Core Concepts:**

- **Route Configuration**: Declarative mapping of URL patterns to components (`<Route path="/about" component={About} />`)
- **Dynamic Segments**: URL parameters like `/users/:userId` extract values to props (`useParams()`)
- **Nested Routes**: Child routes render inside parent components, creating layouts
- **Programmatic Navigation**: Navigate via JavaScript (`navigate('/dashboard')`) instead of just links
- **Route Guards**: Protect routes with authentication checks before rendering (Protected Routes pattern)
- **History Management**: Browser back/forward buttons work via `popstate` event listeners

**Popular Router Libraries:**

- **React Router** (most popular): Declarative routing with `BrowserRouter`, `Route`, `Link`, hooks (`useParams`, `useNavigate`, `useLocation`)
- **Vue Router**: Official Vue.js router with `<router-link>`, `<router-view>`, navigation guards
- **Angular Router**: Built into Angular framework with `routerLink`, route guards, lazy loading
- **TanStack Router** (modern): Type-safe routing with built-in data loading and caching

**Why Routers Matter:**

1. **Performance**: No full page reload → faster navigation, preserved state
2. **User Experience**: App-like feel, smooth transitions, no "white flash"
3. **SEO**: Shareable URLs for specific app states (though requires SSR or pre-rendering for SEO)
4. **Code Splitting**: Lazy load route components (`React.lazy()`) to reduce initial bundle size
5. **Developer Experience**: Declarative route definitions, type-safe params (TypeScript), programmatic navigation

**Trade-offs:**

- **Initial Bundle Size**: Router library + all route components (mitigated by code splitting)
- **SEO Challenges**: Search engines need server-side rendering (SSR) or static site generation (SSG)
- **Accessibility**: Must manage focus and announce route changes for screen readers
- **Complexity**: More complex than traditional links, especially nested routes and guards

## Code Examples

### Basic Example: React Router Setup

```javascript
// ===== ROUTE CONFIGURATION =====
// App.js - Basic routing setup with React Router

import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Page components
function Home() {
  return (
    <div className="page">
      <h1>Home Page</h1>
      <p>Welcome to our application!</p>
    </div>
  );
}

function About() {
  return (
    <div className="page">
      <h1>About Us</h1>
      <p>We build amazing web applications.</p>
    </div>
  );
}

function Contact() {
  return (
    <div className="page">
      <h1>Contact</h1>
      <p>Email us at hello@example.com</p>
    </div>
  );
}

function NotFound() {
  return (
    <div className="page">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">Go back home</Link>
    </div>
  );
}


// ===== APP WITH NAVIGATION =====
function App() {
  return (
    <BrowserRouter>
      <div className="app">
        {/* Navigation bar - appears on all pages */}
        <nav className="navbar">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        
        {/* Route outlet - component changes based on URL */}
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;


// ===== HOW IT WORKS =====
/*
1. User clicks <Link to="/about">
2. React Router intercepts click, prevents default browser navigation
3. Calls history.pushState('/about', ...) to update URL bar
4. Routes component re-renders, matches "/about" to About component
5. About component renders in place of Home component
6. No HTTP request, no page reload, state preserved
*/


// ===== ADDING ACTIVE LINK STYLING =====
import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <NavLink
        to="/"
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        Home
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        About
      </NavLink>
    </nav>
  );
}

// CSS
// .nav-link.active { font-weight: bold; color: blue; }
```

### Practical Example: Dynamic Routes and Nested Routing

```javascript
// ===== DYNAMIC ROUTE PARAMETERS =====
// pages/UserProfile.js - Access route params

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function UserProfile() {
  const { userId } = useParams();  // Extract :userId from URL
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch user data based on userId from URL
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(data => {
        setUser(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        navigate('/404');  // Programmatic navigation on error
      });
  }, [userId, navigate]);
  
  if (isLoading) return <div>Loading user...</div>;
  if (!user) return <div>User not found</div>;
  
  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <button onClick={() => navigate('/users')}>
        Back to Users List
      </button>
    </div>
  );
}


// ===== NESTED ROUTES =====
// App.js - Parent route with nested children

import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';

// Dashboard layout with sidebar
function DashboardLayout() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <Link to="/dashboard/overview">Overview</Link>
        <Link to="/dashboard/stats">Statistics</Link>
        <Link to="/dashboard/settings">Settings</Link>
      </aside>
      
      <main className="dashboard-content">
        {/* Outlet renders the matched child route */}
        <Outlet />
      </main>
    </div>
  );
}

function Overview() {
  return <h2>Dashboard Overview</h2>;
}

function Stats() {
  return <h2>Statistics</h2>;
}

function Settings() {
  return <h2>Settings</h2>;
}

// Route configuration
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Parent route */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Nested child routes */}
          <Route path="overview" element={<Overview />} />
          <Route path="stats" element={<Stats />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* Dynamic route */}
        <Route path="/users/:userId" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}


// ===== READING URL QUERY PARAMETERS =====
import { useSearchParams } from 'react-router-dom';

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = searchParams.get('q');  // /search?q=react
  const page = searchParams.get('page') || '1';
  
  const handleSearch = (newQuery) => {
    setSearchParams({ q: newQuery, page: '1' });
    // Updates URL to /search?q=newQuery&page=1
  };
  
  return (
    <div>
      <h1>Search Results for "{query}"</h1>
      <p>Page {page}</p>
    </div>
  );
}
```

### Advanced Example: Protected Routes and Code Splitting

{% raw %}
```javascript
// ===== PROTECTED ROUTE PATTERN =====
// components/ProtectedRoute.js - Require authentication

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Redirect to login, save attempted URL for after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}


// ===== USAGE OF PROTECTED ROUTE =====
// App.js

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes - require authentication */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}


// ===== LOGIN REDIRECT FLOW =====
// pages/Login.js - Redirect after successful login

import { useNavigate, useLocation } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const handleLogin = async (credentials) => {
    const success = await login(credentials);
    
    if (success) {
      // Redirect to page user tried to access, or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  };
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin({ username: e.target.username.value });
    }}>
      <input name="username" placeholder="Username" />
      <button type="submit">Login</button>
    </form>
  );
}


// ===== CODE SPLITTING WITH LAZY LOADING =====
// App.js - Load routes on demand

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Eager loading (included in main bundle)
import Home from './pages/Home';

// Lazy loading (separate bundles, loaded on demand)
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserProfile = lazy(() => import('./pages/UserProfile'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading page...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* These components load only when user navigates to route */}
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users/:userId" element={<UserProfile />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}


// ===== ROUTE-BASED DATA LOADING =====
// Modern pattern: Load data when route matches

import { useLoaderData, useNavigate } from 'react-router-dom';

// Data loader function
async function userLoader({ params }) {
  const response = await fetch(`/api/users/${params.userId}`);
  if (!response.ok) throw new Error('User not found');
  return response.json();
}

// Component uses pre-loaded data
function UserProfile() {
  const user = useLoaderData();  // Data already loaded by router
  const navigate = useNavigate();
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={() => navigate('/users')}>Back</button>
    </div>
  );
}

// Route configuration with loader
const router = createBrowserRouter([
  {
    path: '/users/:userId',
    element: <UserProfile />,
    loader: userLoader,  // Router calls this before rendering
    errorElement: <ErrorPage />  // Shown if loader throws
  }
]);


// ===== PROGRAMMATIC NAVIGATION PATTERNS =====
import { useNavigate } from 'react-router-dom';

function ProductForm() {
  const navigate = useNavigate();
  
  const handleSubmit = async (productData) => {
    const response = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
    
    const newProduct = await response.json();
    
    // Navigate to the new product's page
    navigate(`/products/${newProduct.id}`);
    
    // Or go back in history
    // navigate(-1);
    
    // Or replace current history entry (no back button to form)
    // navigate(`/products/${newProduct.id}`, { replace: true });
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```
{% endraw %}

## Common Mistakes

### 1. Using `<a>` Tags Instead of `<Link>`
**Mistake:** Using regular anchor tags for internal navigation causes full page reloads.

```javascript
// ❌ BAD: Anchor tag causes full page reload
function Navigation() {
  return (
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </nav>
  );
}
// Clicking these links:
// 1. Sends HTTP request to server
// 2. Browser discards current page
// 3. Loads entirely new HTML document
// 4. Loses all React state
// 5. Re-initializes entire app
// 6. Shows "white flash" between pages


// ✅ GOOD: Link component uses client-side routing
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
    </nav>
  );
}
// Clicking these links:
// 1. Intercepts click, prevents default
// 2. Updates URL with history.pushState()
// 3. Swaps component (About replaces Home)
// 4. Preserves React state
// 5. No HTTP request, instant navigation


// When to use <a> tags:
// - External links: <a href="https://example.com">External</a>
// - File downloads: <a href="/api/download/file.pdf">Download</a>
// - Hash links (same page): <a href="#section">Jump</a>
```

**Why it matters:** Using `<a>` destroys SPA benefits, causing slow navigation and lost state.

### 2. Forgetting `exact` Prop (React Router v5) or Incorrect Path Matching
**Mistake:** Routes match partially, causing multiple components to render.

```javascript
// ❌ BAD: React Router v5 without exact
import { BrowserRouter, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/about/team" component={Team} />
    </BrowserRouter>
  );
}
// Problem: Navigating to /about renders BOTH Home and About
// because "/" matches "/about" (partial match)


// ✅ GOOD: React Router v5 with exact
function App() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/about/team" component={Team} />
    </BrowserRouter>
  );
}


// ✅ BETTER: React Router v6 (Routes wrapper)
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/about/team" element={<Team />} />
      </Routes>
    </BrowserRouter>
  );
}
// Routes automatically uses exact matching in v6
```

**Why it matters:** Partial matching renders wrong components and breaks navigation.

### 3. Not Handling 404 / Catch-All Routes
**Mistake:** Missing catch-all route shows blank page for invalid URLs.

```javascript
// ❌ BAD: No 404 handling
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
// Navigating to /invalid shows blank page
// User has no idea what happened


// ✅ GOOD: Catch-all route with NotFound component
function NotFound() {
  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">Go back home</Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        
        {/* Catch-all route - must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}


// ✅ ALSO GOOD: Error boundary for runtime errors
import { useRouteError } from 'react-router-dom';

function ErrorPage() {
  const error = useRouteError();
  
  return (
    <div className="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p><i>{error.statusText || error.message}</i></p>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [...]
  }
]);
```

**Why it matters:** Users need feedback when they navigate to invalid URLs or errors occur.

## Quick Quiz

{% include quiz.html id="router-1"
   question="How does client-side routing avoid a full page reload?"
   options="A|It opens each route in a hidden iframe and swaps which iframe is visible, so the browser thinks it never left the original document;;B|The router intercepts link clicks (event.preventDefault), updates the URL via history.pushState() without making an HTTP request, listens for popstate to handle back/forward, and re-renders the matching route component — JS state, Redux store, and DOM scroll position are preserved;;C|It still issues an HTTP request for every navigation, but the server returns 304 Not Modified so the browser skips re-rendering;;D|Modern browsers automatically detect <Link> tags and short-circuit the network — no router code is involved at runtime"
   correct="B"
   explanation="pushState + a matching popstate listener is the core primitive every SPA router (React Router, Vue Router, @angular/router) builds on." %}

{% include quiz.html id="router-2"
   question="In React Router, what's the difference between useParams, useLocation, and useNavigate?"
   options="A|They're synonyms;;B|useParams is server-only;;C|useParams returns the dynamic segments matched by the current route (e.g. :id -> { id }); useLocation returns the current Location object (pathname, search, hash, state) for reading query strings or router state; useNavigate returns an imperative fn to programmatically navigate (push/replace);;D|They only work in Remix"
   correct="C"
   explanation="Params = the matched dynamic bits. Location = everything about the current URL. navigate() = the go-somewhere verb. Each is a narrow tool with one job." %}

{% include quiz.html id="router-3"
   question="How do nested routes work in React Router v6+?"
   options="A|You must use window.location;;B|Parent routes render an <Outlet /> where matched child routes render, enabling shared layout/chrome (sidebar, header) across child pages without re-mounting. Relative paths and nested route config build the tree;;C|Each route must be a sibling at the top level;;D|Nested routes are deprecated"
   correct="B"
   explanation="The Outlet pattern is how you implement layouts, dashboards with subpages, and auth-guarded sections that share context without each child managing its own chrome." %}

{% include quiz.html id="router-4"
   question="What's the cleanest way to protect routes that require authentication?"
   options="A|Intercept in server middleware only;;B|Check auth inside every page component;;C|Use a layout/guard route (ProtectedRoute, RequireAuth) that checks auth state and either renders its <Outlet /> or redirects to /login with the intended destination saved so the user returns there after signing in;;D|Use try/catch around routes"
   correct="C"
   explanation="A single guard layer keeps auth logic in one place, handles return-to-URL, and composes with role-based guards cleanly." %}

{% include quiz.html id="router-5"
   question="How does React.lazy() + Suspense improve SPA performance with routing?"
   options="A|It only works at build time;;B|It replaces the router;;C|It makes rendering synchronous;;D|It code-splits a route's component into its own chunk so it's fetched only when that route is visited — cutting the initial bundle. Suspense boundaries show a fallback while the chunk loads. Combined with route-level preloading on hover you get lazy routes with snappy feel"
   correct="D"
   explanation="Per-route code splitting is one of the highest-leverage perf wins — the visitor of /home never downloads the JS for /settings." %}

## References
- [1] https://cleancommit.io/blog/spa-vs-mpa-which-is-the-king/
- [2] https://www.dhiwise.com/post/single-page-application-vs-multi-page-application
- [3] https://dev.to/seyedahmaddv/react-router-and-its-benefits-in-developing-single-page-applications-spas-4p9
- [4] https://www.sanity.io/glossary/multipage-application
- [5] https://www.moontechnolabs.com/blog/spa-vs-mpa/
- [6] https://bholmes.dev/blog/spas-clientside-routing/
