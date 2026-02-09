---
description: Guidance for SSG - Static Site Generation for optimal performance
name: SSG - Server
applyTo: |
  **/pages/**/*.{jsx,tsx,vue,md,mdx}
  **/*static*.{js,ts}
---

# SSG Instructions

## What is Static Site Generation?

SSG pre-renders pages at build time into static HTML files served from CDN. It delivers the fastest load times (50-100ms) with perfect SEO, ideal for content that doesn't change frequently.

## Key Principles

1. **Build-Time Rendering**: Pages generated during `npm run build`, not per request. All data fetched at build time.

2. **CDN Distribution**: Static files cached at edge locations globally. Zero server computation per request.

3. **ISR for Freshness**: Incremental Static Regeneration revalidates pages periodically without full rebuilds.

## Best Practices

✅ **DO**:
- Use SSG for blogs, docs, marketing pages, product catalogs
- Implement ISR for content that updates periodically
- Use `getStaticPaths` for dynamic routes
- Set appropriate `revalidate` intervals
- Leverage CDN caching headers

❌ **DON'T**:
- Use SSG for highly personalized content
- Forget `fallback` strategy for dynamic routes
- Trigger full rebuilds for every content change (use ISR)
- Ignore build times for large sites (parallelize)
- Use SSG for real-time data

## Code Patterns

### Basic SSG (Next.js)

```jsx
// pages/blog/[slug].js
export default function BlogPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}

// Called at BUILD time
export async function getStaticProps({ params }) {
  const post = await fetchPost(params.slug);
  
  return {
    props: { post }
  };
}

// Define which paths to pre-render
export async function getStaticPaths() {
  const posts = await fetchAllPosts();
  
  return {
    paths: posts.map(post => ({
      params: { slug: post.slug }
    })),
    fallback: false  // 404 for unknown slugs
  };
}
```

### ISR - Incremental Static Regeneration

```jsx
// pages/products/[id].js
export async function getStaticProps({ params }) {
  const product = await fetchProduct(params.id);
  
  return {
    props: { product },
    revalidate: 60  // Regenerate at most every 60 seconds
  };
}

export async function getStaticPaths() {
  const topProducts = await fetchTopProducts(100);
  
  return {
    paths: topProducts.map(p => ({ params: { id: p.id } })),
    fallback: 'blocking'  // Generate on-demand, wait for HTML
  };
}
```

### Fallback Strategies

```javascript
// fallback: false
// - Only pre-rendered paths work
// - Unknown paths → 404

// fallback: true
// - Unknown paths → show loading, generate in background
// - Use router.isFallback to show skeleton

// fallback: 'blocking'
// - Unknown paths → SSR once, then cache as static
// - No loading state needed
```

## SSG vs SSR Decision

| Use SSG When | Use SSR When |
|--------------|--------------|
| Content rarely changes | Content changes per request |
| Same for all users | Personalized per user |
| SEO important | Real-time data needed |
| High traffic | Lower traffic |
| Blog, docs, marketing | Dashboard, user profile |

## Related Terminologies

- **SSR** (Server) - Alternative: request-time rendering
- **Page** (Server) - Pages define static generation
- **ISR** - Incremental regeneration strategy
- **CDN** - Where static files are served from

## Quality Gates

- [ ] Appropriate use case for SSG
- [ ] Build time acceptable for site size
- [ ] ISR revalidate intervals set correctly
- [ ] Fallback strategy chosen
- [ ] Dynamic content handled appropriately

**Source**: `/docs/server/ssg.md`
