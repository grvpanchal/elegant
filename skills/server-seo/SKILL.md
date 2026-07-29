---
name: server-seo
description: Technical SEO for frontend apps — crawlable HTML on the first response, per-route `<title>`/description, Open Graph and Twitter Card previews, JSON-LD structured data (Product, Article, BreadcrumbList, FAQPage), canonical URLs and hreflang clusters, XML sitemaps and `robots.txt`, semantic headings and alt text, and Core Web Vitals (LCP/INP/CLS). Use when a route needs metadata, share previews render blank, rich results are missing, or crawlers only see an empty `#root`.
when_to_use: Adding or auditing per-route title/description/canonical metadata; fixing blank Open Graph or Twitter share previews; adding JSON-LD for rich results; generating a sitemap or editing `robots.txt`; setting up hreflang for localised routes; diagnosing why a client-rendered SPA route is not indexed; chasing LCP/INP/CLS regressions that affect Page Experience.
paths:
  - "**/robots.txt"
  - "**/sitemap*.{xml,js,ts}"
  - "**/*{Seo,SEO,Meta,Head,StructuredData}*.{jsx,tsx,vue,js,ts}"
---

# SEO

## What is Technical SEO?

Technical SEO is the work of making an application's content *reachable, parseable, and attributable* by crawlers. It splits into two halves: **crawling and indexing** (does the bot get real HTML, with the right metadata, at a canonical URL?) and **page experience** (does the page load and respond fast enough — LCP < 2.5s, INP < 200ms, CLS < 0.1?). A client-rendered SPA fails the first half by default: the crawler receives `<div id="root"></div>` and must run your JS to discover anything.

## Key Principles

1. **Metadata Is Per Route, Not Per Site**: Every indexable URL needs its own title (50–60 chars), description (150–160 chars), canonical, and OG image. Duplicated sitewide tags tell the search engine your pages are interchangeable.

2. **HTML on the First Response Wins**: Crawlers execute JS, but on a deferred budget, and social-preview scrapers (Slack, LinkedIn, Discord) generally do not execute it at all. SSR or SSG is what makes metadata reliable — see the `server-ssr` and `server-ssg` skills.

3. **Declare One Canonical URL**: `/products`, `/products/`, `/products?ref=x` and a localised twin are four URLs for one page. `<link rel="canonical">` plus 301s consolidates their signals; self-referential canonicals are the safe default.

4. **Structured Data Buys Presentation, Not Ranking**: JSON-LD makes a result eligible for stars, prices, breadcrumbs, and FAQ accordions — a CTR lever, distinct from position.

## Best Practices

✅ **DO**:
- Give each route a unique title, description, and canonical URL
- Set `og:title`/`og:description`/`og:image` (absolute URLs) as the baseline, plus `twitter:card` for layout
- Emit JSON-LD matching what is actually visible on the page, and validate with the Rich Results Test
- Ship an XML sitemap with `lastmod` and reference it from `robots.txt`
- Use one `<h1>` and a non-skipping heading hierarchy; write descriptive `alt` text
- Make hreflang clusters bidirectional and include `x-default`

❌ **DON'T**:
- Rely on client-side `document.title` mutation as your only metadata strategy
- Mark up content the user cannot see (Google treats it as spam)
- Block CSS/JS in `robots.txt` — the renderer needs them to see your layout
- Use `robots.txt` to hide a page from the index (use `noindex`; a disallowed URL can still rank)
- Let a hero image lazy-load or ship images without dimensions (LCP and CLS regressions)
- Ship desktop-only content behind mobile "read more" toggles — indexing is mobile-first

## Code Patterns

### Per-Route Metadata

```jsx
// React 19 hoists <title>/<meta> from anywhere in the tree into <head>
function Seo({ title, description, canonical, image, type = 'website' }) {
  return (
    <>
      <title>{`${title} | YourSite`}</title>
      <meta name="description" content={description.slice(0, 155)} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description.slice(0, 155)} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}
```

Frameworks with a metadata pipeline (`generateMetadata` in Next's App Router, `<svelte:head>`, `useHead` in Nuxt) render these server-side, which is what makes them visible to non-JS scrapers.

### Structured Data (JSON-LD)

```jsx
function StructuredData({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  image: product.images,
  description: product.description,
  sku: product.sku,
  brand: { '@type': 'Brand', name: product.brand },
  offers: {
    '@type': 'Offer',
    url: `https://example.com/products/${product.id}`,
    priceCurrency: 'USD',
    price: product.price,
    availability: product.inStock
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
  },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewCount },
};
```

`BreadcrumbList` for navigation trails, `Article` (headline/author/datePublished) for posts, `FAQPage` for Q&A — one `<script>` per entity, or a single `@graph` array.

### Sitemap and robots.txt

```txt
# public/robots.txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: https://example.com/sitemap.xml
```

```xml
<!-- sitemap.xml — generate at build time from your route manifest -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-07-01</lastmod>
    <changefreq>daily</changefreq>
  </url>
</urlset>
```

### Canonicals and hreflang

```html
<link rel="canonical" href="https://example.com/en/products/42" />

<!-- Every variant must list every variant, including itself -->
<link rel="alternate" hreflang="en-US" href="https://example.com/en/products/42" />
<link rel="alternate" hreflang="fr-CA" href="https://example.com/fr/produits/42" />
<link rel="alternate" hreflang="x-default" href="https://example.com/products/42" />
```

A one-sided reference (English lists French, French does not link back) makes search engines discard the whole cluster.

### Core Web Vitals Levers

```html
<!-- LCP: eager + prioritised hero, preconnect to asset origins -->
<link rel="preconnect" href="https://cdn.example.com" />
<img src="/hero.jpg" alt="Product hero" width="1200" height="600"
     loading="eager" fetchpriority="high" />

<!-- CLS: reserve space for anything that arrives late -->
<div style="aspect-ratio: 16 / 9"><!-- embed slot --></div>
```

INP is mostly a JS problem: split routes with `import()`, break long tasks, and keep event handlers off the critical path. See the `server-images` skill for the LCP/CLS image details.

### In the elegant templates

The templates are client-rendered Vite SPAs, so they carry a **single static set of metadata** and no per-route SEO. `templates/chota-react-saga/index.html` has one `<title>Todo App</title>`, one `<meta name="description" content="Elegant React + Redux Saga todo app" />`, viewport, and `theme-color`; `public/robots.txt` is the permissive stock file:

```txt
User-agent: *
Disallow:
```

What is missing should be treated as work to do, not as intentional design: no canonical, Open Graph, or Twitter Card tags (link shares render a bare URL); no sitemap and no router-driven head management; and crawlers that do not execute JS see only the empty `<div id="root"></div>` that `src/index.jsx` mounts into. `src/reportWebVitals.js` also exists but nothing imports it, so vitals are never reported.

For a real deployment, add a head-management layer (React 19 hoisting, or a `Seo` component per page under `src/pages/`) *and* pre-render — or adopt SSR/SSG per the `server-ssr` / `server-ssg` skills. Metadata injected purely on the client is enough for Googlebot's rendering pass and nothing else.

## Related Terminologies

- **SSR / SSG** (Server) - Deliver crawlable per-route HTML and metadata
- **Index File** (Server) - The host document holds baseline metadata
- **Images** (Server) - `srcset`, dimensions, and `alt` drive LCP/CLS and image search
- **App Shell** (Server) - Shell-only responses are what crawlers see without pre-rendering
- **Router** (Server) - Route changes must trigger metadata updates

## Quality Gates

- [ ] Every indexable route has a unique title, description, and canonical URL
- [ ] Open Graph + Twitter tags present with absolute image URLs
- [ ] JSON-LD validates and matches visible content
- [ ] Sitemap generated with `lastmod` and referenced from `robots.txt`
- [ ] One `<h1>`, non-skipping headings, descriptive `alt` on meaningful images
- [ ] LCP < 2.5s, INP < 200ms, CLS < 0.1 on mobile field data

**Source**: `/docs/server/seo.md`
