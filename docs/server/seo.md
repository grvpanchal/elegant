---
title: Search Engine Optimization
layout: doc
slug: seo
---

# Search Engine Optimization

## Key Insight

SEO for frontend applications centers on making JavaScript-rendered content discoverable and crawlable by search engines through server-side rendering, semantic HTML, meta tags, structured data (JSON-LD), and Core Web Vitals optimization—transforming dynamic SPAs from invisible black boxes (empty `<div id="root">`) into rich, indexable content that ranks highly in search results and generates engaging social media previews.

## Detailed Description

Search Engine Optimization in modern frontend architecture solves a fundamental conflict: search engines prefer fast-loading, semantic HTML with clear content hierarchy, while modern SPAs prioritize rich interactivity through JavaScript frameworks. Without proper SEO implementation, Google's crawler sees `<div id="root"></div>` and nothing more—your beautifully designed React app is invisible to search engines, social media previews show blank pages, and organic traffic remains zero despite excellent content.

The core SEO pillars for frontend applications: (1) **Server-Side Rendering** ensuring crawlers receive fully-rendered HTML instead of waiting for JavaScript execution (critical for initial indexing and social previews), (2) **Meta Tags** providing title, description, Open Graph, Twitter Cards in HTML `<head>` (controls how pages appear in search results and social shares), (3) **Structured Data** using JSON-LD schema markup describing content semantically (enables rich snippets like star ratings, breadcrumbs, FAQs in search results), (4) **Semantic HTML** with proper heading hierarchy, alt text, ARIA labels (improves accessibility and crawler understanding), (5) **Performance Optimization** via Core Web Vitals (LCP, FID, CLS directly impact rankings since Google's Page Experience update).

Meta tag implementation requires dynamic per-page values, not static sitewide tags. Homepage needs "Buy Premium Widgets | WidgetCo" title and "Shop our collection of 500+ premium widgets..." description, while product pages need "Widget Pro 3000 - $99.99 | WidgetCo" with specific product descriptions. Next.js `<Head>` component, React Helmet, or framework-specific solutions inject tags dynamically based on route/content. Critical tags: title (50-60 chars), description (150-160 chars), canonical URL (prevent duplicate content), Open Graph (og:title, og:description, og:image for Facebook/LinkedIn), Twitter Cards (twitter:card, twitter:image for Twitter previews).

Structured data transforms search results from plain blue links into rich snippets with images, ratings, prices, breadcrumbs, FAQs. JSON-LD script tags inject schema.org vocabulary describing content types—Product schema includes name/price/availability, Article schema has headline/author/datePublished, Recipe schema shows cooking time/ingredients. Google's Rich Results Test validates markup and previews appearance. Example: Product schema creates search results showing "$99.99 - In Stock ⭐⭐⭐⭐⭐ (234 reviews)" instead of just plain text description, dramatically improving click-through rates (20-30% boost typical).

Performance SEO gained massive importance with Google's Page Experience ranking factor prioritizing Core Web Vitals. LCP (Largest Contentful Paint) <2.5s measures main content visibility—optimize by preloading critical assets, using SSG/SSR for above-fold content, implementing image optimization. FID (First Input Delay) <100ms measures interactivity responsiveness—optimize by code splitting, lazy loading below-fold components, minimizing JavaScript execution. CLS (Cumulative Layout Shift) <0.1 prevents jarring layout changes—fix by always specifying image dimensions, reserving space for dynamic content, avoiding inserting content above existing content.

Sitemap generation automates discovery of all indexable pages, especially critical for large SPAs where crawlers might miss dynamically generated routes. Generate XML sitemaps during build listing all URLs with lastmod dates, changefreq hints, priority scores. Submit to Google Search Console for faster indexing. For dynamic content, implement dynamic sitemaps via API routes reading database/CMS and generating XML on-the-fly. Include image sitemaps for image search optimization and video sitemaps for video content discovery.

Canonical URLs prevent duplicate content penalties when same content appears at multiple URLs (www vs non-www, trailing slashes, query parameters). Use `<link rel="canonical">` specifying preferred URL. Implement 301 redirects from duplicate URLs to canonical versions. For paginated content, use rel="next"/rel="prev" linking pages together. International sites use hreflang tags indicating language/region variants preventing wrong-language pages ranking in wrong regions.

## Code Examples

### Basic Example: Next.js SEO Component

Reusable SEO component with meta tags and Open Graph:

```javascript
// ===== components/SEO.js =====
import Head from 'next/head';

export default function SEO({
  title = 'Default Site Title',
  description = 'Default site description',
  image = '/default-og-image.jpg',
  url,
  type = 'website'
}) {
  const siteName = 'YourSite';
  const twitterHandle = '@yoursite';
  
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      
      {/* Canonical URL */}
      {url && <link rel="canonical" href={url} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:creator" content={twitterHandle} />
      
      {/* Robots */}
      <meta name="robots" content="index, follow" />
    </Head>
  );
}


// ===== pages/products/[id].js =====
export default function ProductPage({ product }) {
  const productUrl = `https://example.com/products/${product.id}`;
  const productImage = `https://example.com${product.image}`;
  
  return (
    <>
      <SEO
        title={`${product.name} - $${product.price} | YourSite`}
        description={product.description.substring(0, 155)}
        image={productImage}
        url={productUrl}
        type="product"
      />
      
      <div>
        <h1>{product.name}</h1>
        <p>${product.price}</p>
        <img src={product.image} alt={product.name} />
      </div>
    </>
  );
}

export async function getStaticProps({ params }) {
  const product = await fetchProduct(params.id);
  return { props: { product } };
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

### Advanced Example: Dynamic Sitemap Generation

XML sitemap with automatic updates:

```javascript
// ===== pages/sitemap.xml.js =====
// Dynamic sitemap generation

function generateSiteMap(posts, products) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static pages -->
  <url>
    <loc>https://example.com</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <lastmod>2026-01-01T00:00:00.000Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Dynamic blog posts -->
  ${posts.map(post => `
  <url>
    <loc>https://example.com/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  `).join('')}
  
  <!-- Dynamic products -->
  ${products.map(product => `
  <url>
    <loc>https://example.com/products/${product.id}</loc>
    <lastmod>${product.updatedAt}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  `).join('')}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  // Fetch all posts and products
  const [posts, products] = await Promise.all([
    fetchAllPosts(),
    fetchAllProducts()
  ]);
  
  const sitemap = generateSiteMap(posts, products);
  
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  res.write(sitemap);
  res.end();
  
  return { props: {} };
}

export default function SitemapPage() {
  // This component never renders
  return null;
}


// ===== robots.txt =====
// pages/robots.txt.js

export async function getServerSideProps({ res }) {
  const robotsTxt = `
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: https://example.com/sitemap.xml
`.trim();
  
  res.setHeader('Content-Type', 'text/plain');
  res.write(robotsTxt);
  res.end();
  
  return { props: {} };
}

export default function RobotsPage() {
  return null;
}


// ===== Core Web Vitals Optimization =====
// next.config.js

module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Enable SWC minification for faster builds
  swcMinify: true,
  
  // Optimize fonts
  optimizeFonts: true,
  
  headers: async () => [
    {
      source: '/:all*(svg|jpg|png)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
};


// ===== Preconnect to external domains =====
// pages/_document.js

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect to improve loading speed */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://cdn.example.com" />
        <link rel="dns-prefetch" href="https://analytics.google.com" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Manifest for PWA */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#000000" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
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
// ✅ GOOD: SSR/SSG for indexable content
export async function getStaticProps({ params }) {
  const post = await fetchPost(params.slug);
  return { props: { post } };
}

export default function BlogPost({ post }) {
  return <h1>{post.title}</h1>;
  // Crawlers receive fully-rendered HTML
}
```

**Why it matters:** Google can execute JavaScript, but SSR guarantees immediate indexing and proper social previews.

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

<details>
<summary><strong>Question 1:</strong> What's the difference between Open Graph and Twitter Card meta tags?</summary>

**Answer:**

**Open Graph (og:):**
- Created by Facebook
- Used by Facebook, LinkedIn, Pinterest, WhatsApp
- Tags: `og:title`, `og:description`, `og:image`, `og:url`

**Twitter Cards (twitter:):**
- Created by Twitter
- Used exclusively by Twitter
- Falls back to Open Graph if twitter: tags missing
- Tags: `twitter:card`, `twitter:title`, `twitter:image`

**Best practice:** Include both for maximum compatibility

```html
<!-- Open Graph -->
<meta property="og:title" content="Page Title" />
<meta property="og:image" content="/og-image.jpg" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="/twitter-image.jpg" />
```

**Why it matters:** Proper social tags create rich previews when shared, increasing click-through rates by 40-50%.
</details>

<details>
<summary><strong>Question 2:</strong> How does JSON-LD structured data improve SEO?</summary>

**Answer:** JSON-LD enables **rich snippets** in search results:

**Without structured data:**
```
Blue link: "Widget Pro 3000"
Plain text: "Shop our premium widget..."
```

**With Product schema:**
```
Widget Pro 3000 - $99.99
⭐⭐⭐⭐⭐ 234 reviews - In Stock
Shop our premium widget...
```

**Benefits:**
- Higher click-through rate (20-30% increase)
- More prominent search appearance
- Eligible for Google Shopping, price drops
- Better voice search results

**Implementation:**
```javascript
const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  offers: {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: 'USD'
  }
};
```

**Validate:** Use Google's Rich Results Test to verify markup.
</details>

<details>
<summary><strong>Question 3:</strong> Why are Core Web Vitals important for SEO?</summary>

**Answer:** Core Web Vitals are **direct ranking factors** since Google's Page Experience update (June 2021):

**Three metrics:**

1. **LCP (Largest Contentful Paint):** <2.5s
   - Measures loading performance
   - Optimize: SSR/SSG, image optimization, CDN

2. **FID (First Input Delay):** <100ms
   - Measures interactivity responsiveness
   - Optimize: Code splitting, reduce JavaScript

3. **CLS (Cumulative Layout Shift):** <0.1
   - Prevents layout jumps
   - Optimize: Specify image dimensions, reserve space

**Impact:**
- Poor vitals = lower rankings
- Good vitals = ranking boost
- Mobile especially critical (mobile-first indexing)

**Monitor:** Google Search Console → Core Web Vitals report
</details>

<details>
<summary><strong>Question 4:</strong> When should you use canonical tags?</summary>

**Answer:** Use `<link rel="canonical">` to prevent duplicate content penalties:

**Use cases:**

1. **Multiple URLs, same content:**
```html
<!-- All these point to canonical version -->
http://example.com/product
https://example.com/product
www.example.com/product
example.com/product?ref=email

<!-- Canonical tag on all versions: -->
<link rel="canonical" href="https://example.com/product" />
```

2. **Pagination:**
```html
<!-- Page 2 of blog listing -->
<link rel="canonical" href="https://example.com/blog" />
```

3. **Syndicated content:**
```html
<!-- Content republished from original source -->
<link rel="canonical" href="https://originalsource.com/article" />
```

**Don't use when:** Content is actually different (product variations, localized versions use hreflang instead).

**Why it matters:** Prevents Google from splitting ranking signals across duplicate URLs, concentrating authority on preferred version.
</details>

<details>
<summary><strong>Question 5:</strong> How do you implement SEO for client-side navigation in SPAs?</summary>

**Answer:**

**Problem:** SPA navigation doesn't reload page → meta tags don't update

**Solution:** Dynamic meta tag updates on route change

**Next.js approach:**
```javascript
// Automatic per-page meta via getStaticProps
export async function getStaticProps() {
  return {
    props: {
      seo: {
        title: "Page Title",
        description: "Page description"
      }
    }
  };
}

function Page({ seo }) {
  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Head>
      <Content />
    </>
  );
}
```

**React Router approach:**
```javascript
import { Helmet } from 'react-helmet';

function ProductPage({ product }) {
  return (
    <>
      <Helmet>
        <title>{product.name} | Shop</title>
        <meta name="description" content={product.description} />
      </Helmet>
      <ProductView product={product} />
    </>
  );
}
```

**Key:** Meta tags update on client navigation, maintaining SEO for deep links and social shares.
</details>

## References

- [Google Search Central SEO Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org Structured Data](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
