---
title: Links
layout: doc
slug: links
---

# Links and Navigation

## Key Insight

Links are the fundamental building blocks of the web—navigation between resources that transforms isolated documents into an interconnected information network. In server-rendered applications, links determine **how users navigate** (client-side vs full page reload), **what gets prefetched** (performance optimization), **how SEO crawlers discover content** (sitemap generation, canonical URLs), and **how state persists** (URL parameters vs client state). The critical distinction: **anchor tags (`<a>`)** trigger full page reloads (server fetches new HTML, browser resets state), while **client-side routing** (`<Link>` components in React Router, Next.js) intercepts clicks and updates DOM without reloading (preserves state, faster navigation, enables transitions). Modern frameworks blur this line with **progressive enhancement**: links work as regular anchors (crawlable, no-JS fallback), enhanced with JavaScript for SPA-like navigation. Links also encode application state via URL parameters, enabling **shareable state** (copy URL → share exact app state), **back/forward navigation** (browser history), and **deep linking** (link directly to nested views).

## Detailed Description

### 1. Link Types and Navigation Patterns

**Internal Links** (same-origin navigation):
```html
<!-- Traditional anchor (full page reload) -->
<a href="/about">About Us</a>

<!-- React Router Link (client-side navigation) -->
<Link to="/about">About Us</Link>

<!-- Next.js Link (prefetched, client-side navigation) -->
<Link href="/about">About Us</Link>

<!-- Vue Router link -->
<router-link to="/about">About Us</router-link>
```

**External Links** (different origin):
```html
<!-- Opens in new tab, security best practice -->
<a href="https://external.com" target="_blank" rel="noopener noreferrer">
  External Site
</a>

<!-- rel="noopener" prevents window.opener access (security)
     rel="noreferrer" prevents Referer header leakage (privacy) -->
```

**Download Links**:
```html
<!-- Forces download instead of navigation -->
<a href="/documents/report.pdf" download="annual-report.pdf">
  Download Report
</a>
```

**Email/Phone Links** (protocol handlers):
```html
<!-- Opens email client -->
<a href="mailto:contact@example.com?subject=Inquiry">Email Us</a>

<!-- Opens phone dialer (mobile) -->
<a href="tel:+1234567890">Call Us</a>

<!-- SMS link -->
<a href="sms:+1234567890?body=Hello">Text Us</a>
```

**Hash Links** (same-page navigation):
```html
<!-- Scrolls to element with id="features" -->
<a href="#features">Jump to Features</a>

<!-- Smooth scroll with CSS -->
<style>
  html { scroll-behavior: smooth; }
</style>
```

### 2. Client-Side Routing vs Server Navigation

**Full Page Reload** (traditional anchor):
```
User clicks: <a href="/about">
↓
Browser sends: GET /about HTTP/1.1
↓
Server responds: HTML document
↓
Browser:
  1. Destroys current page (all state lost)
  2. Parses new HTML
  3. Downloads CSS/JS
  4. Executes scripts
  5. Renders new page
↓
Result: Slow (network + parse + execute), state lost, flash of white
```

**Client-Side Navigation** (SPA routing):
```
User clicks: <Link to="/about">
↓
Router intercepts click (preventDefault)
↓
Router changes URL (history.pushState('/about'))
↓
React/Vue renders new component tree
↓
Result: Fast (no network request), state preserved, smooth transition
```

**Hybrid (Progressive Enhancement)**:
```html
<!-- Next.js Link -->
<Link href="/about">
  <a>About Us</a>
</Link>

<!-- Without JavaScript: -->
User clicks → <a href="/about"> → Full page reload → Works ✓

<!-- With JavaScript: -->
User clicks → Router intercepts → Client-side navigation → Fast ✓

<!-- Best of both worlds: works without JS, enhanced with JS -->
```

### 3. Link Prefetching and Performance Optimization

**Prefetching Strategies**:

1. **On Hover** (React Router, Next.js default):
   ```jsx
   // Next.js prefetches on hover
   <Link href="/products" prefetch={true}>
     Products
   </Link>
   
   // Browser prefetches /products page when user hovers link
   // Click is instant (already loaded)
   ```

2. **On Viewport** (Intersection Observer):
   ```javascript
   // Prefetch when link enters viewport
   const observer = new IntersectionObserver((entries) => {
     entries.forEach((entry) => {
       if (entry.isIntersecting) {
         const link = entry.target.getAttribute('href');
         prefetch(link);  // Load page in background
       }
     });
   });
   
   document.querySelectorAll('a[data-prefetch]').forEach((link) => {
     observer.observe(link);
   });
   ```

3. **On Idle** (requestIdleCallback):
   ```javascript
   // Prefetch during browser idle time
   const prefetchLinks = Array.from(document.querySelectorAll('a[data-prefetch]'));
   
   if ('requestIdleCallback' in window) {
     requestIdleCallback(() => {
       prefetchLinks.forEach((link) => {
         prefetch(link.href);
       });
     });
   }
   ```

4. **Resource Hints** (HTML `<link>` tags):
   ```html
   <!-- DNS prefetch (resolve domain early) -->
   <link rel="dns-prefetch" href="https://api.example.com">
   
   <!-- Preconnect (DNS + TCP + TLS handshake) -->
   <link rel="preconnect" href="https://cdn.example.com">
   
   <!-- Prefetch (low priority, for next navigation) -->
   <link rel="prefetch" href="/products.html">
   
   <!-- Preload (high priority, for current page) -->
   <link rel="preload" href="/critical.css" as="style">
   
   <!-- Prerender (DEPRECATED - loads entire page in background) -->
   <link rel="prerender" href="/checkout.html">
   ```

### 4. URL Structure and State Management

**Anatomy of a URL**:
```
https://example.com:443/products/123?color=red&size=M#reviews
└─┬─┘  └────┬─────┘└┬┘ └─────┬─────┘ └──────┬──────┘ └───┬───┘
Protocol  Domain   Port   Path      Query Params    Hash
```

**URL Parameters for State**:
```javascript
// Search/filter state in URL (shareable, bookmarkable)
/products?category=shoes&brand=nike&price_max=100&sort=price_asc

// React Router implementation
import { useSearchParams } from 'react-router-dom';

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const category = searchParams.get('category') || 'all';
  const brand = searchParams.get('brand');
  const maxPrice = searchParams.get('price_max');
  
  const updateFilters = (newFilters) => {
    setSearchParams({ ...Object.fromEntries(searchParams), ...newFilters });
  };
  
  return (
    <div>
      <button onClick={() => updateFilters({ category: 'shoes' })}>
        Shoes
      </button>
      {/* URL updates: /products?category=shoes */}
    </div>
  );
}
```

**Dynamic Routes** (path parameters):
```javascript
// Next.js file-based routing
pages/
  products/
    [id].js       // /products/123
    [slug].js     // /products/nike-shoes
    [...slug].js  // /products/shoes/nike/air-max (catch-all)

// pages/products/[id].js
import { useRouter } from 'next/router';

export default function Product() {
  const router = useRouter();
  const { id } = router.query;  // Get id from URL
  
  return <div>Product ID: {id}</div>;
}
```

### 5. Deep Linking and Universal Links

**Deep Links** (link to specific app state):
```
Regular link:    https://example.com
Deep link:       https://example.com/user/123/posts/456/comments/789

↓ Navigates directly to nested view (comment 789 in post 456 by user 123)
```

**Mobile App Deep Linking**:
```html
<!-- Universal Links (iOS) / App Links (Android) -->
<!-- Website link that opens mobile app if installed -->

<!-- apple-app-site-association (iOS) -->
{
  "applinks": {
    "apps": [],
    "details": [{
      "appID": "TEAMID.com.example.app",
      "paths": ["/products/*", "/user/*"]
    }]
  }
}

<!-- assetlinks.json (Android) -->
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.example.app",
    "sha256_cert_fingerprints": ["..."]
  }
}]

<!-- Usage: -->
<a href="https://example.com/products/123">
  Open Product
</a>

<!-- Behavior:
     - App installed: Opens app at /products/123
     - App not installed: Opens website at /products/123
     - Seamless fallback! -->
```

**Custom URL Schemes**:
```html
<!-- App-specific protocol -->
<a href="myapp://products/123">Open in App</a>

<!-- Common schemes -->
<a href="spotify:track:123">Play Song</a>
<a href="slack://channel/123">Open Channel</a>

<!-- Fallback pattern -->
<a href="myapp://products/123" 
   onclick="setTimeout(() => window.location='https://example.com/products/123', 500)">
  Open Product
</a>
<!-- Tries app first, falls back to website after 500ms -->
```

### 6. SEO and Crawlability

**Canonical URLs** (prevent duplicate content):
```html
<!-- Page accessible via multiple URLs -->
https://example.com/products/123
https://example.com/products/123?ref=email
https://example.com/products/123?utm_source=google

<!-- Specify canonical (original) URL -->
<link rel="canonical" href="https://example.com/products/123">

<!-- Search engines consolidate ranking signals to canonical URL -->
```

**XML Sitemap** (help crawlers discover pages):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/products</loc>
    <lastmod>2024-01-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

**Robots.txt** (crawler directives):
```
User-agent: *
Allow: /

# Disallow admin pages
Disallow: /admin/
Disallow: /api/

# Sitemap location
Sitemap: https://example.com/sitemap.xml
```

**Structured Data** (rich snippets):
```html
<!-- BreadcrumbList (navigation trail in search results) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": "https://example.com"
  },{
    "@type": "ListItem",
    "position": 2,
    "name": "Products",
    "item": "https://example.com/products"
  },{
    "@type": "ListItem",
    "position": 3,
    "name": "Shoes",
    "item": "https://example.com/products/shoes"
  }]
}
</script>
```

### 7. Accessibility and Navigation

**Keyboard Navigation**:
```html
<!-- All links keyboard-accessible by default -->
<a href="/about">About</a>  <!-- Tab to focus, Enter to activate -->

<!-- Skip links (bypass navigation) -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<style>
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    z-index: 100;
  }
  .skip-link:focus {
    top: 0;  /* Visible on keyboard focus */
  }
</style>

<main id="main-content">
  <!-- Main content here -->
</main>
```

**ARIA Attributes**:
```html
<!-- Current page indicator -->
<nav>
  <a href="/" aria-current="page">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>

<!-- External link indicator -->
<a href="https://external.com" target="_blank" rel="noopener">
  External Site
  <span class="sr-only">(opens in new window)</span>
</a>

<!-- Disabled link (use button instead) -->
<button disabled>
  Unavailable Link
</button>
<!-- Don't use: <a href="#" class="disabled"> - still focusable, confusing -->
```

**Focus Management**:
```javascript
// After client-side navigation, focus appropriate element
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  
  useEffect(() => {
    // Focus main content after navigation
    const main = document.getElementById('main-content');
    if (main) {
      main.focus();
      main.scrollIntoView();
    }
  }, [location.pathname]);
  
  return <main id="main-content" tabIndex="-1">...</main>;
}
```

### 8. Link Security

**target="_blank" Vulnerability**:
```html
<!-- VULNERABLE: Opener page accessible via window.opener -->
<a href="https://malicious.com" target="_blank">
  Click Me
</a>

<!-- Malicious site can do: -->
<script>
  window.opener.location = 'https://phishing-site.com';
  // User's original tab redirected to phishing site!
</script>

<!-- SECURE: Add rel="noopener noreferrer" -->
<a href="https://external.com" target="_blank" rel="noopener noreferrer">
  External Site
</a>
```

**Open Redirect Vulnerability**:
```javascript
// VULNERABLE: User-controlled redirect
app.get('/redirect', (req, res) => {
  const url = req.query.url;
  res.redirect(url);  // Attacker can redirect to phishing site
});

// Attack: https://example.com/redirect?url=https://phishing.com

// SECURE: Whitelist allowed domains
app.get('/redirect', (req, res) => {
  const url = req.query.url;
  const allowedDomains = ['example.com', 'trusted-partner.com'];
  
  try {
    const parsedUrl = new URL(url, 'https://example.com');
    if (allowedDomains.includes(parsedUrl.hostname)) {
      res.redirect(url);
    } else {
      res.status(400).send('Invalid redirect URL');
    }
  } catch (error) {
    res.status(400).send('Invalid URL');
  }
});
```

**Link Injection** (XSS via href):
```jsx
// VULNERABLE: User-controlled href
function UserProfile({ user }) {
  return <a href={user.website}>Website</a>;
  // If user.website = "javascript:alert('XSS')", code executes!
}

// SECURE: Validate protocol
function UserProfile({ user }) {
  const isSafeUrl = (url) => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  };
  
  const website = isSafeUrl(user.website) ? user.website : null;
  
  return website ? <a href={website}>Website</a> : null;
}
```

### 9. Link State and Styling

**Active Link Styling**:
```jsx
// React Router NavLink (automatic active class)
import { NavLink } from 'react-router-dom';

<NavLink 
  to="/about" 
  className={({ isActive }) => isActive ? 'active' : ''}
>
  About
</NavLink>

// CSS
.active {
  font-weight: bold;
  color: blue;
}
```

**Loading States**:
```jsx
// Show loading indicator during navigation
import { useNavigation } from 'react-router-dom';

function App() {
  const navigation = useNavigation();
  const isNavigating = navigation.state === 'loading';
  
  return (
    <div>
      {isNavigating && <div className="loading-bar"></div>}
      <nav>
        <Link to="/about">About</Link>
      </nav>
    </div>
  );
}
```

## Code Examples

### Example 1: Complete Link Component with Prefetching and Security

{% raw %}
```jsx
// components/SmartLink.jsx - Production-ready link component
import React, { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

/**
 * SmartLink - Enhanced link component with prefetching, security, and analytics
 * 
 * Features:
 * - Automatic external link detection
 * - Prefetching on hover/viewport
 * - Security attributes for external links
 * - Analytics tracking
 * - Accessibility enhancements
 */
export function SmartLink({ 
  to, 
  href,
  children, 
  prefetch = true,
  external = false,
  download = false,
  onClick,
  className,
  ...props 
}) {
  const linkRef = useRef(null);
  const [isPrefetched, setIsPrefetched] = useState(false);
  const location = useLocation();
  
  // Normalize URL
  const url = to || href;
  
  // Detect external links
  const isExternal = external || (url && (
    url.startsWith('http://') || 
    url.startsWith('https://') ||
    url.startsWith('mailto:') ||
    url.startsWith('tel:')
  ));
  
  // Prefetch on hover
  const handleMouseEnter = () => {
    if (prefetch && !isPrefetched && !isExternal) {
      prefetchRoute(url);
      setIsPrefetched(true);
    }
  };
  
  // Prefetch function (framework-specific implementation)
  const prefetchRoute = (route) => {
    // React Router v6+ with data router
    // or custom implementation
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  };
  
  // Intersection Observer for viewport-based prefetching
  useEffect(() => {
    if (!prefetch || isExternal || isPrefetched) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            prefetchRoute(url);
            setIsPrefetched(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }  // Prefetch 50px before entering viewport
    );
    
    if (linkRef.current) {
      observer.observe(linkRef.current);
    }
    
    return () => observer.disconnect();
  }, [url, prefetch, isExternal, isPrefetched]);
  
  // Analytics tracking
  const handleClick = (e) => {
    // Track click event
    if (window.gtag) {
      window.gtag('event', 'link_click', {
        link_url: url,
        link_text: typeof children === 'string' ? children : '',
        link_domain: isExternal ? new URL(url).hostname : window.location.hostname,
        outbound: isExternal
      });
    }
    
    // Custom onClick handler
    if (onClick) {
      onClick(e);
    }
  };
  
  // External link attributes
  const externalAttrs = isExternal ? {
    target: '_blank',
    rel: 'noopener noreferrer',
    // Add visual indicator
    'aria-label': `${children} (opens in new window)`
  } : {};
  
  // Download attribute
  const downloadAttr = download ? { download: typeof download === 'string' ? download : true } : {};
  
  // Internal link (use React Router)
  if (!isExternal && !download) {
    return (
      <RouterLink
        ref={linkRef}
        to={url}
        className={className}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        {...props}
      >
        {children}
      </RouterLink>
    );
  }
  
  // External or download link (use regular anchor)
  return (
    <a
      ref={linkRef}
      href={url}
      className={className}
      onClick={handleClick}
      {...externalAttrs}
      {...downloadAttr}
      {...props}
    >
      {children}
      {isExternal && (
        <svg 
          className="external-icon" 
          width="12" 
          height="12" 
          viewBox="0 0 12 12"
          aria-hidden="true"
          style={{ marginLeft: '4px', verticalAlign: 'text-top' }}
        >
          <path d="M6 1h5v5M11 1L5 7" stroke="currentColor" fill="none" />
        </svg>
      )}
    </a>
  );
}

// Usage examples
function Examples() {
  return (
    <div>
      {/* Internal link (prefetched) */}
      <SmartLink to="/products">
        Products
      </SmartLink>
      
      {/* External link (secure) */}
      <SmartLink href="https://external.com">
        External Site
      </SmartLink>
      
      {/* Download link */}
      <SmartLink href="/files/report.pdf" download="report.pdf">
        Download Report
      </SmartLink>
      
      {/* Email link */}
      <SmartLink href="mailto:contact@example.com">
        Email Us
      </SmartLink>
      
      {/* Disable prefetch */}
      <SmartLink to="/heavy-page" prefetch={false}>
        Heavy Page (no prefetch)
      </SmartLink>
    </div>
  );
}

// CSS for visual enhancements
/*
.external-icon {
  display: inline-block;
  margin-left: 4px;
  opacity: 0.7;
}

a:hover .external-icon {
  opacity: 1;
}

a:focus {
  outline: 2px solid blue;
  outline-offset: 2px;
}

a[download] {
  text-decoration: underline dotted;
}
*/
```
{% endraw %}

### Example 2: URL State Management with Search Params

```jsx
// pages/ProductsPage.jsx - Complex filtering with URL state
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Parse URL parameters
  const filters = {
    category: searchParams.get('category') || 'all',
    brand: searchParams.getAll('brand') || [],  // Multiple values
    minPrice: parseInt(searchParams.get('min_price')) || 0,
    maxPrice: parseInt(searchParams.get('max_price')) || 1000,
    sort: searchParams.get('sort') || 'relevance',
    page: parseInt(searchParams.get('page')) || 1
  };
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch products when filters change
  useEffect(() => {
    fetchProducts(filters);
  }, [searchParams]);  // Re-fetch when URL changes
  
  const fetchProducts = async (filters) => {
    setLoading(true);
    
    // Build API query
    const params = new URLSearchParams({
      category: filters.category,
      min_price: filters.minPrice,
      max_price: filters.maxPrice,
      sort: filters.sort,
      page: filters.page
    });
    
    // Add multiple brand filters
    filters.brand.forEach(b => params.append('brand', b));
    
    const response = await fetch(`/api/products?${params}`);
    const data = await response.json();
    
    setProducts(data.products);
    setLoading(false);
  };
  
  // Update single filter
  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value === null || value === '' || value === 'all') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    
    // Reset to page 1 when filters change
    if (key !== 'page') {
      newParams.delete('page');
    }
    
    setSearchParams(newParams);
  };
  
  // Toggle array filter (brands)
  const toggleBrand = (brand) => {
    const currentBrands = searchParams.getAll('brand');
    const newParams = new URLSearchParams(searchParams);
    
    // Remove all brand params
    newParams.delete('brand');
    
    // Add back brands (toggle selected brand)
    const updatedBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand];
    
    updatedBrands.forEach(b => newParams.append('brand', b));
    
    // Reset to page 1
    newParams.delete('page');
    
    setSearchParams(newParams);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchParams({});
  };
  
  // Shareable URL
  const shareFilters = () => {
    const url = `${window.location.origin}${window.location.pathname}?${searchParams}`;
    navigator.clipboard.writeText(url);
    alert('Filter URL copied to clipboard!');
  };
  
  return (
    <div className="products-page">
      <aside className="filters">
        <h2>Filters</h2>
        
        {/* Category filter */}
        <div>
          <label>Category</label>
          <select 
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="shoes">Shoes</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
        
        {/* Brand filter (multiple selection) */}
        <div>
          <label>Brands</label>
          {['Nike', 'Adidas', 'Puma', 'Reebok'].map(brand => (
            <label key={brand}>
              <input
                type="checkbox"
                checked={filters.brand.includes(brand.toLowerCase())}
                onChange={() => toggleBrand(brand.toLowerCase())}
              />
              {brand}
            </label>
          ))}
        </div>
        
        {/* Price range */}
        <div>
          <label>Price Range: ${filters.minPrice} - ${filters.maxPrice}</label>
          <input
            type="range"
            min="0"
            max="1000"
            value={filters.minPrice}
            onChange={(e) => updateFilter('min_price', e.target.value)}
          />
          <input
            type="range"
            min="0"
            max="1000"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('max_price', e.target.value)}
          />
        </div>
        
        {/* Sort */}
        <div>
          <label>Sort By</label>
          <select 
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
          >
            <option value="relevance">Relevance</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
        
        {/* Actions */}
        <button onClick={clearFilters}>Clear All Filters</button>
        <button onClick={shareFilters}>Share Filters</button>
      </aside>
      
      <main>
        <h1>Products</h1>
        
        {/* Active filters display */}
        <div className="active-filters">
          {filters.category !== 'all' && (
            <span>Category: {filters.category} ✕</span>
          )}
          {filters.brand.map(b => (
            <span key={b}>Brand: {b} ✕</span>
          ))}
        </div>
        
        {/* Product grid */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <h3>{product.name}</h3>
                  <p>${product.price}</p>
                  <a href={`/products/${product.id}`}>View Details</a>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="pagination">
              <button 
                disabled={filters.page === 1}
                onClick={() => updateFilter('page', filters.page - 1)}
              >
                Previous
              </button>
              <span>Page {filters.page}</span>
              <button onClick={() => updateFilter('page', filters.page + 1)}>
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// Example URLs generated:
// /products
// /products?category=shoes
// /products?category=shoes&brand=nike&brand=adidas
// /products?category=shoes&brand=nike&min_price=50&max_price=150&sort=price_asc
// /products?category=shoes&brand=nike&min_price=50&max_price=150&sort=price_asc&page=2

// Benefits:
// ✓ Shareable: Copy URL, share exact filter state
// ✓ Bookmarkable: Bookmark filtered view
// ✓ Back/Forward: Browser navigation works
// ✓ SEO: Different URLs for different filter combinations
```

### Example 3: SEO-Optimized Navigation with Sitemap Generation

```javascript
// scripts/generate-sitemap.js - Dynamic sitemap generation
const fs = require('fs');
const path = require('path');

// Fetch dynamic routes from database/API
async function getDynamicRoutes() {
  // Example: Fetch products, blog posts, categories
  const products = await fetch('https://api.example.com/products').then(r => r.json());
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  
  return [
    ...products.map(p => ({
      url: `/products/${p.slug}`,
      lastmod: p.updated_at,
      changefreq: 'weekly',
      priority: 0.8
    })),
    ...posts.map(p => ({
      url: `/blog/${p.slug}`,
      lastmod: p.published_at,
      changefreq: 'monthly',
      priority: 0.7
    }))
  ];
}

// Static routes
const staticRoutes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/about', changefreq: 'monthly', priority: 0.5 },
  { url: '/contact', changefreq: 'monthly', priority: 0.5 },
  { url: '/products', changefreq: 'daily', priority: 0.9 },
  { url: '/blog', changefreq: 'daily', priority: 0.8 }
];

// Generate sitemap XML
async function generateSitemap() {
  const domain = 'https://example.com';
  const dynamicRoutes = await getDynamicRoutes();
  const allRoutes = [...staticRoutes, ...dynamicRoutes];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allRoutes.map(route => `  <url>
    <loc>${domain}${route.url}</loc>
    ${route.lastmod ? `<lastmod>${new Date(route.lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
    ${route.changefreq ? `<changefreq>${route.changefreq}</changefreq>` : ''}
    ${route.priority ? `<priority>${route.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;
  
  // Write to public directory
  fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap);
  
  console.log(`✓ Sitemap generated with ${allRoutes.length} URLs`);
}

// Run sitemap generation
generateSitemap().catch(console.error);

// Add to package.json scripts:
// "build:sitemap": "node scripts/generate-sitemap.js"
// "build": "npm run build:sitemap && next build"
```

```jsx
// components/SEOHead.jsx - SEO meta tags component
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export function SEOHead({
  title,
  description,
  image,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  tags = []
}) {
  const location = useLocation();
  const domain = 'https://example.com';
  const url = `${domain}${location.pathname}`;
  
  const defaultDescription = 'Shop the best products at Example Store';
  const defaultImage = `${domain}/og-image.jpg`;
  
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title} | Example Store</title>
      <meta name="description" content={description || defaultDescription} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph (Facebook, LinkedIn) */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:site_name" content="Example Store" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      {tags.length > 0 && tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@examplestore" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
      
      {/* Breadcrumb structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": getBreadcrumbs(location.pathname)
        })}
      </script>
    </Helmet>
  );
}

function getBreadcrumbs(pathname) {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { position: 1, name: 'Home', item: 'https://example.com' }
  ];
  
  let currentPath = '';
  paths.forEach((path, index) => {
    currentPath += `/${path}`;
    breadcrumbs.push({
      position: index + 2,
      name: path.charAt(0).toUpperCase() + path.slice(1),
      item: `https://example.com${currentPath}`
    });
  });
  
  return breadcrumbs;
}

// Usage
function ProductPage({ product }) {
  return (
    <>
      <SEOHead
        title={product.name}
        description={product.description}
        image={product.image}
        type="product"
        tags={product.categories}
      />
      <div>
        <h1>{product.name}</h1>
        {/* Product content */}
      </div>
    </>
  );
}
```

## Common Mistakes

### 1. Using Buttons for Navigation

❌ **Wrong**: Using `<button>` with onClick for navigation.

```jsx
// BAD: Button for navigation
<button onClick={() => window.location = '/about'}>
  About Us
</button>

// Problems:
// ❌ Not keyboard-accessible with Tab key (buttons not in tab order for navigation)
// ❌ Not crawlable by search engines
// ❌ No context menu (right-click → Open in new tab)
// ❌ No URL preview on hover
// ❌ Screen readers don't announce as navigation
```

✅ **Correct**: Use `<a>` or `<Link>` for navigation.

```jsx
// GOOD: Link for navigation
<Link to="/about">
  About Us
</Link>

// Or with custom styling
<Link to="/about" className="button-style">
  About Us
</Link>

// Benefits:
// ✓ Keyboard accessible (Tab to focus)
// ✓ Crawlable (search engines follow links)
// ✓ Context menu available
// ✓ URL preview on hover
// ✓ Screen readers announce correctly
```

**When to use buttons**:
```jsx
// Use <button> for actions that don't navigate
<button onClick={handleSubmit}>Submit Form</button>
<button onClick={toggleMenu}>Open Menu</button>
<button onClick={addToCart}>Add to Cart</button>

// Use <Link> for navigation
<Link to="/checkout">Checkout</Link>
<Link to="/products/123">View Product</Link>
```

**Why it matters**: Links and buttons have different semantics. Links navigate to new resources (should be `<a>`), buttons perform actions (should be `<button>`). Using the wrong element breaks accessibility, SEO, and user experience (keyboard shortcuts, context menu, etc.).

### 2. Missing rel="noopener" on External Links

❌ **Wrong**: External link without security attributes.

```jsx
<a href="https://external.com" target="_blank">
  External Site
</a>

// Security vulnerability:
// External site can access window.opener
// Can redirect original tab to phishing site:
// window.opener.location = 'https://phishing.com';
```

✅ **Correct**: Add `rel="noopener noreferrer"` to external links.

```jsx
<a href="https://external.com" target="_blank" rel="noopener noreferrer">
  External Site
</a>

// rel="noopener": Prevents window.opener access (security)
// rel="noreferrer": Prevents Referer header (privacy)

// Both together: Full protection
```

**Automatic fix in modern browsers**:
```html
<!-- Modern browsers automatically add rel="noopener" -->
<!-- But explicit is better for compatibility and clarity -->
<a href="https://external.com" target="_blank" rel="noopener noreferrer">
```

**Why it matters**: Without `rel="noopener"`, external sites can access and manipulate your page via `window.opener.location`, enabling phishing attacks (redirect user's original tab while they view external site). Always add `rel="noopener noreferrer"` to `target="_blank"` links.

### 3. Hash Links Breaking Client-Side Routing

❌ **Wrong**: Using `#` for dummy links, breaks back button.

```jsx
// BAD: Hash links for actions
<a href="#" onClick={(e) => {
  e.preventDefault();
  doSomething();
}}>
  Click Me
</a>

// Problems:
// ❌ Adds "#" to URL (breaks history)
// ❌ Page scrolls to top
// ❌ Still navigable with keyboard (shouldn't be a link)
```

✅ **Correct**: Use `<button>` for actions, proper links for navigation.

```jsx
// GOOD: Button for actions (no navigation)
<button onClick={doSomething}>
  Click Me
</button>

// GOOD: Real hash link for same-page navigation
<a href="#features">
  Jump to Features
</a>

// In SPA: Use router's hash linking
<Link to="/products#reviews">
  View Reviews
</Link>
```

**Hash link implementation** (React Router):
```jsx
// Scroll to hash on route change
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToHash() {
  const { hash } = useLocation();
  
  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);
  
  return null;
}

// Usage
<Link to="/products#reviews">Reviews</Link>
// On navigation, scrolls to <div id="reviews">
```

**Why it matters**: `href="#"` is a hack—adds `#` to URL, breaks browser history, and scrolls page to top. If it's not navigation, don't use a link—use a `<button>`. If it IS navigation (same-page scroll), use proper hash with element ID.

## Quiz

### Question 1: Client-Side Routing vs Full Page Reload

**Q**: What's the difference between `<a href="/about">` and `<Link to="/about">` in a React SPA? When does each cause a full page reload?

**A**:

**`<a href="/about">`** (standard anchor tag):
- **Always causes full page reload** (even in SPA)
- Browser sends GET request to server for `/about`
- Server returns HTML for new page
- Browser destroys current page, loads new page
- **All JavaScript state lost** (Redux store, component state, etc.)
- Flash of white (page briefly blank while loading)

**`<Link to="/about">`** (React Router Link):
- **Prevents default** browser navigation (via `event.preventDefault()`)
- Uses `history.pushState()` to update URL without reload
- React Router renders new component tree (client-side)
- **JavaScript state preserved** (Redux, component state intact)
- Fast transition (no network request, no page flash)

**When `<Link>` causes full reload**:
```jsx
// Standard Link - client-side navigation
<Link to="/about">About</Link>

// Link with reloadDocument - forces full reload
<Link to="/about" reloadDocument>About</Link>

// External Link component - full reload
<Link to="https://external.com">External</Link>
```

**Example**:
```jsx
function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      
      {/* Client-side navigation - count persists */}
      <Link to="/about">About (count preserved)</Link>
      
      {/* Full reload - count resets to 0 */}
      <a href="/about">About (count lost)</a>
    </div>
  );
}
```

**When to use each**:

Use `<Link>`:
- Internal navigation in SPA
- Want to preserve app state
- Need fast transitions
- Building interactive app

Use `<a>`:
- External links (different domain)
- Download links
- Email/tel links (`mailto:`, `tel:`)
- Want hard refresh (clear state)

**Progressive Enhancement**:
```jsx
// Next.js Link - best of both worlds
<Link href="/about">
  <a>About</a>
</Link>

// Without JavaScript: <a> works (full reload)
// With JavaScript: Link intercepts (client-side navigation)
```

**Why it matters**: Understanding the difference is critical for SPA development. Using `<a>` instead of `<Link>` causes unnecessary full page reloads, slow transitions, and lost state. But `<a>` is still necessary for external links, downloads, and progressive enhancement.

### Question 2: URL Parameters vs Client State

**Q**: When should you store application state in URL parameters vs client state (Redux, React state)? What are the tradeoffs?

**A**:

**URL Parameters** (`?category=shoes&sort=price`):

**Use when:**
- State should be **shareable** (copy URL, share exact view)
- State should be **bookmarkable** (save for later)
- State should survive **page refresh**
- State is **page-specific** (filters, search, pagination)
- State should be **crawlable** (SEO - different URLs for different content)

**Examples**:
```javascript
// Search results
/search?q=shoes&category=running&brand=nike

// Product filtering
/products?price_min=50&price_max=150&color=red&size=M

// Pagination
/blog?page=3

// Sorting
/users?sort=name_asc

// Tabs/views
/dashboard?tab=analytics&date_range=30d
```

**Advantages**:
- ✓ Shareable (send link to colleague)
- ✓ Bookmarkable (save filtered view)
- ✓ Back/Forward navigation works
- ✓ Server can render different content (SEO)
- ✓ Analytics can track different states

**Disadvantages**:
- ✗ Long URLs (ugly, hard to read)
- ✗ URL length limits (2048 chars in some browsers)
- ✗ Sensitive data visible (passwords, tokens in URL = bad)
- ✗ Complex state hard to serialize

---

**Client State** (Redux, React state, Context):

**Use when:**
- State is **transient** (doesn't need to survive refresh)
- State is **UI-only** (modal open/closed, dropdown expanded)
- State is **sensitive** (passwords, tokens, private data)
- State is **complex** (objects, arrays, binary data)
- State is **cross-page** (global auth, theme preferences)

**Examples**:
```javascript
// Modal visibility
const [isModalOpen, setIsModalOpen] = useState(false);

// Form draft (before submission)
const [formData, setFormData] = useState({ name: '', email: '' });

// Authentication state
const [user, setUser] = useState(null);

// Theme preference
const [theme, setTheme] = useState('dark');

// Dropdown expanded
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
```

**Advantages**:
- ✓ Private (not visible in URL)
- ✓ Complex data structures (objects, arrays)
- ✓ Large data (no URL length limit)
- ✓ Fast updates (no URL changes)

**Disadvantages**:
- ✗ Not shareable
- ✗ Lost on refresh
- ✗ Back/Forward doesn't work
- ✗ Hard to debug (can't share exact state)

---

**Hybrid Approach** (best of both):

```jsx
// Combine URL params + client state
function ProductsPage() {
  // Filters in URL (shareable)
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  
  // UI state in React (transient)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  // Data in Redux (global)
  const products = useSelector(state => state.products);
  
  return (
    <div>
      {/* URL param controls data */}
      <select value={category} onChange={(e) => 
        setSearchParams({ category: e.target.value })
      }>
        <option value="all">All</option>
        <option value="shoes">Shoes</option>
      </select>
      
      {/* Client state controls UI */}
      <button onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}>
        Toggle Filters
      </button>
    </div>
  );
}
```

**Decision Matrix**:

| State Type | URL Params | Client State |
|------------|------------|--------------|
| Search query | ✓ | ✗ |
| Filters/sorting | ✓ | ✗ |
| Pagination | ✓ | ✗ |
| Active tab | ✓ | Sometimes |
| Modal open | ✗ | ✓ |
| Form draft | ✗ | ✓ |
| Auth token | ✗ | ✓ |
| Theme | ✗ | ✓ (localStorage) |
| Dropdown state | ✗ | ✓ |

**Why it matters**: URL parameters make state shareable, bookmarkable, and SEO-friendly, but expose data publicly and have length limits. Client state is private and flexible, but lost on refresh and not shareable. Use URL params for page-specific, shareable state (filters, search), client state for transient UI state (modals, dropdowns).

### Question 3: Link Prefetching Performance

**Q**: What are the different link prefetching strategies (hover, viewport, idle), and when should you use each? What are the tradeoffs?

**A**:

**1. Hover Prefetching** (default in Next.js):

```jsx
<Link href="/products" prefetch={true}>
  Products
</Link>

// Behavior: Prefetches when user hovers link
// Network request triggered ~300ms before click
```

**Advantages**:
- ✓ Instant navigation (page already loaded)
- ✓ High accuracy (user hovering = likely to click)
- ✓ Low bandwidth waste (only prefetch likely pages)

**Disadvantages**:
- ✗ Doesn't work on mobile (no hover)
- ✗ Requires user action (not proactive)
- ✗ 300ms delay might not be enough for slow connections

**When to use**:
- Desktop-primary applications
- Critical pages (top navigation)
- Low bandwidth budgets

---

**2. Viewport Prefetching** (Intersection Observer):

```javascript
// Prefetch when link enters viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const href = entry.target.getAttribute('href');
      prefetch(href);
    }
  });
}, { rootMargin: '50px' });  // Prefetch 50px before visible

document.querySelectorAll('a[data-prefetch]').forEach((link) => {
  observer.observe(link);
});
```

**Advantages**:
- ✓ Works on mobile (no hover needed)
- ✓ Proactive (prefetches before user interacts)
- ✓ Configurable (rootMargin controls when)

**Disadvantages**:
- ✗ Wastes bandwidth (prefetches links user may not click)
- ✗ Many links = many requests (can overwhelm)

**When to use**:
- Mobile-first applications
- Long pages with many links (blog posts with related articles)
- Good network conditions

---

**3. Idle Prefetching** (requestIdleCallback):

```javascript
// Prefetch during browser idle time
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    const links = document.querySelectorAll('a[data-prefetch]');
    links.forEach((link) => {
      prefetch(link.href);
    });
  }, { timeout: 2000 });
}
```

**Advantages**:
- ✓ Doesn't block main thread (uses idle time)
- ✓ Improves perceived performance
- ✓ No user interaction needed

**Disadvantages**:
- ✗ Wastes bandwidth (prefetches all links)
- ✗ May never run (browser never idle)
- ✗ Hard to control (browser decides when)

**When to use**:
- Small sites (few pages to prefetch)
- Critical user flows (checkout, onboarding)
- Unlimited bandwidth

---

**4. Manual/Programmatic Prefetching**:

```javascript
// Prefetch after user action
function handleAddToCart() {
  addToCart(product);
  
  // User likely to checkout next
  prefetch('/checkout');
}
```

**Advantages**:
- ✓ Predictive (based on user behavior)
- ✓ Efficient (only prefetch likely next steps)

**Disadvantages**:
- ✗ Requires logic (must predict user path)
- ✗ Can be wrong (wastes bandwidth if prediction wrong)

**When to use**:
- Linear user flows (step 1 → step 2 → step 3)
- High-confidence predictions

---

**Resource Hints** (HTML `<link>` tags):

```html
<!-- DNS prefetch (resolve domain early) -->
<link rel="dns-prefetch" href="https://api.example.com">
<!-- Cost: ~20-120ms DNS lookup -->
<!-- Use: External domains you'll need soon -->

<!-- Preconnect (DNS + TCP + TLS) -->
<link rel="preconnect" href="https://cdn.example.com">
<!-- Cost: ~100-300ms full handshake -->
<!-- Use: Critical third-party resources (fonts, CDN) -->

<!-- Prefetch (low priority, for NEXT navigation) -->
<link rel="prefetch" href="/products.html">
<!-- Cost: Full page download -->
<!-- Use: Likely next page user will visit -->

<!-- Preload (high priority, for CURRENT page) -->
<link rel="preload" href="/critical.css" as="style">
<!-- Cost: Full resource download -->
<!-- Use: Critical resources for current page -->
```

---

**Bandwidth Considerations**:

```javascript
// Check connection quality before prefetching
if ('connection' in navigator) {
  const conn = navigator.connection;
  
  if (conn.effectiveType === '4g' && !conn.saveData) {
    // Fast connection, no data saver - prefetch aggressively
    enablePrefetch('viewport');
  } else if (conn.effectiveType === '3g') {
    // Slower connection - only hover prefetch
    enablePrefetch('hover');
  } else {
    // Slow connection or data saver - disable prefetch
    disablePrefetch();
  }
}
```

---

**Decision Matrix**:

| Strategy | Mobile | Desktop | Bandwidth | Accuracy |
|----------|--------|---------|-----------|----------|
| Hover | ✗ | ✓✓✓ | Low | High |
| Viewport | ✓✓✓ | ✓✓ | Medium | Medium |
| Idle | ✓✓ | ✓✓ | High | Low |
| Manual | ✓✓✓ | ✓✓✓ | Low | Very High |

**Best Practice** (Next.js default):
```jsx
// Automatic hover prefetch on desktop
// Automatic viewport prefetch on mobile
// Respects user's data saver preference
<Link href="/products">Products</Link>
```

**Why it matters**: Prefetching improves perceived performance (instant navigation), but wastes bandwidth if overused. Hover prefetching is accurate but doesn't work on mobile. Viewport prefetching works everywhere but can waste bandwidth. Idle prefetching is least accurate. Choose strategy based on device type, bandwidth constraints, and user behavior patterns.

## References

- [React Router Documentation](https://reactrouter.com/)
- [Next.js Link Component](https://nextjs.org/docs/api-reference/next/link)
- [MDN: HTML <a> element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a)
- [Web Vitals: First Input Delay](https://web.dev/fid/)
- [Resource Hints: dns-prefetch, preconnect, prefetch, preload](https://www.w3.org/TR/resource-hints/)
- [Universal Links (iOS)](https://developer.apple.com/ios/universal-links/)
- [App Links (Android)](https://developer.android.com/training/app-links)
- [Sitemap Protocol](https://www.sitemaps.org/protocol.html)
