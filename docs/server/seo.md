---
title: Search Engine Optimization
layout: doc
slug: seo
---

# Search Engine Optimization

## Glossary

- **Crawling** — the process by which search-engine bots (Googlebot, Bingbot) fetch your URLs by following links and sitemap entries. If a page can't be crawled, it can't be indexed.
- **Indexing** — once crawled, the engine parses, renders, and stores the page in its index so it can be returned for queries. JS-only pages depend on the engine's rendering pass to be indexed.
- **Core Web Vitals** — Google's user-experience signals used in the Page Experience ranking system. The three current vitals are:
  - **LCP (Largest Contentful Paint)** — when the biggest above-the-fold element finishes painting. Target < 2.5s.
  - **INP (Interaction to Next Paint)** — page-lifetime responsiveness to user input; replaced FID in March 2024. Target < 200ms.
  - **CLS (Cumulative Layout Shift)** — how much visible content jumps around as the page loads. Target < 0.1.
- **Canonical URL** — the URL you declare (via `<link rel="canonical">`) as the "official" address for a piece of content when several URLs would otherwise serve it.
- **hreflang** — a `<link rel="alternate" hreflang="…">` annotation telling search engines which language/region a page targets so the right localized URL surfaces in the right market.
- **Schema.org / structured data** — a shared vocabulary for describing entities (Product, Article, Recipe, FAQ, BreadcrumbList) on a page. Usually delivered as JSON-LD and used by search engines to render rich results.

## Detailed Description

### Crawling & Indexing

Search Engine Optimization in modern frontend architecture solves a fundamental conflict: search engines prefer fast-loading, semantic HTML with clear content hierarchy, while modern SPAs prioritize rich interactivity through JavaScript frameworks. Without proper SEO implementation, Google's crawler sees `<div id="root"></div>` and nothing more—your beautifully designed React app is invisible to search engines, social media previews show blank pages, and organic traffic remains zero despite excellent content. The fix is to give crawlers real HTML on the first response — see [ssr.md](ssr.html) for server-side rendering and [ssg.md](ssg.html) for build-time pre-rendering.

The core SEO pillars for frontend applications: (1) **Server-Side Rendering** ensuring crawlers receive fully-rendered HTML instead of waiting for JavaScript execution (critical for initial indexing and social previews — see [ssr.md](ssr.html)), (2) **Meta Tags** providing title, description, Open Graph, Twitter Cards in HTML `<head>` (controls how pages appear in search results and social shares), (3) **Structured Data** using JSON-LD schema markup describing content semantically (enables rich snippets like star ratings, breadcrumbs, FAQs in search results), (4) **Semantic HTML** with proper heading hierarchy, alt text, ARIA labels (improves accessibility and crawler understanding), (5) **Performance Optimization** via Core Web Vitals (LCP, INP, CLS directly impact rankings since Google's Page Experience update — note that INP replaced FID as the responsiveness metric in March 2024).

### Core Web Vitals

Performance SEO gained massive importance with Google's Page Experience ranking factor prioritizing Core Web Vitals (see also [web.dev's vitals reference](https://web.dev/vitals/) under [References](#references)). LCP (Largest Contentful Paint) <2.5s measures main content visibility—optimize by preloading critical assets, using SSG/SSR for above-fold content (see [ssg.md](ssg.html)), implementing image optimization. INP (Interaction to Next Paint) <200ms measures interactivity responsiveness across the page lifecycle (replacing the older FID metric in 2024)—optimize by code splitting, lazy loading below-fold components, minimizing long JavaScript tasks. CLS (Cumulative Layout Shift) <0.1 prevents jarring layout changes—fix by always specifying image dimensions, reserving space for dynamic content, avoiding inserting content above existing content.

### Metadata & Open Graph

Meta tag implementation requires dynamic per-page values, not static sitewide tags. Homepage needs "Buy Premium Widgets | WidgetCo" title and "Shop our collection of 500+ premium widgets..." description, while product pages need "Widget Pro 3000 - $99.99 | WidgetCo" with specific product descriptions. Next.js `generateMetadata`, React 19's native `<title>`/`<meta>` hoisting, or framework-specific solutions inject tags dynamically based on route/content. Critical tags: title (50-60 chars), description (150-160 chars), canonical URL (prevent duplicate content), Open Graph (og:title, og:description, og:image for Facebook/LinkedIn), Twitter Cards (twitter:card, twitter:image for Twitter previews).

### Structured Data

Structured data transforms search results from plain blue links into rich snippets with images, ratings, prices, breadcrumbs, FAQs. JSON-LD script tags inject schema.org vocabulary describing content types—Product schema includes name/price/availability, Article schema has headline/author/datePublished, Recipe schema shows cooking time/ingredients. Google's Rich Results Test validates markup and previews appearance. Example: Product schema creates search results showing "$99.99 - In Stock (234 reviews)" instead of just plain text description, dramatically improving click-through rates (20-30% boost typical).

### URL Structure & Canonicals

Canonical URLs prevent duplicate content penalties when same content appears at multiple URLs (www vs non-www, trailing slashes, query parameters). Use `<link rel="canonical">` specifying preferred URL. Implement 301 redirects from duplicate URLs to canonical versions. For paginated content, link pages together with prev/next semantics in your navigation. Sitemap generation automates discovery of all indexable pages, especially critical for large SPAs where crawlers might miss dynamically generated routes. Generate XML sitemaps during build listing all URLs with lastmod dates, changefreq hints, priority scores. Submit to Google Search Console for faster indexing. For dynamic content, implement dynamic sitemaps that read your database/CMS and generate XML on demand. Include image sitemaps for image search optimization and video sitemaps for video content discovery.

### hreflang & Internationalization

International sites use hreflang tags indicating language/region variants preventing wrong-language pages ranking in wrong regions. Each localized URL must reference every other variant — including itself — with a matching `<link rel="alternate" hreflang="en-US" href="…">` entry, plus an `x-default` for the fallback. Mismatches (one page lists `fr-CA` but the French page doesn't list back) cause search engines to ignore the cluster entirely.

### Performance & Mobile

Beyond Core Web Vitals, mobile-first indexing means Google primarily uses the mobile version of your site for ranking. Ensure parity between desktop and mobile content (don't hide text behind "read more" toggles that aren't expanded), test with real-device throttling, and prefer responsive images (`srcset` / `<picture>`) over UA-sniffed assets. Pair this with the build/runtime tactics described in [ssg.md](ssg.html) and the runtime work in [ssr.md](ssr.html) for the best result.

## Key Insight

SEO for frontend applications centers on making JavaScript-rendered content discoverable and crawlable by search engines through server-side rendering, semantic HTML, meta tags, structured data (JSON-LD), and Core Web Vitals optimization—transforming dynamic SPAs from invisible black boxes (empty `<div id="root">`) into rich, indexable content that ranks highly in search results and generates engaging social media previews.

## Code Examples

### Basic Example: Next.js App Router `generateMetadata`

Modern App Router pages declare metadata via the async `generateMetadata` export — Next.js renders the `<head>` for you, so there's no `<Head>` component or `pages/_document.js` boilerplate. Cross-reference: [ssr.md](ssr.html) for the rendering pipeline this metadata rides on.

```javascript
// ===== app/layout.js =====
// Root metadata applies to every route unless a child overrides it.

export const metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'YourSite',
    template: '%s | YourSite',
  },
  description: 'Default site description',
  openGraph: {
    siteName: 'YourSite',
    type: 'website',
    images: ['/default-og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@yoursite',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


// ===== app/products/[id]/page.js =====
// Per-route metadata is computed asynchronously from the same data
// the page itself uses — Next dedupes the fetch.

export async function generateMetadata({ params }) {
  const product = await fetchProduct(params.id);
  const url = `/products/${product.id}`;

  return {
    title: `${product.name} - $${product.price}`,
    description: product.description.slice(0, 155),
    alternates: { canonical: url },
    openGraph: {
      type: 'product',
      url,
      title: product.name,
      description: product.description.slice(0, 155),
      images: [product.image],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }) {
  const product = await fetchProduct(params.id);

  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
      <img src={product.image} alt={product.name} />
    </div>
  );
}
```

### Practical Example: Structured Data with JSON-LD

Rich snippets for products, articles, and breadcrumbs:

{% raw %}
```javascript
// ===== components/StructuredData.js =====
export default function StructuredData({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}


// ===== pages/products/[id].js =====
import StructuredData from '@/components/StructuredData';

export default function ProductPage({ product }) {
  // Product Schema
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand
    },
    offers: {
      '@type': 'Offer',
      url: `https://example.com/products/${product.id}`,
      priceCurrency: 'USD',
      price: product.price,
      availability: product.inStock 
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceValidUntil: '2026-12-31'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount
    }
  };
  
  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://example.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.category,
        item: `https://example.com/category/${product.categorySlug}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://example.com/products/${product.id}`
      }
    ]
  };
  
  return (
    <>
      <SEO
        title={`${product.name} | YourSite`}
        description={product.description}
      />
      <StructuredData data={productSchema} />
      <StructuredData data={breadcrumbSchema} />
      
      <ProductView product={product} />
    </>
  );
}


// ===== pages/blog/[slug].js =====
// Article Schema for blog posts

export default function BlogPost({ post }) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: post.coverImage,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: `https://example.com/authors/${post.author.slug}`
    },
    publisher: {
      '@type': 'Organization',
      name: 'YourSite',
      logo: {
        '@type': 'ImageObject',
        url: 'https://example.com/logo.png'
      }
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    description: post.excerpt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://example.com/blog/${post.slug}`
    }
  };
  
  return (
    <>
      <SEO
        title={`${post.title} | Blog`}
        description={post.excerpt}
        image={post.coverImage}
        type="article"
      />
      <StructuredData data={articleSchema} />
      
      <article>
        <h1>{post.title}</h1>
        <time>{post.publishedAt}</time>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </>
  );
}


// ===== FAQ Schema =====
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is your return policy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We accept returns within 30 days of purchase...'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you ship internationally?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we ship to over 50 countries worldwide...'
      }
    }
  ]
};
```
{% endraw %}

### Advanced Example: App Router Sitemap, Robots, and Vitals

App Router exposes file conventions for `sitemap.xml` and `robots.txt`, and the root layout handles preconnect/manifest links — no `pages/_document.js` needed.

```typescript
// ===== app/sitemap.ts =====
// Returning an array of MetadataRoute.Sitemap entries; Next emits sitemap.xml.

import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, products] = await Promise.all([
    fetchAllPosts(),
    fetchAllProducts(),
  ]);

  const staticUrls: MetadataRoute.Sitemap = [
    { url: 'https://example.com', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: 'https://example.com/about', lastModified: '2026-01-01', changeFrequency: 'monthly', priority: 0.8 },
  ];

  const postUrls = posts.map((post) => ({
    url: `https://example.com/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const productUrls = products.map((product) => ({
    url: `https://example.com/products/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...staticUrls, ...postUrls, ...productUrls];
}


// ===== app/robots.ts =====
// File-convention robots.txt — Next serves it at /robots.txt.

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: 'https://example.com/sitemap.xml',
  };
}


// ===== next.config.js =====
// Modern config: no swcMinify (default since 13) and no optimizeFonts (handled by next/font).

module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  headers: async () => [
    {
      source: '/:all*(svg|jpg|png)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
  ],
};


// ===== app/layout.js =====
// Preconnect + manifest live in the root layout's <head>.

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://cdn.example.com" />
        <link rel="dns-prefetch" href="https://analytics.google.com" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## Common Mistakes

### 1. Not Using Unique Titles/Descriptions Per Page
**Mistake:** Same meta tags across all pages.

```javascript
// ❌ BAD: Static SEO on every page
<Head>
  <title>YourSite - Best Products</title>
  <meta name="description" content="Shop our products" />
</Head>
// Google sees duplicate titles/descriptions, hurts rankings
```

```javascript
// ✅ GOOD: Dynamic per-page SEO
<SEO
  title={`${product.name} - $${product.price} | YourSite`}
  description={product.description.substring(0, 155)}
/>
// Each page has unique, relevant metadata
```

**Why it matters:** Duplicate titles confuse search engines about page topics. Unique, descriptive titles improve click-through rates by 20-30%.

### 2. Client-Side Only Rendering for Content
**Mistake:** Rendering content only via JavaScript.

```javascript
// ❌ BAD: CSR without SSR
export default function BlogPost() {
  const [post, setPost] = useState(null);
  
  useEffect(() => {
    fetch(`/api/posts/${slug}`).then(r => r.json()).then(setPost);
  }, []);
  
  return <div>{post?.title}</div>;
}
// Crawlers see empty page, no content indexed
```

```javascript
// ✅ GOOD: SSR/SSG for indexable content (App Router)
export default async function BlogPost({ params }) {
  const post = await fetchPost(params.slug);
  return <h1>{post.title}</h1>;
  // Crawlers receive fully-rendered HTML
}
```

**Why it matters:** Google can execute JavaScript, but SSR/SSG (see [ssr.md](ssr.html), [ssg.md](ssg.html)) guarantees immediate indexing and proper social previews.

### 3. Missing Alt Text on Images
**Mistake:** Images without descriptive alt attributes.

```jsx
// ❌ BAD: No alt text
<img src="/product.jpg" />
// Screen readers can't describe image
// Image search doesn't index
```

```jsx
// ✅ GOOD: Descriptive alt text
<img
  src="/product.jpg"
  alt="Red leather messenger bag with brass buckles"
/>
// Accessible + indexed in image search
```

**Why it matters:** Alt text improves accessibility (WCAG requirement) and drives image search traffic (10-15% of total traffic for e-commerce).

## Quick Quiz

{% include quiz.html id="seo-1"
   question="What's the difference between Open Graph and Twitter Card meta tags?"
   options="A|Only Open Graph is real;;B|They are the same thing;;C|Open Graph (og:*) is Facebook/LinkedIn/Discord's standard for link preview; Twitter Card (twitter:*) is Twitter/X's. Most platforms fall back to og: if twitter: is missing, so you usually set og: for everyone and add a twitter:card type to control Twitter's layout;;D|They only affect SEO rankings"
   correct="C"
   explanation="Share previews (not ranking) are driven by these tags. Set og: as the baseline; twitter: just customises the Twitter-specific appearance." %}

{% include quiz.html id="seo-2"
   question="How does JSON-LD structured data help SEO?"
   options="A|It is deprecated;;B|It only works in Chrome;;C|It describes page content in schema.org vocabulary, enabling rich results in search (stars for reviews, recipe cards, event info, product prices) — higher CTR from SERPs without changing the visible page;;D|It improves page load time"
   correct="C"
   explanation="Google's rich-results eligibility, Knowledge Graph, and voice-assistant answers all key off structured data. JSON-LD is the preferred format because it's non-intrusive (a <script type=&quot;application/ld+json&quot;> block)." %}

{% include quiz.html id="seo-3"
   question="Why are Core Web Vitals important for SEO?"
   options="A|Google uses them as ranking signals (LCP, CLS, INP) via the Page Experience system — slow or janky pages are penalized in competitive queries, and good vitals also improve conversion independent of ranking;;B|They only apply to mobile;;C|They don't affect SEO;;D|Only LCP matters"
   correct="A"
   explanation="Core Web Vitals are an official ranking signal and, crucially, a user-experience signal that correlates with bounce rate and conversion — optimising them helps both SEO and business metrics." %}

{% include quiz.html id="seo-4"
   question="When should you use a canonical tag?"
   options="A|On every page, always pointing at itself;;B|Whenever the same (or substantially similar) content is reachable at multiple URLs — e.g. with/without trailing slash, with query params like ?ref=, printable/non-printable, localised duplicates — to tell search engines which URL is the preferred one and consolidate link equity;;C|To hide a page from search;;D|Only on 404 pages"
   correct="B"
   explanation="Self-referential canonicals on every page are the common safe default, plus explicit canonicals for known duplicates. rel=&quot;canonical&quot; is a hint, not a directive, but it's widely respected." %}

{% include quiz.html id="seo-5"
   question="How do you make client-side-navigated SPA pages SEO-friendly?"
   options="A|SEO doesn't work for SPAs — accept it;;B|Render the initial request server-side (SSR) or at build time (SSG) so crawlers see real HTML + real metadata. On client-side navigation, update the document title and meta tags (react-helmet-async / next/head / <svelte:head>) so each logical &quot;page&quot; has the right SEO metadata even though the app didn't reload;;C|Put keywords in data- attributes;;D|Render an image of the page"
   correct="B"
   explanation="Modern crawlers execute some JS but SSR/SSG gives the best results, fastest and most reliable. Per-route head management ensures each SPA route has proper title/description/canonical." %}

## References

- [Google Search Central — SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) — the canonical overview of crawling, indexing, and best practices.
- [web.dev — Core Web Vitals](https://web.dev/vitals/) — definitions and target thresholds for LCP, INP, and CLS.
- [Schema.org vocabulary](https://schema.org/) — full reference for Product, Article, Recipe, FAQ, BreadcrumbList, and other types.
- [Open Graph Protocol](https://ogp.me/) — the og:* meta-tag spec used by Facebook, LinkedIn, Discord, Slack, and others.
- [Google Rich Results Test](https://search.google.com/test/rich-results) — validate JSON-LD and preview rich snippets before shipping.
- [Next.js — Metadata in the App Router](https://nextjs.org/docs/app/building-your-application/optimizing/metadata) — `generateMetadata`, `app/sitemap.ts`, `app/robots.ts`.
- [Google Search Central — hreflang for international SEO](https://developers.google.com/search/docs/specialty/international/localized-versions) — the bidirectional-link rules for language/region targeting.
