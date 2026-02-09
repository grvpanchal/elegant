---
title: Router
layout: doc
slug: router
---

# Router

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

## References
- [1] https://cleancommit.io/blog/spa-vs-mpa-which-is-the-king/
- [2] https://www.dhiwise.com/post/single-page-application-vs-multi-page-application
- [3] https://dev.to/seyedahmaddv/react-router-and-its-benefits-in-developing-single-page-applications-spas-4p9
- [4] https://www.sanity.io/glossary/multipage-application
- [5] https://www.moontechnolabs.com/blog/spa-vs-mpa/
- [6] https://bholmes.dev/blog/spas-clientside-routing/

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

<details>
<summary><strong>Question 1:</strong> How does client-side routing avoid full page reloads?</summary>

**Answer:** **Routers intercept link clicks with `event.preventDefault()` and use the History API (`history.pushState()`) to update the URL without triggering a browser navigation.**

```javascript
// ===== WHAT HAPPENS WITHOUT A ROUTER =====
// Traditional <a> tag behavior

<a href="/about">About</a>

// When clicked:
// 1. Browser sends GET /about to server
// 2. Server responds with new HTML document
// 3. Browser discards current page
// 4. Browser parses and renders new HTML
// 5. Downloads and executes all JavaScript again
// 6. User sees "white flash" during reload
// 7. All application state is lost (Redux, React state, etc.)


// ===== WHAT HAPPENS WITH A ROUTER =====
// React Router Link component

import { Link } from 'react-router-dom';

<Link to="/about">About</Link>

// Simplified implementation:
function Link({ to, children }) {
  const handleClick = (e) => {
    e.preventDefault();  // Stop browser from navigating
    
    // Update URL without reload
    window.history.pushState({}, '', to);
    
    // Trigger re-render of Routes component
    // Router matches new URL to component
    // Old component unmounts, new component mounts
  };
  
  return <a href={to} onClick={handleClick}>{children}</a>;
}

// When clicked:
// 1. Click event fires
// 2. preventDefault() stops browser navigation
// 3. pushState() updates URL bar from / to /about
// 4. Router re-renders, matches /about to About component
// 5. React unmounts Home component, mounts About component
// 6. No HTTP request, instant swap
// 7. Application state preserved
```

**Key difference:**
- **MPA**: Link click → HTTP request → new HTML document → full page reload
- **SPA Router**: Link click → URL update → component swap → no reload

**Why it matters:** Avoiding reloads creates app-like UX and preserves state.
</details>

<details>
<summary><strong>Question 2:</strong> What's the difference between `useParams`, `useLocation`, and `useNavigate`?</summary>

**Answer:** **`useParams` extracts URL parameters, `useLocation` reads current URL details, `useNavigate` programmatically changes routes.**

```javascript
import { useParams, useLocation, useNavigate } from 'react-router-dom';

// ===== useParams: Extract dynamic route parameters =====
// URL: /users/123
// Route: <Route path="/users/:userId" element={<UserProfile />} />

function UserProfile() {
  const { userId } = useParams();
  // userId = "123"
  
  // Use param to fetch data
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(data => setUser(data));
  }, [userId]);
  
  return <h1>User {userId}</h1>;
}


// ===== useLocation: Read current URL information =====
// URL: /search?q=react&page=2

function SearchResults() {
  const location = useLocation();
  
  console.log(location.pathname);  // "/search"
  console.log(location.search);    // "?q=react&page=2"
  console.log(location.hash);      // "" (or "#section" if present)
  console.log(location.state);     // Data passed via navigate(to, { state })
  
  // Parse query params
  const params = new URLSearchParams(location.search);
  const query = params.get('q');    // "react"
  const page = params.get('page');  // "2"
  
  return <h1>Results for {query}</h1>;
}


// ===== useNavigate: Programmatically change route =====
function ProductForm() {
  const navigate = useNavigate();
  
  const handleSubmit = async (data) => {
    const response = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const product = await response.json();
    
    // Navigate to new product page
    navigate(`/products/${product.id}`);
    
    // Or go back in history
    // navigate(-1);
    
    // Or replace current entry (no back button)
    // navigate('/products', { replace: true });
    
    // Or pass state to next route
    // navigate('/success', { state: { productName: product.name } });
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

**Summary:**

| Hook | Purpose | Example |
|------|---------|---------|
| `useParams` | Extract dynamic route segments | `const { id } = useParams()` from `/users/:id` |
| `useLocation` | Read current URL info | `location.pathname`, `location.search`, `location.state` |
| `useNavigate` | Navigate programmatically | `navigate('/dashboard')`, `navigate(-1)` |

**Why it matters:** These hooks power dynamic routing, form submissions, and navigation.
</details>

<details>
<summary><strong>Question 3:</strong> How do nested routes work in React Router?</summary>

**Answer:** **Parent routes render a layout with an `<Outlet />`, which is a placeholder where child route components render.**

```javascript
import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';

// ===== PARENT LAYOUT COMPONENT =====
function DashboardLayout() {
  return (
    <div className="dashboard">
      {/* Sidebar - shown on all dashboard pages */}
      <aside className="sidebar">
        <Link to="/dashboard/overview">Overview</Link>
        <Link to="/dashboard/analytics">Analytics</Link>
        <Link to="/dashboard/settings">Settings</Link>
      </aside>
      
      <main className="content">
        {/* Outlet renders the matched child route component */}
        <Outlet />
      </main>
    </div>
  );
}

// ===== CHILD COMPONENTS =====
function Overview() {
  return <h2>Dashboard Overview</h2>;
}

function Analytics() {
  return <h2>Analytics</h2>;
}

function Settings() {
  return <h2>Settings</h2>;
}


// ===== ROUTE CONFIGURATION =====
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Parent route */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Child routes - render inside <Outlet /> */}
          <Route path="overview" element={<Overview />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


// ===== WHAT RENDERS AT EACH URL =====

// URL: /dashboard/overview
// Renders:
<DashboardLayout>
  <aside>
    {/* Sidebar links */}
  </aside>
  <main>
    <Outlet>
      <Overview />  {/* Child route renders here */}
    </Outlet>
  </main>
</DashboardLayout>

// URL: /dashboard/analytics
// Renders:
<DashboardLayout>
  <aside>
    {/* Sidebar links */}
  </aside>
  <main>
    <Outlet>
      <Analytics />  {/* Child route renders here */}
    </Outlet>
  </main>
</DashboardLayout>


// ===== DEEPLY NESTED ROUTES =====
// You can nest multiple levels

<Route path="/dashboard" element={<DashboardLayout />}>
  <Route path="settings" element={<SettingsLayout />}>
    <Route path="profile" element={<ProfileSettings />} />
    <Route path="security" element={<SecuritySettings />} />
  </Route>
</Route>

// URL: /dashboard/settings/profile
// Renders: DashboardLayout > SettingsLayout > ProfileSettings
```

**Benefits:**
- **Shared layouts**: Sidebar/header appears on all child routes
- **Clean code**: Avoid repeating layout components
- **Multiple outlets**: Parent can have multiple `<Outlet />` with different contexts

**Why it matters:** Nested routes enable complex layouts without duplication.
</details>

<details>
<summary><strong>Question 4:</strong> How do you protect routes that require authentication?</summary>

**Answer:** **Create a `ProtectedRoute` wrapper component that checks authentication and redirects to login if not authenticated.**

{% raw %}
```javascript
import { Navigate, useLocation } from 'react-router-dom';

// ===== PROTECTED ROUTE COMPONENT =====
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();  // Custom hook
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Redirect to login, save current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // User is authenticated, render child component
  return children;
}


// ===== USAGE IN ROUTE CONFIGURATION =====
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
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
              <Profile />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}


// ===== LOGIN COMPONENT WITH REDIRECT =====
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const handleLogin = async (credentials) => {
    const success = await login(credentials);
    
    if (success) {
      // Redirect to page user tried to access
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  };
  
  return (
    <form onSubmit={handleLogin}>
      <input name="username" />
      <input name="password" type="password" />
      <button>Login</button>
    </form>
  );
}


// ===== FLOW EXAMPLE =====
/*
1. User not logged in, navigates to /dashboard
2. ProtectedRoute checks isAuthenticated = false
3. Redirects to /login with state: { from: '/dashboard' }
4. User enters credentials, login succeeds
5. Login component reads location.state.from = '/dashboard'
6. Navigates to /dashboard (original destination)
7. ProtectedRoute checks isAuthenticated = true
8. Dashboard component renders
*/


// ===== ROLE-BASED PROTECTION =====
function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
}
```
{% endraw %}

**Why it matters:** Protected routes prevent unauthorized access to sensitive pages.
</details>

<details>
<summary><strong>Question 5:</strong> How does code splitting with `React.lazy()` improve performance?</summary>

**Answer:** **Code splitting loads route components on demand instead of bundling everything upfront, reducing initial JavaScript download size.**

```javascript
// ===== WITHOUT CODE SPLITTING =====
// All components in main bundle

import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';  // 500KB component!

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

// Problem: Initial bundle includes all components
// User visiting home page downloads 500KB AdminPanel code they'll never use
// Slow initial load, wasted bandwidth


// ===== WITH CODE SPLITTING =====
// Load components on demand

import { Suspense, lazy } from 'react';

// Eager loading (always in main bundle)
import Home from './pages/Home';

// Lazy loading (separate bundles)
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading page...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// Benefits:
// 1. Initial bundle only includes Home component
// 2. About, Dashboard, AdminPanel in separate chunks
// 3. Chunks download when user navigates to route
// 4. Faster initial page load
// 5. Users only download code they use


// ===== BUILD OUTPUT =====
/*
Without code splitting:
  main.js - 800KB (all components)

With code splitting:
  main.js - 100KB (Home + router)
  About.chunk.js - 50KB (loads when user visits /about)
  Dashboard.chunk.js - 150KB (loads when user visits /dashboard)
  AdminPanel.chunk.js - 500KB (loads when user visits /admin)
*/


// ===== ADVANCED: LOADING SPINNER PER ROUTE =====
function LoadingFallback() {
  return (
    <div className="page-loading">
      <div className="spinner" />
      <p>Loading page...</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}


// ===== PREFETCHING OPTIMIZATION =====
// Preload route component on link hover

import { useEffect } from 'react';

function Navigation() {
  const prefetchAbout = () => {
    // Trigger lazy() import without rendering
    import('./pages/About');
  };
  
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link
        to="/about"
        onMouseEnter={prefetchAbout}>
        About
      </Link>
    </nav>
  );
}
// When user hovers over About link, component downloads
// Click feels instant because code is already loaded
```

**Performance impact:**

| Metric | Without Splitting | With Splitting |
|--------|------------------|----------------|
| Initial bundle | 800KB | 100KB |
| Time to Interactive | 3.5s | 1.2s |
| First visit /admin | Instant | 300ms delay |
| Return visit /admin | Instant | Instant (cached) |

**Why it matters:** Code splitting drastically improves initial load time and Core Web Vitals.
</details>

