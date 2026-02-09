---
title: Static Site Generation
layout: doc
slug: ssg
---

# Static Site Generation

## Key Insight

Static Site Generation (SSG) pre-renders pages at build time into HTML files served instantly from CDNs, delivering blazing-fast page loads (50-100ms vs 500ms+ SSR) with perfect SEO while drastically reducing server costs and infrastructure complexity—making it the optimal choice for content-driven sites where data changes infrequently. Modern SSG combines static speed with dynamic flexibility through Incremental Static Regeneration (ISR), revalidating pages periodically to keep content fresh without full rebuilds.

## Detailed Description

Static Site Generation fundamentally shifts when rendering happens—from request time (SSR) or client time (CSR) to build time. Instead of generating HTML when users visit pages, SSG generates all HTML during deployment, creating a collection of static files served directly from CDNs without server computation. This "pre-render once, serve millions" approach delivers unmatched performance, security, and cost efficiency for appropriate use cases.

The core workflow: developers write content (Markdown, headless CMS, database), build command triggers static site generator (Next.js, Gatsby, Astro, Hugo), generator fetches data and renders every page to HTML/CSS/JS, output gets deployed to CDN (Vercel, Netlify, Cloudflare Pages). Result: global edge distribution serving pre-built files in ~50ms from nearest location, zero server computation per request, automatic scaling to millions of users without infrastructure changes.

Performance advantages are dramatic. SSG pages load 5-10x faster than SSR because there's no server rendering delay—HTML is already built and cached at CDN edge nodes worldwide. Time to First Byte (TTFB) drops from 200-500ms (SSR) to 20-50ms (SSG). First Contentful Paint (FCP) happens almost instantly since browsers receive complete HTML immediately. This speed directly improves SEO rankings (Google prioritizes fast sites), conversion rates (Amazon found 100ms delay = 1% revenue loss), and user satisfaction (53% abandon sites >3s load).

The challenge: data freshness. SSG pages are frozen at build time—if product prices change or new blog posts publish, sites must rebuild. Traditional solution: trigger full rebuild on content changes, but rebuilding 10,000 pages takes 10+ minutes, making SSG impractical for frequently updated sites. Modern solution: **Incremental Static Regeneration (ISR)** combining static speed with dynamic updates by regenerating individual pages on-demand after time-based revalidation (e.g., regenerate product page max once per 60 seconds when accessed).

Next.js implementation uses `getStaticProps` for build-time data fetching and `getStaticPaths` for dynamic routes, returning props injected into page components. For dynamic routes like `/products/[id]`, `getStaticPaths` specifies which IDs to pre-render (either all products or subset with `fallback: true` for on-demand generation). ISR adds `revalidate` seconds indicating stale-while-revalidate pattern—serve cached HTML while regenerating in background if older than revalidate threshold.

Hybrid rendering strategies optimize different pages differently: homepage (SSG with ISR revalidate 60s for fresh hero content), product listings (SSG with ISR revalidate 300s for updated inventory), product details (SSG with `fallback: 'blocking'` for on-demand new products), user dashboards (SSR for personalized real-time data). This granular control per route maximizes performance where possible while maintaining dynamic capabilities where needed.

Build optimization techniques include: parallel page generation (build multiple pages simultaneously), partial rebuilds (only rebuild changed pages, not entire site), content-addressed hashing (cache unchanged assets permanently), image optimization (generate responsive formats at build), code splitting (separate bundles per route), tree shaking (eliminate unused code). Large sites with 50,000+ pages use distributed builds across multiple workers, reducing 2-hour builds to 10 minutes.

Build optimization techniques include: parallel page generation (build multiple pages simultaneously), partial rebuilds (only rebuild changed pages, not entire site), content-addressed hashing (cache unchanged assets permanently), image optimization (generate responsive formats at build), code splitting (separate bundles per route), tree shaking (eliminate unused code). Large sites with 50,000+ pages use distributed builds across multiple workers, reducing 2-hour builds to 10 minutes.

## Code Examples

### Basic Example: Next.js getStaticProps

Simple static page generation with build-time data fetching:

{% raw %}
```javascript
// ===== pages/blog/[slug].js =====
// Dynamic route for blog posts

export default function BlogPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <p>Published: {post.publishedAt}</p>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}

// Fetch data at BUILD TIME
export async function getStaticProps({ params }) {
  // Called during build, not on every request
  const post = await fetchPostBySlug(params.slug);
  
  return {
    props: {
      post  // Passed to component as props
    }
  };
}

// Specify which paths to pre-render
export async function getStaticPaths() {
  // Fetch all blog post slugs
  const posts = await fetchAllPosts();
  
  const paths = posts.map(post => ({
    params: { slug: post.slug }
  }));
  
  return {
    paths,  // [{ params: { slug: 'intro' }}, { params: { slug: 'tutorial' }}]
    fallback: false  // 404 for non-existent slugs
  };
}

// Helper functions
async function fetchAllPosts() {
  // Fetch from CMS, database, or filesystem
  const response = await fetch('https://api.cms.com/posts');
  return response.json();
}

async function fetchPostBySlug(slug) {
  const response = await fetch(`https://api.cms.com/posts/${slug}`);
  return response.json();
}

// Build output:
// /blog/intro.html (pre-rendered)
// /blog/tutorial.html (pre-rendered)
// /blog/advanced.html (pre-rendered)
```
{% endraw %}

### Practical Example: ISR with Revalidation

Incremental Static Regeneration for frequently updated content:

```javascript
// ===== pages/products/[id].js =====
// Product pages with periodic updates

export default function ProductPage({ product, lastUpdated }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: ${product.price}</p>
      <p>Stock: {product.inStock ? 'Available' : 'Out of Stock'}</p>
      <span>Last updated: {lastUpdated}</span>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const product = await fetchProduct(params.id);
  
  return {
    props: {
      product,
      lastUpdated: new Date().toISOString()
    },
    // ISR: Revalidate every 60 seconds
    revalidate: 60
  };
}

// ISR Behavior:
// 1. First request at t=0s: Serve pre-built HTML
// 2. Request at t=70s: Still serve cached HTML, trigger regeneration
// 3. Request at t=75s: Serve newly generated HTML
// 4. Requests between t=75-135s: Serve cached HTML from step 3
// 5. Repeat cycle

export async function getStaticPaths() {
  // Pre-render only popular products at build time
  const popularProducts = await fetchPopularProducts();
  
  const paths = popularProducts.map(product => ({
    params: { id: product.id.toString() }
  }));
  
  return {
    paths,
    fallback: 'blocking'  // Generate other products on-demand
  };
}

// fallback: 'blocking' behavior:
// - Pre-rendered products: Instant load
// - New product (not pre-rendered): Server generates on first request, then caches
// - All subsequent requests: Serve from cache with ISR revalidation

async function fetchProduct(id) {
  const response = await fetch(`https://api.shop.com/products/${id}`);
  return response.json();
}
```

### Advanced Example: Hybrid Rendering Strategy

Different rendering modes per route for optimal performance:

```javascript
// ===== next.config.js =====
module.exports = {
  i18n: {
    locales: ['en', 'es', 'fr'],
    defaultLocale: 'en'
  }
};


// ===== pages/index.js (Homepage - SSG with ISR) =====
export default function HomePage({ featuredProducts, heroContent }) {
  return (
    <div>
      <Hero content={heroContent} />
      <ProductGrid products={featuredProducts} />
    </div>
  );
}

export async function getStaticProps() {
  const [products, hero] = await Promise.all([
    fetch('https://api.shop.com/products/featured').then(r => r.json()),
    fetch('https://api.cms.com/hero').then(r => r.json())
  ]);
  
  return {
    props: {
      featuredProducts: products,
      heroContent: hero
    },
    revalidate: 300  // Refresh every 5 minutes
  };
}


// ===== pages/products/index.js (Listing - SSG with ISR) =====
export default function ProductsPage({ products, categories }) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  return (
    <div>
      <CategoryFilter 
        categories={categories}
        onFilter={category => 
          setFilteredProducts(products.filter(p => p.category === category))
        }
      />
      <ProductList products={filteredProducts} />
    </div>
  );
}

export async function getStaticProps() {
  const [products, categories] = await Promise.all([
    fetchAllProducts(),
    fetchCategories()
  ]);
  
  return {
    props: { products, categories },
    revalidate: 600  // 10 minutes
  };
}


// ===== pages/products/[id].js (Details - SSG with fallback) =====
export default function ProductDetail({ product }) {
  const router = useRouter();
  
  // Show fallback UI while generating new product
  if (router.isFallback) {
    return <ProductSkeleton />;
  }
  
  return <ProductDetailView product={product} />;
}

export async function getStaticProps({ params }) {
  try {
    const product = await fetchProduct(params.id);
    return {
      props: { product },
      revalidate: 60
    };
  } catch (error) {
    return {
      notFound: true  // Show 404 page
    };
  }
}

export async function getStaticPaths() {
  const topProducts = await fetchTopProducts(100);
  
  return {
    paths: topProducts.map(p => ({ params: { id: p.id } })),
    fallback: 'blocking'  // Generate others on-demand, show loading
  };
}


// ===== pages/dashboard.js (User Dashboard - SSR) =====
// Never cached, always fresh user data
export default function Dashboard({ user, orders }) {
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <OrdersList orders={orders} />
    </div>
  );
}

export async function getServerSideProps({ req }) {
  // Runs on EVERY request (SSR, not SSG)
  const token = req.cookies.authToken;
  const [user, orders] = await Promise.all([
    fetchUser(token),
    fetchUserOrders(token)
  ]);
  
  return {
    props: { user, orders }
    // No revalidate - always fresh
  };
}


// ===== pages/api/revalidate.js (On-Demand Revalidation) =====
// Webhook to revalidate specific paths when CMS content changes

export default async function handler(req, res) {
  // Verify request from trusted source
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  
  try {
    // Revalidate specific paths
    await res.revalidate('/');
    await res.revalidate('/products');
    await res.revalidate(`/products/${req.body.productId}`);
    
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}

// Webhook from CMS:
// POST /api/revalidate?secret=TOKEN
// Body: { productId: '123' }
// Result: Specific pages regenerated immediately


// ===== Build-time optimization =====
// next.config.js

module.exports = {
  // Parallel builds
  experimental: {
    workerThreads: true,
    cpus: 4
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    minimumCacheTTL: 31536000
  },
  
  // Output standalone for Docker
  output: 'standalone',
  
  // Compress output
  compress: true,
  
  // Generate sitemap during build
  async generateBuildId() {
    // Use git commit hash for cache busting
    return execSync('git rev-parse HEAD').toString().trim();
  }
};
```

## Common Mistakes

### 1. Using SSG for Dynamic User Content
**Mistake:** Pre-rendering pages that need user-specific data.

```javascript
// ❌ BAD: User profile with SSG
export async function getStaticProps({ params }) {
  const user = await fetchUser(params.userId);
  return { props: { user } };
  // Problem: User data is frozen at build time
  // User updates profile → changes not reflected until rebuild
}
```

```javascript
// ✅ GOOD: Use SSR for user-specific pages
export async function getServerSideProps({ params, req }) {
  const token = req.cookies.authToken;
  const user = await fetchUser(token);
  return { props: { user } };
  // Fresh data on every request
}

// ✅ ALTERNATIVE: SSG skeleton + client-side fetch
export default function UserProfile({ userId }) {
  const { data: user } = useSWR(`/api/users/${userId}`);
  
  if (!user) return <ProfileSkeleton />;
  return <ProfileView user={user} />;
}

export async function getStaticProps() {
  return { props: {} };  // No user data at build time
}
```

**Why it matters:** SSG pages are static—using it for personalized content serves stale data to users.

### 2. Not Handling Build Failures
**Mistake:** Assuming data fetching always succeeds during build.

```javascript
// ❌ BAD: Unhandled build errors
export async function getStaticProps() {
  const data = await fetch('https://api.cms.com/content').then(r => r.json());
  // If API is down during build, entire build fails
  return { props: { data } };
}
```

```javascript
// ✅ GOOD: Graceful error handling
export async function getStaticProps() {
  try {
    const response = await fetch('https://api.cms.com/content');
    
    if (!response.ok) {
      console.error(`API returned ${response.status}`);
      return { notFound: true };
    }
    
    const data = await response.json();
    return { props: { data } };
  } catch (error) {
    console.error('Build-time fetch failed:', error);
    
    // Return fallback data or skip page
    return {
      props: { data: null },
      revalidate: 10  // Retry sooner
    };
  }
}
```

**Why it matters:** Build failures halt deployments. Handle errors to allow builds to complete with fallbacks.

### 3. Over-generating Pages at Build Time
**Mistake:** Pre-rendering thousands of pages unnecessarily.

```javascript
// ❌ BAD: Generate all 10,000 products at build
export async function getStaticPaths() {
  const allProducts = await fetchAllProducts();  // 10,000 products
  
  const paths = allProducts.map(p => ({
    params: { id: p.id.toString() }
  }));
  
  return { paths, fallback: false };
  // Build time: 2 hours
  // Most products never visited
}
```

```javascript
// ✅ GOOD: Generate popular products, use fallback for rest
export async function getStaticPaths() {
  const popularProducts = await fetchPopularProducts(100);
  
  const paths = popularProducts.map(p => ({
    params: { id: p.id.toString() }
  }));
  
  return {
    paths,
    fallback: 'blocking'  // Generate others on first request
  };
  // Build time: 2 minutes
  // On-demand generation for remaining products
}
```

**Why it matters:** Pre-rendering rarely-visited pages wastes build time. Use `fallback: 'blocking'` for on-demand generation.

## Quick Quiz

<details>
<summary><strong>Question 1:</strong> What's the difference between SSG, SSR, and CSR?</summary>

**Answer:**

**SSG (Static Site Generation):**
- HTML generated at **build time**
- Same HTML served to all users
- Fastest TTFB (~20-50ms from CDN)
- Stale data until rebuild
- **Use:** Blogs, marketing sites, docs

**SSR (Server-Side Rendering):**
- HTML generated on **each request**
- Fresh data for every user
- Slower TTFB (~200-500ms server processing)
- Higher server costs
- **Use:** User dashboards, personalized content

**CSR (Client-Side Rendering):**
- HTML generated in **browser** via JavaScript
- Blank page until JS loads
- Poor SEO (crawlers see empty HTML)
- **Use:** Web apps, admin panels

**Performance comparison:**
- SSG TTFB: 50ms ⚡
- SSR TTFB: 300ms
- CSR TTFB: 100ms (but blank page + JS execution = 1000ms+ FCP)

</details>

<details>
<summary><strong>Question 2:</strong> How does Incremental Static Regeneration (ISR) work?</summary>

**Answer:** ISR combines static speed with dynamic updates using stale-while-revalidate pattern:

**Process:**
1. Page generated at build time with `revalidate: 60` seconds
2. User requests page at t=0s → Serve cached HTML (instant)
3. User requests at t=70s → Serve stale cached HTML + trigger background regeneration
4. Regeneration completes → New HTML cached
5. Next request → Serve fresh HTML
6. Cycle repeats every 60 seconds

**Code:**
```javascript
export async function getStaticProps() {
  const data = await fetchData();
  return {
    props: { data },
    revalidate: 60  // Seconds
  };
}
```

**Benefits:**
- Users always get fast response (cached HTML)
- Content stays reasonably fresh (max 60s stale)
- No build required for updates

**Use when:** Content changes frequently but real-time updates not critical (product prices, blog posts).
</details>

<details>
<summary><strong>Question 3:</strong> What do the different fallback options mean in getStaticPaths?</summary>

**Answer:**

**`fallback: false`:**
- Only paths returned from `getStaticPaths` exist
- All other paths → 404 page
- Use when: All possible paths known at build time (small, fixed set)

**`fallback: true`:**
- Pre-rendered paths served instantly
- Non-pre-rendered paths generate on first request
- Shows fallback UI while generating (check `router.isFallback`)
- Use when: Many possible paths, want instant loading state

**`fallback: 'blocking'`:**
- Pre-rendered paths served instantly
- Non-pre-rendered paths generate on first request
- Browser waits for generation (no fallback UI)
- Use when: Can't show loading state, prefer waiting

**Example:**
```javascript
export async function getStaticPaths() {
  return {
    paths: [{ params: { id: '1' }}],
    fallback: 'blocking'
  };
}

// Visit /products/1 → Instant (pre-rendered)
// Visit /products/999 → 3s wait (generates) → then cached
```
</details>

<details>
<summary><strong>Question 4:</strong> When should you use on-demand revalidation vs time-based ISR?</summary>

**Answer:**

**Time-based ISR (revalidate):**
- Automatic periodic updates
- No manual trigger needed
- Eventual consistency
```javascript
return { props: { data }, revalidate: 300 };
```
**Use when:** Content changes regularly but unpredictably (product inventory, blog posts)

**On-demand Revalidation:**
- Manual trigger via API route
- Immediate updates
- Controlled by events
```javascript
// API route
await res.revalidate('/products/123');
```
**Use when:** Know exactly when content changes (CMS webhook, admin publish button)

**Best practice:** Combine both
```javascript
export async function getStaticProps() {
  return {
    props: { data },
    revalidate: 3600  // Fallback: hourly refresh
  };
}

// PLUS webhook for immediate updates
// POST /api/revalidate when CMS content changes
```

Result: Immediate updates when needed + guaranteed freshness hourly.
</details>

<details>
<summary><strong>Question 5:</strong> How do you optimize build times for large sites?</summary>

**Answer:**

**Strategies:**

1. **Limit pre-rendered pages:**
```javascript
getStaticPaths() {
  return {
    paths: topProducts.slice(0, 100),
    fallback: 'blocking'  // Generate rest on-demand
  };
}
```

2. **Parallel builds:**
```javascript
// next.config.js
experimental: {
  workerThreads: true,
  cpus: 8
}
```

3. **Incremental builds:**
Only rebuild changed pages, not entire site

4. **Separate static from dynamic:**
- Homepage: SSG
- Product listing: SSG with ISR
- User dashboard: SSR (skip build)

5. **Cache build artifacts:**
```javascript
// Vercel/Netlify automatically cache
// _next/ folder between builds
```

6. **Optimize data fetching:**
```javascript
// BAD: N+1 queries
for (const post of posts) {
  await fetchComments(post.id);
}

// GOOD: Batch request
const allComments = await fetchAllComments(postIds);
```

**Result:** 50,000-page site builds in 10 minutes instead of 2 hours.
</details>

## References

- [Next.js SSG Documentation](https://nextjs.org/docs/basic-features/data-fetching/get-static-props)
- [ISR Guide](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
- [Jamstack Architecture](https://jamstack.org/)
- [Build Performance Optimization](https://nextjs.org/docs/advanced-features/compiler)