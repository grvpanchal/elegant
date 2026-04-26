---
title: Page
layout: doc
slug: page
---

# Page

> - Templates filled with real content and data
> - Where abstract layouts meet actual user-facing content
> - Enables massive scale through template reuse

## Key Insight

Pages are the concrete instances of templates filled with real content—they're where abstract layout patterns meet actual data to create what users see and interact with. A ProductTemplate defines "hero image slot + specs section + reviews area"; a specific iPhone 15 page fills those slots with iPhone photos, A17 chip specs, and real customer reviews. This template-to-page relationship enables massive scale: Amazon serves millions of product pages from a single ProductTemplate by injecting different data, while maintaining consistent UX.

The critical insight is that pages don't redefine layout—they provide props and data to templates. That separation enables parallel workflows (designers refine templates, content teams create data), automated page generation (10,000 product pages from a CMS), and A/B testing (same template, different content variations). In server-side rendering, pages are where data fetching meets rendering: `getServerSideProps` or `getStaticProps` fetch data, pass it to a template as props, and generate HTML.

## Detailed Description

### 1. Pages in Atomic Design Hierarchy

In Brad Frost's Atomic Design methodology, **pages** sit at the top of the composition hierarchy:

**Atoms** → **Molecules** → **Organisms** → **Templates** → **Pages**

Pages are the final, fully-realized instances of templates populated with real, representative content. While templates show *structure* (wireframes with placeholder content), pages show *actual output* (production-ready UI with real data). This distinction is crucial for design systems and component libraries because it separates concerns: templates define reusable layout patterns, pages demonstrate how those patterns look with actual content variations.

Think of templates as cookie cutters and pages as the actual cookies—same shape (template), but each cookie can have different decorations, flavors, or fillings (page content). A BlogPostTemplate might be used by thousands of article pages, each with unique titles, authors, publish dates, and body content, but all sharing the same layout structure.

### 2. Pages vs Templates: The Critical Distinction

The template/page distinction often confuses developers because both render similar UI. The key difference is **content specificity**.

**Templates**:
- Abstract layout patterns
- Use placeholder or sample content
- Props define *types* of data expected: `<ProductTemplate product={Product} />`
- Reusable across many instances
- Designer-facing (shows structure)
- Example: "Product page layout with hero, specs, reviews"

**Pages**:
- Concrete content instances
- Use real production data
- Props pass *actual values*: `<ProductTemplate product={iPhone15Data} />`
- Specific to one route/URL
- User-facing (what visitors see)
- Example: "/products/iphone-15" route with iPhone 15 data

This separation enables **content-agnostic design**: templates work regardless of content variations (short vs long titles, 3 vs 30 product images), while pages test templates with real-world edge cases (product name is 100 characters, review section empty, video embeds fail).

### 3. Pages in Server-Side Rendering (SSR)

In SSR frameworks like Next.js, Nuxt, or SvelteKit, pages are where **data fetching meets rendering**:

```javascript
// Page component (Next.js)
export default function ProductPage({ product }) {
  return <ProductTemplate product={product} />;
}

// Server-side data fetching
export async function getServerSideProps(context) {
  const { id } = context.params;
  const product = await fetch(`/api/products/${id}`).then(r => r.json());
  
  return { props: { product } };
}
```

The **page file** (`pages/products/[id].js`) defines:
1. **Route pattern**: `/products/:id` maps to this file
2. **Data dependencies**: `getServerSideProps` specifies what data is needed
3. **Template selection**: Chooses ProductTemplate (or CheckoutTemplate, ProfileTemplate, etc.)
4. **Props passing**: Injects fetched data into template

The **template** (`ProductTemplate.jsx`) remains pure presentation logic—it doesn't know where data comes from (API, database, static file), only that it receives a product object with expected shape.

### 4. Static Site Generation (SSG) and Pages

For SSG, pages become **build-time artifacts**. The framework pre-renders every page to static HTML:

```javascript
// Generate static pages at build time
export async function getStaticPaths() {
  const products = await fetchAllProducts();
  
  return {
    paths: products.map(p => ({ params: { id: p.id } })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const product = await fetchProduct(params.id);
  return { props: { product } };
}
```

At build time, this generates:
- `/products/iphone-15.html`
- `/products/macbook-pro.html`
- `/products/airpods-max.html`
- ... (thousands more)

All from a single template. The **page file defines the pattern**, `getStaticPaths` defines **which pages to generate**, `getStaticProps` fetches **data for each page**.

### 5. Pages and Dynamic Routing

Pages often map to URL patterns using dynamic routing:

**Next.js**:
- `pages/products/[id].js` → `/products/123`, `/products/456`
- `pages/blog/[year]/[month]/[slug].js` → `/blog/2024/01/my-post`
- `pages/[...catch-all].js` → Matches any route

**File-based routing** treats the filesystem as the router—adding a page file automatically creates a route. This makes pages the **entry point** for URL patterns, responsible for loading the correct template and data.

### 6. Pages in Content Management Systems (CMS)

When using a headless CMS (Contentful, Sanity, Strapi), pages become the **bridge between CMS and frontend**:

```javascript
// CMS-driven page
export default function CMSPage({ pageData }) {
  // Choose template based on CMS content type
  switch (pageData.contentType) {
    case 'product':
      return <ProductTemplate {...pageData} />;
    case 'article':
      return <ArticleTemplate {...pageData} />;
    case 'landing-page':
      return <LandingTemplate {...pageData} />;
    default:
      return <GenericTemplate {...pageData} />;
  }
}

export async function getStaticProps({ params }) {
  const pageData = await cms.getEntry(params.slug);
  return { props: { pageData } };
}
```

Content editors create pages in the CMS (no code), developers build templates (code), and the page component orchestrates the connection. This enables **marketing autonomy**—content teams create landing pages without developer involvement, as long as they use existing templates.

### 7. Page-Level Concerns

Pages handle concerns that don't belong in templates:

**SEO Metadata**:
```javascript
import Head from 'next/head';

export default function ProductPage({ product }) {
  return (
    <>
      <Head>
        <title>{product.name} - Buy Now</title>
        <meta name="description" content={product.description} />
        <meta property="og:image" content={product.image} />
      </Head>
      <ProductTemplate product={product} />
    </>
  );
}
```

**Analytics & Tracking**:
```javascript
useEffect(() => {
  analytics.page('Product Viewed', { productId: product.id });
}, [product.id]);
```

**Authentication Guards**:
```javascript
export default function AccountPage({ user }) {
  if (!user) {
    return <Redirect to="/login" />;
  }
  return <AccountTemplate user={user} />;
}
```

**Error Boundaries**:
```javascript
export default function ProductPage({ product, error }) {
  if (error) {
    return <ErrorTemplate error={error} />;
  }
  return <ProductTemplate product={product} />;
}
```

### 8. Multi-Template Pages

Complex pages may compose multiple templates:

```javascript
export default function CheckoutPage({ cart, user, shippingOptions }) {
  return (
    <MainLayout>
      <CartSummaryTemplate items={cart.items} />
      <ShippingFormTemplate 
        user={user} 
        options={shippingOptions} 
      />
      <PaymentTemplate />
    </MainLayout>
  );
}
```

The page orchestrates which templates render and how they interact, while templates remain isolated and reusable.

### 9. Page Performance Optimization

Pages are the **performance bottleneck**—they coordinate data fetching, template rendering, and client-side hydration:

**Code Splitting**: Import templates dynamically:
```javascript
const ProductTemplate = lazy(() => import('./ProductTemplate'));
```

**Preloading**: Prefetch data for likely next pages:
```javascript
<Link href="/products/123" prefetch>View Product</Link>
```

**Streaming SSR**: Send page shell first, stream data as it loads:
```javascript
export async function getServerSideProps() {
  return {
    props: {
      fallback: { '/api/product': productDataPromise }
    }
  };
}
```

## Code Examples

### Example 1: Basic Next.js Page with Template

```javascript
// pages/products/[id].js (Page component)
import { useRouter } from 'next/router';
import ProductTemplate from '../../components/templates/ProductTemplate';
import ErrorTemplate from '../../components/templates/ErrorTemplate';
import LoadingTemplate from '../../components/templates/LoadingTemplate';
import Head from 'next/head';

export default function ProductPage({ product, error }) {
  const router = useRouter();
  
  // Show loading state during client-side navigation
  if (router.isFallback) {
    return <LoadingTemplate />;
  }
  
  // Handle errors
  if (error) {
    return (
      <>
        <Head>
          <title>Product Not Found</title>
        </Head>
        <ErrorTemplate 
          title="Product Not Found"
          message={error.message}
          statusCode={404}
        />
      </>
    );
  }
  
  // Success: render product template with data
  return (
    <>
      <Head>
        <title>{product.name} | Buy Online</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.name} />
        <meta property="og:image" content={product.images[0]} />
        <meta property="og:price:amount" content={product.price} />
        <link rel="canonical" href={`https://example.com/products/${product.id}`} />
      </Head>
      
      <ProductTemplate 
        product={product}
        onAddToCart={(id) => {
          // Page-level business logic
          fetch('/api/cart', {
            method: 'POST',
            body: JSON.stringify({ productId: id })
          });
        }}
      />
    </>
  );
}

// Server-side data fetching
export async function getServerSideProps(context) {
  const { id } = context.params;
  
  try {
    const response = await fetch(`https://api.example.com/products/${id}`);
    
    if (!response.ok) {
      return {
        props: {
          error: {
            message: 'Product not found',
            statusCode: 404
          }
        }
      };
    }
    
    const product = await response.json();
    
    return {
      props: { product }
    };
  } catch (error) {
    return {
      props: {
        error: {
          message: 'Failed to load product',
          statusCode: 500
        }
      }
    };
  }
}

// components/templates/ProductTemplate.jsx (Template component)
import React from 'react';
import ProductHero from '../organisms/ProductHero';
import ProductSpecs from '../organisms/ProductSpecs';
import ProductReviews from '../organisms/ProductReviews';
import RelatedProducts from '../organisms/RelatedProducts';

export default function ProductTemplate({ product, onAddToCart }) {
  return (
    <div className="product-template">
      <ProductHero 
        name={product.name}
        images={product.images}
        price={product.price}
        onAddToCart={() => onAddToCart(product.id)}
      />
      
      <ProductSpecs specs={product.specs} />
      
      <ProductReviews 
        reviews={product.reviews}
        rating={product.averageRating}
      />
      
      <RelatedProducts 
        category={product.category}
        excludeId={product.id}
      />
    </div>
  );
}
```

### Example 2: Static Site Generation with Multiple Pages

```javascript
// pages/blog/[year]/[month]/[slug].js
import BlogPostTemplate from '../../../../components/templates/BlogPostTemplate';
import Head from 'next/head';
import { format } from 'date-fns';

export default function BlogPostPage({ post, relatedPosts }) {
  const publishDate = format(new Date(post.publishedAt), 'MMMM d, yyyy');
  
  return (
    <>
      <Head>
        <title>{post.title} | Tech Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta name="author" content={post.author.name} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:image" content={post.featuredImage} />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:author" content={post.author.name} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Head>
      
      <BlogPostTemplate 
        title={post.title}
        author={post.author}
        publishDate={publishDate}
        content={post.content}
        featuredImage={post.featuredImage}
        tags={post.tags}
        relatedPosts={relatedPosts}
      />
    </>
  );
}

// Generate all blog post pages at build time
export async function getStaticPaths() {
  // Fetch all blog posts from CMS/database
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  
  // Generate path for each post
  const paths = posts.map(post => {
    const date = new Date(post.publishedAt);
    return {
      params: {
        year: date.getFullYear().toString(),
        month: (date.getMonth() + 1).toString().padStart(2, '0'),
        slug: post.slug
      }
    };
  });
  
  return {
    paths,
    fallback: 'blocking' // Generate new pages on-demand
  };
}

// Fetch data for each page at build time
export async function getStaticProps({ params }) {
  const { year, month, slug } = params;
  
  // Fetch post data
  const post = await fetch(
    `https://api.example.com/posts/${year}/${month}/${slug}`
  ).then(r => r.json());
  
  // Fetch related posts
  const relatedPosts = await fetch(
    `https://api.example.com/posts/related?tags=${post.tags.join(',')}&limit=3`
  ).then(r => r.json());
  
  return {
    props: {
      post,
      relatedPosts
    },
    revalidate: 3600 // Regenerate page every hour
  };
}
```

### Example 3: CMS-Driven Dynamic Page Selection

```javascript
// pages/[[...slug]].js (Catch-all route for CMS pages)
import { getPageBySlug } from '../lib/cms';
import ProductTemplate from '../components/templates/ProductTemplate';
import ArticleTemplate from '../components/templates/ArticleTemplate';
import LandingTemplate from '../components/templates/LandingTemplate';
import TeamTemplate from '../components/templates/TeamTemplate';
import Head from 'next/head';

// Template registry
const templates = {
  product: ProductTemplate,
  article: ArticleTemplate,
  landing: LandingTemplate,
  team: TeamTemplate
};

export default function DynamicPage({ pageData, preview }) {
  // Select template based on CMS content type
  const Template = templates[pageData.contentType];
  
  if (!Template) {
    return <div>Unknown content type: {pageData.contentType}</div>;
  }
  
  return (
    <>
      <Head>
        <title>{pageData.meta.title}</title>
        <meta name="description" content={pageData.meta.description} />
        {pageData.meta.keywords && (
          <meta name="keywords" content={pageData.meta.keywords} />
        )}
        {preview && <meta name="robots" content="noindex" />}
      </Head>
      
      {preview && (
        <div className="preview-banner">
          Preview Mode - <a href="/api/exit-preview">Exit</a>
        </div>
      )}
      
      <Template {...pageData.content} />
    </>
  );
}

export async function getStaticPaths() {
  const pages = await fetch('https://cms.example.com/api/pages').then(r => r.json());
  
  const paths = pages.map(page => ({
    params: { slug: page.slug.split('/').filter(Boolean) }
  }));
  
  return {
    paths: [
      { params: { slug: [] } }, // Homepage
      ...paths
    ],
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params, preview = false }) {
  const slug = params.slug ? params.slug.join('/') : '';
  
  try {
    const pageData = await getPageBySlug(slug, preview);
    
    if (!pageData) {
      return { notFound: true };
    }
    
    return {
      props: {
        pageData,
        preview
      },
      revalidate: preview ? 1 : 60
    };
  } catch (error) {
    console.error('Failed to fetch page:', error);
    return { notFound: true };
  }
}

// lib/cms.js
export async function getPageBySlug(slug, preview = false) {
  const endpoint = preview 
    ? 'https://cms.example.com/api/preview'
    : 'https://cms.example.com/api/pages';
  
  const response = await fetch(`${endpoint}/${slug}`);
  
  if (!response.ok) {
    return null;
  }
  
  const data = await response.json();
  
  return {
    contentType: data.type, // 'product', 'article', etc.
    meta: {
      title: data.seo.title,
      description: data.seo.description,
      keywords: data.seo.keywords
    },
    content: data.fields // Template-specific data
  };
}
```

## Common Mistakes

### 1. Putting Business Logic in Templates Instead of Pages

❌ **Wrong**: Template fetches its own data, contains authentication logic.

```javascript
// components/templates/ProductTemplate.jsx (BAD)
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function ProductTemplate({ productId }) {
  const [product, setProduct] = useState(null);
  const { user, isAuthenticated } = useAuth();
  
  // ❌ Template shouldn't fetch data
  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then(r => r.json())
      .then(setProduct);
  }, [productId]);
  
  // ❌ Template shouldn't handle auth logic
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  if (!product) return <div>Loading...</div>;
  
  return <div>{product.name}</div>;
}

// pages/products/[id].js (BAD)
export default function ProductPage({ productId }) {
  // ❌ Page just passes ID, template does everything
  return <ProductTemplate productId={productId} />;
}
```

✅ **Correct**: Page handles data fetching and auth, template remains pure presentation.

```javascript
// pages/products/[id].js (GOOD)
export default function ProductPage({ product, user }) {
  // ✅ Page handles authentication
  if (!user) {
    return <Redirect to="/login" />;
  }
  
  // ✅ Page passes fetched data to template
  return <ProductTemplate product={product} />;
}

export async function getServerSideProps(context) {
  // ✅ Page handles data fetching
  const product = await fetchProduct(context.params.id);
  const user = await getUser(context.req);
  
  return { props: { product, user } };
}

// components/templates/ProductTemplate.jsx (GOOD)
export default function ProductTemplate({ product }) {
  // ✅ Template is pure presentation - receives data via props
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>
    </div>
  );
}
```

**Why it matters**: Mixing data fetching and presentation in templates makes them impossible to reuse. A ProductTemplate that fetches its own data can't be dropped into a CartPreview or SearchResults component. Pages should orchestrate (fetch data, check auth); templates should present (receive props, render UI).

### 2. Not Using SEO Metadata Per Page

❌ **Wrong**: Generic SEO metadata in layout, same for all pages.

```javascript
// _app.js (BAD)
export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* ❌ Same title/description for all pages */}
        <title>My E-commerce Store</title>
        <meta name="description" content="Buy products online" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

// Result: Google shows "My E-commerce Store" for all pages
// iPhone page: "My E-commerce Store"
// Laptop page: "My E-commerce Store"
// Cart page: "My E-commerce Store"
```

✅ **Correct**: Page-specific SEO metadata.

```javascript
// pages/products/[id].js (GOOD)
export default function ProductPage({ product }) {
  return (
    <>
      <Head>
        {/* ✅ Unique title per product */}
        <title>{product.name} - Buy Online | My Store</title>
        
        {/* ✅ Product-specific description */}
        <meta name="description" content={product.description} />
        
        {/* ✅ Product-specific Open Graph tags */}
        <meta property="og:title" content={product.name} />
        <meta property="og:image" content={product.images[0]} />
        <meta property="og:price:amount" content={product.price} />
        
        {/* ✅ Canonical URL */}
        <link rel="canonical" href={`https://example.com/products/${product.slug}`} />
      </Head>
      
      <ProductTemplate product={product} />
    </>
  );
}

// Result: Google shows unique title/description for each product
// iPhone page: "iPhone 15 Pro - Buy Online | My Store"
// Laptop page: "MacBook Pro M3 - Buy Online | My Store"
```

**Why it matters**: SEO is a page-level concern. Google indexes pages, not templates. Without unique metadata, all product pages compete for the same keywords and hurt each other's search rankings. Each page should have a unique title, description, and Open Graph tags based on its content.

### 3. Duplicating Layout Code Across Pages

❌ **Wrong**: Every page duplicates header/footer/navigation.

```javascript
// pages/products/[id].js (BAD)
export default function ProductPage({ product }) {
  return (
    <div>
      {/* ❌ Duplicated in every page */}
      <Header />
      <Navigation />
      
      <ProductTemplate product={product} />
      
      {/* ❌ Duplicated in every page */}
      <Footer />
    </div>
  );
}

// pages/blog/[slug].js (BAD)
export default function BlogPage({ post }) {
  return (
    <div>
      {/* ❌ Same header/footer duplicated */}
      <Header />
      <Navigation />
      
      <BlogTemplate post={post} />
      
      <Footer />
    </div>
  );
}
```

✅ **Correct**: Use layout component to wrap pages.

```javascript
// components/layouts/MainLayout.jsx (GOOD)
export default function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Header />
      <Navigation />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

// pages/products/[id].js (GOOD)
import MainLayout from '../../components/layouts/MainLayout';

export default function ProductPage({ product }) {
  return <ProductTemplate product={product} />;
}

ProductPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

// _app.js
export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  
  return getLayout(<Component {...pageProps} />);
}
```

**Why it matters**: Duplicating layout across pages violates the DRY principle. When you need to update the header, you must change 50 page files. Layout components centralize common structure while still allowing per-page customization (different layouts for admin vs public pages).

## Quiz

{% include quiz.html
  id="page-1"
  question="What's the fundamental difference between a page and a template?"
  options="A: Pages are styled while templates are unstyled wireframes;;B: Templates handle routing while pages handle layout;;C: A page binds a template to specific data and a route, while a template is an abstract, reusable layout pattern;;D: Pages and templates are interchangeable terms for the same concept"
  correct="C"
  explanation="A template defines an abstract, reusable layout (e.g. ProductTemplate's hero/specs/reviews structure). A page is the concrete instance: it owns a route, fetches the data, and feeds that data into the template. The same template can back thousands of pages."
%}

{% include quiz.html
  id="page-2"
  question="Where should data fetching live in a page/template architecture?"
  options="A: Inside the template, so each template owns its own data;;B: Inside leaf atoms and molecules so they fetch what they render;;C: At the page level via loaders such as getServerSideProps, getStaticProps, or a route loader, which then pass data into the template as props;;D: In a global singleton store that templates read from directly"
  correct="C"
  explanation="Data fetching is a page-level concern. The page (route) runs the loader (getServerSideProps / getStaticProps / loadPage / route loader), and passes the resulting data into a pure presentational template. This keeps templates reusable across different data sources."
%}

{% include quiz.html
  id="page-3"
  question="Who should own SEO metadata (title, description, Open Graph tags) in an SSR app?"
  options="A: A single global _app/layout component, so every route shares one title and description;;B: The template, since templates know what content they render;;C: Each page sets its own title, description, and Open Graph tags because metadata is route-specific;;D: The CDN, via response headers"
  correct="C"
  explanation="SEO metadata is route-specific: Google indexes pages, not templates. Each page should set its own <title>, meta description, and Open Graph tags based on the data it loaded. A single global title across every route causes pages to compete for the same keywords."
%}

{% include quiz.html
  id="page-4"
  question="A product page can't find the requested product. Which response is the soft-404 antipattern?"
  options="A: Return HTTP 404 with a helpful 'Not Found' template;;B: Return HTTP 200 with a 'Product not found' UI rendered in the normal layout;;C: Use Next.js's notFound: true from getServerSideProps;;D: Redirect to a category page with HTTP 301"
  correct="B"
  explanation="Returning HTTP 200 with 'not found' content is the classic soft-404: search engines see a successful response and index the empty page. The correct behavior is to return a real 404 status (e.g. notFound: true in Next.js) so crawlers, caches, and analytics treat it as missing."
%}

{% include quiz.html
  id="page-5"
  question="In a file-based router like Next.js, how do you declare a dynamic route that matches /products/iphone-15, /products/macbook, etc.?"
  options="A: Create products.jsx and parse the URL manually inside the component;;B: Register the route in a central routes.config.js file;;C: Use a bracketed filename such as pages/[slug].jsx, pages/products/[slug].jsx, or app/products/[slug]/page.jsx;;D: Add a regex to next.config.js under rewrites"
  correct="C"
  explanation="File-based routers treat the filesystem as the route table. A bracketed segment in the filename (pages/[slug].jsx, pages/products/[slug].jsx, or app/products/[slug]/page.jsx) declares a dynamic parameter. The framework parses the URL and exposes the value via params/router."
%}

## References

- [Atomic Design Pages - Brad Frost](https://atomicdesign.bradfrost.com/chapter-2/#pages)
- [Next.js Pages and Routing](https://nextjs.org/docs/basic-features/pages)
- [Next.js Data Fetching](https://nextjs.org/docs/basic-features/data-fetching/overview)
- [Nuxt Pages Directory](https://nuxt.com/docs/guide/directory-structure/pages)
- [SvelteKit Routing](https://kit.svelte.dev/docs/routing)
