---
title: Server Side Rendering
layout: doc
slug: ssr
---

# Server Side Rendering

## Key Insight

Server-Side Rendering (SSR) transforms your application from a blank page that loads slowly into a fully-rendered HTML document delivered instantly from the server, dramatically improving perceived performance, enabling search engine crawlers to index your content effectively, and providing a better experience for users on slow networks or low-powered devices—all while maintaining the interactivity of a modern single-page application.

## Detailed Description

Server-Side Rendering represents a fundamental shift in how web applications deliver content to users. Instead of sending an empty HTML shell and waiting for JavaScript to build the page client-side (traditional SPA approach), SSR generates fully-formed HTML on the server for each request, sending a complete, viewable page to the browser immediately.

The key advantage lies in the initial page load experience. With client-side rendering (CSR), users see a blank page or loading spinner while JavaScript downloads, parses, and executes. With SSR, the browser receives actual content instantly—users can read text and see images before any JavaScript runs. This "time to first paint" improvement can make applications feel 3-10x faster, especially on mobile networks.

From an SEO perspective, SSR solves the fundamental problem of JavaScript-heavy applications: search engine crawlers receive fully-rendered HTML instead of empty div tags. While modern crawlers like Google can execute JavaScript, many still struggle with dynamic content, and SSR guarantees consistent, immediate content visibility across all crawlers, social media bots, and preview generators.

The Universal Frontend Architecture approach to SSR emphasizes framework-agnostic patterns. Whether using Next.js (React), Nuxt.js (Vue), Angular Universal, or custom Node.js servers, the core principles remain: render components on the server using the same code that runs client-side, serialize application state for hydration, and handle routing universally. This "isomorphic" or "universal" approach means writing code once that runs in both environments.

Performance optimization with SSR involves balancing server load against client experience. Each SSR request consumes server CPU and memory—unlike static sites that serve cached HTML. Strategies like edge caching, incremental static regeneration (ISR), and selective hydration help achieve SSR benefits while managing server costs. The decision between full SSR, static generation (SSG), or hybrid approaches depends on content update frequency and personalization requirements.

In modern implementations, SSR often combines with streaming rendering—sending HTML progressively as components complete rather than waiting for the entire page. React 18's Suspense and server components, for example, enable streaming SSR that shows content incrementally, further improving perceived performance.

## Code Examples

### Basic Example: Simple Express SSR Setup

A fundamental SSR server demonstrating core concepts:

## Code Examples

### Basic Example: Simple Express SSR Setup

A fundamental SSR server demonstrating core concepts:

```javascript
// server.js

import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

const app = express();
const PORT = 3000;

// Serve static files (JS bundles, CSS, images)
app.use(express.static('dist'));

app.get('*', (req, res) => {
  // 1. Render React component to HTML string
  const htmlContent = renderToString(<App />);

  // 2. Send complete HTML document
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SSR App</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <!-- Server-rendered content -->
        <div id="root">${htmlContent}</div>
        
        <!-- Client bundle for hydration -->
        <script src="/client-bundle.js"></script>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`SSR server running on http://localhost:${PORT}`);
});
```

```javascript
// client.js - Hydration

import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';

// Hydrate server-rendered HTML to make it interactive
const container = document.getElementById('root');
hydrateRoot(container, <App />);
```

### Practical Example: SSR with State Management and Data Fetching

Real-world implementation showing state serialization and async data:

### Practical Example: SSR with State Management and Data Fetching

Real-world implementation showing state serialization and async data:

```javascript
// server.js - SSR with Redux

import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { END } from 'redux-saga';
import App from './App';
import rootReducer from './reducers';
import rootSaga from './sagas';

const app = express();

app.get('/user/:id', async (req, res) => {
  // 1. Create fresh Redux store for each request
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware)
  );

  // 2. Run sagas
  const sagaTask = sagaMiddleware.run(rootSaga);

  // 3. Dispatch initial actions (e.g., fetch user data)
  store.dispatch({
    type: 'FETCH_USER_REQUEST',
    payload: { userId: req.params.id }
  });

  // 4. Wait for all sagas to complete
  store.dispatch(END);
  await sagaTask.toPromise();

  // 5. Render app with populated store
  const htmlContent = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  );

  // 6. Serialize state for client hydration
  const preloadedState = store.getState();

  // 7. Send HTML with embedded state
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>User Profile - SSR</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <div id="root">${htmlContent}</div>
        
        <!-- Serialize state for client -->
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
        <script src="/client-bundle.js"></script>
      </body>
    </html>
  `);
});

app.listen(3000);
```

```javascript
// client.js - Hydration with preloaded state

import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import App from './App';
import rootReducer from './reducers';
import rootSaga from './sagas';

// 1. Retrieve preloaded state from server
const preloadedState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__; // Clean up

// 2. Create store with server state
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  rootReducer,
  preloadedState, // Initialize with server data
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

// 3. Hydrate with same state as server
const container = document.getElementById('root');
hydrateRoot(
  container,
  <Provider store={store}>
    <App />
  </Provider>
);
```

### Advanced Example: Streaming SSR with Suspense

Modern streaming approach for progressive rendering:

```javascript
// server-streaming.js - React 18 Streaming SSR

import express from 'express';
import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import App from './App';

const app = express();

app.get('*', (req, res) => {
  // Set headers for streaming
  res.setHeader('Content-Type', 'text/html');

  let didError = false;

  // Render to stream
  const { pipe, abort } = renderToPipeableStream(
    <App url={req.url} />,
    {
      // Called when shell is ready (above Suspense boundaries)
      onShellReady() {
        res.statusCode = didError ? 500 : 200;
        
        // Send HTML shell immediately
        res.write('<!DOCTYPE html><html><head>');
        res.write('<title>Streaming SSR</title>');
        res.write('<link rel="stylesheet" href="/styles.css">');
        res.write('</head><body><div id="root">');
        
        // Start streaming content
        pipe(res);
      },

      // Called when all content is ready (including Suspense fallbacks)
      onAllReady() {
        res.write('</div>');
        res.write('<script src="/client-bundle.js"></script>');
        res.write('</body></html>');
        res.end();
      },

      // Error handling
      onError(error) {
        didError = true;
        console.error('SSR Error:', error);
      }
    }
  );

  // Abort after timeout
  setTimeout(() => abort(), 10000);
});

app.listen(3000);
```

```jsx
// App.js - Using Suspense for async components

import React, { Suspense, lazy } from 'react';

const UserProfile = lazy(() => import('./UserProfile'));
const Posts = lazy(() => import('./Posts'));

function App({ url }) {
  return (
    <div>
      <h1>My App</h1>
      
      {/* Show shell immediately, stream components as they load */}
      <Suspense fallback={<div>Loading profile...</div>}>
        <UserProfile userId={getUserIdFromUrl(url)} />
      </Suspense>

      <Suspense fallback={<div>Loading posts...</div>}>
        <Posts userId={getUserIdFromUrl(url)} />
      </Suspense>
    </div>
  );
}

export default App;
```

## Common Mistakes

### 1. Using Browser APIs on the Server
**Mistake:** Accessing `window`, `document`, or browser-specific APIs during server rendering.

```jsx
// ❌ BAD: Browser API on server
const MyComponent = () => {
  const width = window.innerWidth; // Crashes on server!
  
  return <div>Width: {width}</div>;
};
```

```jsx
// ✅ GOOD: Check environment or use useEffect
const MyComponent = () => {
  const [width, setWidth] = useState(null);

  useEffect(() => {
    // Only runs on client
    setWidth(window.innerWidth);
  }, []);

  return <div>Width: {width || 'Calculating...'}</div>;
};
```

**Why it matters:** Server (Node.js) doesn't have browser APIs. Attempting to use them causes crashes. Always guard browser-specific code with environment checks or `useEffect`.

### 2. Not Serializing State Correctly
**Mistake:** Injecting state into HTML without sanitization.

```javascript
// ❌ BAD: XSS vulnerability
res.send(`
  <script>
    window.__STATE__ = ${JSON.stringify(state)}
  </script>
`);
// If state contains '</script><script>alert("XSS")</script>', it executes!
```

```javascript
// ✅ GOOD: Escape HTML entities
res.send(`
  <script>
    window.__STATE__ = ${JSON.stringify(state).replace(/</g, '\\u003c')}
  </script>
`);
```

**Why it matters:** Unescaped user data in serialized state creates XSS vulnerabilities. Always escape `<` characters and consider using libraries like `serialize-javascript`.

### 3. Creating New Store Instances on Client
**Mistake:** Creating a fresh store instead of reusing server state.

```javascript
// ❌ BAD: Ignores server state, causes content mismatch
const store = createStore(reducer); // Empty initial state

hydrateRoot(
  document.getElementById('root'),
  <Provider store={store}><App /></Provider>
);
// Content differs from server, React throws hydration warnings
```

```javascript
// ✅ GOOD: Initialize with server state
const preloadedState = window.__PRELOADED_STATE__;
const store = createStore(reducer, preloadedState);

hydrateRoot(
  document.getElementById('root'),
  <Provider store={store}><App /></Provider>
);
```

**Why it matters:** Hydration requires identical content on client and server. Mismatches cause React to discard server HTML and re-render, negating SSR benefits.

## Quick Quiz

<details>
<summary><strong>Question 1:</strong> What is the difference between Server-Side Rendering (SSR) and Static Site Generation (SSG)?</summary>

**Answer:**

**SSR (Server-Side Rendering):**
- HTML generated on **each request** at runtime
- Fresh, dynamic data for every user
- Higher server load
- **Use for:** User-specific content, frequently updated data

**SSG (Static Site Generation):**
- HTML generated at **build time** once
- Same HTML served to all users
- Minimal server load (static files)
- **Use for:** Content that changes infrequently (blogs, docs)

**Hybrid (ISR - Incremental Static Regeneration):**
- Static generation + periodic regeneration
- Best of both worlds for most use cases

**Example decision:**
- E-commerce product page with inventory → SSR (real-time stock)
- Blog post → SSG (content rarely changes)
- Product listing → ISR (update every 5 minutes)

**Why it matters:** Choosing the right rendering strategy affects performance, server costs, and user experience.
</details>

<details>
<summary><strong>Question 2:</strong> What is "hydration" in the context of SSR?</summary>

**Answer:** Hydration is the process where the client-side JavaScript "attaches" to server-rendered HTML, making it interactive without re-rendering:

**Steps:**
1. Server sends fully-rendered HTML (visible immediately)
2. Browser displays HTML while JavaScript downloads
3. JavaScript loads and "hydrates" the static HTML
4. Event listeners attach, state initializes, components become interactive

**Visual timeline:**
```
Server renders → HTML visible (not interactive)
                     ↓
JavaScript loads → Hydration happens
                     ↓
Page interactive → Event handlers work, state updates
```

**Key point:** Hydration must produce **identical markup** to server HTML. Mismatches cause errors and re-renders.

**Why it matters:** Understanding hydration helps debug SSR issues and optimize the transition from static to interactive content.
</details>

<details>
<summary><strong>Question 3:</strong> True or False: With SSR, you don't need to send JavaScript to the client.</summary>

**Answer:** **False.** SSR sends both HTML **and** JavaScript:

1. **Server renders** → HTML sent for immediate visibility
2. **Browser displays** → User sees content instantly  
3. **JavaScript downloads** → Client bundle loads
4. **Hydration occurs** → Page becomes interactive

Without JavaScript, the page would be visible but not interactive—no click handlers, no state updates, no dynamic behavior.

**Exception:** If building a purely informational site without interactivity, you could skip JavaScript. But most modern apps require it for functionality.

**Why it matters:** SSR improves *perceived* performance (fast first paint) but doesn't eliminate JavaScript. It's about when users see content, not about reducing bundle size.
</details>

<details>
<summary><strong>Question 4:</strong> What are the main SEO benefits of SSR compared to client-side rendering?</summary>

**Answer:**

**SSR SEO Advantages:**

1. **Guaranteed Content Access:** Search crawlers receive complete HTML immediately without executing JavaScript
2. **Faster Indexing:** Crawlers don't wait for JS execution, client-side data fetching
3. **Social Media Previews:** Open Graph tags and meta descriptions are present in initial HTML for link previews
4. **Universal Crawler Support:** Works with all crawlers, even those that don't execute JavaScript well

**Client-Side Rendering Challenges:**
```html
<!-- What crawlers see with CSR -->
<div id="root"></div>
<script src="app.js"></script>
```
Content only appears after JavaScript runs, which some crawlers struggle with.

**SSR Delivers:**
```html
<!-- What crawlers see with SSR -->
<div id="root">
  <h1>Product Name</h1>
  <p>Full description...</p>
  <meta property="og:title" content="Product">
</div>
```

**Why it matters:** While Google handles JavaScript well, other search engines and social media bots vary in JS support. SSR guarantees content visibility.
</details>

<details>
<summary><strong>Question 5:</strong> What is the purpose of `renderToString` vs `renderToPipeableStream`?</summary>

**Answer:**

**`renderToString` (Traditional SSR):**
- Renders entire component tree to string **synchronously**
- Waits for all components to finish before sending HTML
- Simple but slow for large apps
```javascript
const html = renderToString(<App />);
res.send(html); // Send all at once
```

**`renderToPipeableStream` (Streaming SSR - React 18+):**
- Renders and sends HTML **progressively**
- Sends shell immediately, streams components as they complete
- Works with Suspense boundaries
```javascript
const { pipe } = renderToPipeableStream(<App />);
pipe(res); // Stream chunks as ready
```

**Performance difference:**
- Traditional: Wait 2 seconds for all data → Send complete page
- Streaming: Send shell in 100ms → Stream remaining content

**When to use:**
- `renderToString`: Simple apps, fast data fetching
- `renderToPipeableStream`: Large apps, slow data sources, better UX

**Why it matters:** Streaming SSR significantly improves Time to First Byte (TTFB) and perceived performance by showing content progressively.
</details>

## References

- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
- [Next.js Server-Side Rendering](https://nextjs.org/docs/basic-features/pages#server-side-rendering)
- [SSR vs SSG vs ISR](https://vercel.com/blog/nextjs-server-side-rendering-vs-static-generation)

By following these steps, you can set up SSR with Redux Saga, enabling efficient server-side rendering while managing complex asynchronous flows. Remember to handle errors gracefully and optimize for performance in production environments[1][2][4][5].

## References
- [1] https://www.geeksforgeeks.org/describe-the-process-of-setting-up-ssr-with-redux/
- [2] https://dev.to/alexsergey/server-side-rendering-from-zero-to-hero-2610
- [3] https://stackoverflow.com/questions/48611423/what-is-the-best-way-to-use-server-side-rendering-with-react/48625833
- [4] https://redux.js.org/usage/server-rendering
- [5] https://github.com/redux-saga/redux-saga/issues/13
- [6] https://stackoverflow.com/questions/51466276/how-to-use-redux-saga-with-server-side-rendering/55458726