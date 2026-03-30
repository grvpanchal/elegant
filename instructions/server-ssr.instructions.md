---
description: Guidance for SSR - Server-Side Rendering for performance and SEO
name: SSR - Server
applyTo: |
  **/pages/**/*.{jsx,tsx,vue}
  **/server/**/*.{js,ts}
  **/*ssr*.{js,ts}
---

# SSR Instructions

## What is Server-Side Rendering?

SSR generates fully-rendered HTML on the server for each request, delivering complete content instantly instead of blank pages that wait for JavaScript. It improves perceived performance (3-10x faster) and enables SEO.

## Key Principles

1. **Server Renders, Client Hydrates**: Server generates HTML string, client "hydrates" it to make interactive. Same component code runs on both server and client.

2. **Data Fetching on Server**: Use `getServerSideProps` (Next.js) or equivalent to fetch data before rendering. Page receives data as props.

3. **Time to First Paint**: Users see content immediately without waiting for JavaScript bundle to download, parse, and execute.

## Best Practices

✅ **DO**:
- Use SSR for SEO-critical and dynamic content pages
- Fetch data in server-side functions (`getServerSideProps`)
- Serialize state for hydration (avoid mismatches)
- Consider streaming SSR for large pages
- Cache SSR responses when possible

❌ **DON'T**:
- Use SSR for highly personalized, non-SEO pages (use CSR)
- Access browser APIs (window, document) during server render
- Forget hydration mismatch issues
- Over-use SSR when SSG would work (SSG is faster)
- Ignore server CPU costs per request

## Code Patterns

### Next.js SSR Pattern

```jsx
// pages/products/[id].js
export default function ProductPage({ product }) {
  return (
    <ProductTemplate
      hero={<ProductHero images={product.images} />}
      info={<ProductInfo data={product} />}
      reviews={<ReviewSection productId={product.id} />}
    />
  );
}

// Runs on server for EVERY request
export async function getServerSideProps({ params }) {
  const product = await fetch(`${API_URL}/products/${params.id}`)
    .then(r => r.json());
  
  if (!product) {
    return { notFound: true };
  }
  
  return {
    props: { product }  // Passed to component
  };
}
```

### Express SSR Setup

```javascript
// server.js
import express from 'express';
import { renderToString } from 'react-dom/server';
import App from './App';

const app = express();

app.get('*', async (req, res) => {
  // Fetch data on server
  const data = await fetchData(req.url);
  
  // Render to HTML string
  const html = renderToString(<App data={data} />);
  
  res.send(`
    <!DOCTYPE html>
    <html>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify(data)};
        </script>
        <script src="/client.js"></script>
      </body>
    </html>
  `);
});
```

### Client Hydration

```javascript
// client.js
import { hydrateRoot } from 'react-dom/client';
import App from './App';

// Reuse server data to avoid flash
const data = window.__INITIAL_DATA__;

hydrateRoot(
  document.getElementById('root'),
  <App data={data} />
);
```

## SSR vs SSG Decision

| Factor | SSR | SSG |
|--------|-----|-----|
| Data freshness | Real-time | Build-time |
| Performance | Good (server render) | Best (static CDN) |
| Server cost | Per request | Build only |
| Use case | Dynamic/personalized | Static content |

## Related Terminologies

- **Page** (Server) - Pages implement SSR data fetching
- **Template** (UI) - SSR fills templates with data
- **SSG** (Server) - Alternative: build-time rendering
- **Hydration** - Client-side activation of SSR HTML

## Quality Gates

- [ ] Data fetched in server-side function
- [ ] No browser APIs in server code
- [ ] State serialized for hydration
- [ ] Hydration mismatch handled
- [ ] Appropriate use case (not over-using SSR)

**Source**: `/docs/server/ssr.md`
