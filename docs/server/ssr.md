---
title: Server Side Rendering
layout: doc
slug: ssr
---

# Server Side Rendering

> - Generates HTML on the server for each request
> - Dramatically improves perceived performance and SEO
> - Delivers fully-rendered pages instantly to browsers

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

{% include quiz.html id="ssr-1"
   question="What's the difference between Server-Side Rendering (SSR) and Static Site Generation (SSG)?"
   options="A|SSG renders on every request, SSR renders at build time;;B|SSR renders HTML on each request on the server (fresh data, per-user); SSG pre-renders HTML at build time into static files (fast, cacheable, cheap to serve, but stale until rebuilt). ISR is the middle ground — SSG with background revalidation;;C|They're identical;;D|SSR only works in Node"
   correct="B"
   explanation="Pick per-route: per-user personalised pages -> SSR; marketing/blog/docs -> SSG; near-real-time content -> ISR (SSG + revalidate)." %}

{% include quiz.html id="ssr-2"
   question="What is hydration?"
   options="A|Fetching data from the server;;B|The process where the client-side JS &quot;takes over&quot; the server-rendered HTML: the same component tree renders on the client, attaches event handlers, and wires up state so the static markup becomes interactive;;C|A type of caching;;D|A lifecycle hook"
   correct="B"
   explanation="SSR sends HTML for fast first paint; hydration turns it into a live app. Mismatches between server and client markup (time-dependent content, locale mismatches) cause hydration errors." %}

{% include quiz.html id="ssr-3"
   question="With SSR, do you still need to ship JavaScript to the client?"
   options="A|No — SSR means zero JS;;B|Yes — the server-rendered HTML is static until hydrated. Interactivity (onClick, state changes, client-side routing) requires the same React/Vue/Angular bundle to run on the client. React Server Components / partial hydration / islands reduce the JS, but don't eliminate it for interactive regions"
   correct="B"
   explanation="&quot;SSR = no JS&quot; is a common misconception. SSR + hydration = fast initial HTML AND full interactivity after JS loads. You can reduce bundle size with islands/RSC but not to zero for interactive apps." %}

{% include quiz.html id="ssr-4"
   question="What are the main SEO benefits of SSR over pure client-side rendering?"
   options="A|SSR makes your site rank higher automatically;;B|The HTML returned contains actual content and metadata — crawlers (including those with limited JS execution), social link-preview bots, and tooling get real content without waiting on JS. That improves discoverability, LCP, and share-preview quality;;C|SSR is the only way to get Google to index a site;;D|SSR has no SEO effect"
   correct="B"
   explanation="Modern Googlebot does execute JS, but SSR still wins for robustness, speed, non-Google crawlers, and non-browser fetchers (Twitter, LinkedIn, Slack, etc.)." %}

{% include quiz.html id="ssr-5"
   question="What's the purpose of renderToString vs renderToPipeableStream in React?"
   options="A|They do the same thing;;B|renderToString renders the whole tree into a single HTML string before responding — simple, but the client waits for the slowest data. renderToPipeableStream streams HTML in chunks as components resolve, unblocking TTFB and letting Suspense boundaries resolve progressively;;C|renderToPipeableStream is deprecated;;D|Only one works in Node"
   correct="B"
   explanation="Streaming rendering (with Suspense) gets content to the user earlier. renderToString is still fine for small/simple pages where streaming setup isn't worth it." %}

## References

- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
- [Next.js Server-Side Rendering](https://nextjs.org/docs/basic-features/pages#server-side-rendering)
- [SSR vs SSG vs ISR](https://vercel.com/blog/nextjs-server-side-rendering-vs-static-generation)
- [1] https://www.geeksforgeeks.org/describe-the-process-of-setting-up-ssr-with-redux/
- [2] https://dev.to/alexsergey/server-side-rendering-from-zero-to-hero-2610
- [3] https://stackoverflow.com/questions/48611423/what-is-the-best-way-to-use-server-side-rendering-with-react/48625833
- [4] https://redux.js.org/usage/server-rendering
- [5] https://github.com/redux-saga/redux-saga/issues/13
- [6] https://stackoverflow.com/questions/51466276/how-to-use-redux-saga-with-server-side-rendering/55458726
