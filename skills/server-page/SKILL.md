---
name: server-page
description: Page components — the thin route-level composition layer that binds a route to a layout template and the containers it hosts. In the elegant SPA templates a page is pure composition (no data fetching); in a Next.js app it additionally invokes getServerSideProps/getStaticProps. Use when creating a new route, composing containers inside a layout, or reviewing whether a page is doing template-level work it shouldn't.
when_to_use: Adding a new route/page file; composing containers inside a layout template; (Next.js only) deciding between getServerSideProps, getStaticProps, and ISR; keeping pages thin and templates dumb.
paths:
  - "**/pages/**/*.{jsx,tsx,vue}"
  - "**/app/**/*.{jsx,tsx}"
---

# Page

## What is a Page?

A page is the thin composition layer that maps a route to a layout template and the containers that fill it. In the elegant SPA templates a page composes containers inside a layout — it does **not** fetch data (the templates are client-side SPAs with no `getServerSideProps`/`getStaticProps`); state reaches the UI through containers. In a Next.js app, a page additionally becomes the data-fetching boundary (`getServerSideProps`/`getStaticProps`) — the pattern below covers both.

```jsx
// src/pages/index.jsx (elegant SPA) — route-level composition of containers in a layout
import SiteHeaderContainer from '../containers/SiteHeaderContainer';
import TodoFiltersContainer from '../containers/TodoFiltersContainer';
import TodoListContainer from '../containers/TodoListContainer';
import Layout from '../ui/templates/Layout/Layout.component';

export default function HomePage() {
  return (
    <Layout>
      <SiteHeaderContainer />
      <TodoListContainer />
      <TodoFiltersContainer />
    </Layout>
  );
}
```

## Key Principles

1. **Template + Containers = Page**: Templates define structure (slots/layout); pages fill those slots with containers (elegant SPA) or fetched data (Next.js). Same template, different pages.

2. **Data Fetching Boundary (Next.js)**: In a Next.js app, pages are where `getServerSideProps`/`getStaticProps` live — pages fetch, templates render. The elegant SPA templates have no such hooks; data flows in via containers instead.

3. **Route Mapping**: Pages correspond to URLs. `/products/[id].js` creates pages for `/products/1`, `/products/2`, etc.

## Best Practices

✅ **DO**:
- Keep pages thin—data fetching + template composition
- Use appropriate rendering strategy (SSR/SSG/ISR) per page
- Handle 404/error cases in data fetching
- Pass only needed props to templates
- Use file-based routing conventions

❌ **DON'T**:
- Put complex UI logic in pages (that's template's job)
- Fetch data in templates (fetch in pages)
- Duplicate template code across pages
- Ignore SEO metadata (title, description)
- Mix rendering strategies inappropriately

## Code Patterns

### Page with SSR

```jsx
// pages/products/[id].js
import ProductTemplate from '@/templates/ProductTemplate';
import { fetchProduct, fetchRelated } from '@/services/productService';

export default function ProductPage({ product, relatedProducts }) {
  return (
    <ProductTemplate
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}

export async function getServerSideProps({ params, res }) {
  const product = await fetchProduct(params.id);
  
  if (!product) {
    return { notFound: true };
  }
  
  // Cache for 60 seconds
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  
  const relatedProducts = await fetchRelated(product.categoryId);
  
  return {
    props: { product, relatedProducts }
  };
}
```

### Page with SSG + ISR

```jsx
// pages/blog/[slug].js
import BlogTemplate from '@/templates/BlogTemplate';

export default function BlogPostPage({ post, author }) {
  return (
    <BlogTemplate
      post={post}
      author={author}
    />
  );
}

export async function getStaticProps({ params }) {
  const post = await fetchPost(params.slug);
  const author = await fetchAuthor(post.authorId);
  
  return {
    props: { post, author },
    revalidate: 300  // Revalidate every 5 minutes
  };
}

export async function getStaticPaths() {
  const posts = await fetchRecentPosts(100);
  
  return {
    paths: posts.map(post => ({ params: { slug: post.slug } })),
    fallback: 'blocking'
  };
}
```

### SEO Metadata

```jsx
// pages/products/[id].js
import Head from 'next/head';

export default function ProductPage({ product }) {
  return (
    <>
      <Head>
        <title>{product.name} | My Store</title>
        <meta name="description" content={product.description} />
        <meta property="og:image" content={product.imageUrl} />
      </Head>
      <ProductTemplate product={product} />
    </>
  );
}
```

## Template vs Page

| Template | Page |
|----------|------|
| Reusable layout | Specific instance |
| Receives props | Fetches data |
| No data fetching | `getServerSideProps`/`getStaticProps` |
| Structure-focused | Content-focused |
| `ProductTemplate` | `/products/iphone-15` |

## Related Terminologies

- **Template** (UI) - Pages fill templates with data
- **SSR/SSG** (Server) - How pages get their data
- **Router** (Server) - Maps URLs to pages
- **Container** (Server) - Pages can use container pattern

## Quality Gates

- [ ] Pages fetch data, templates render
- [ ] Appropriate rendering strategy chosen
- [ ] 404/error cases handled
- [ ] SEO metadata included
- [ ] Props are minimal and focused

**Source**: `/docs/server/page.md`
