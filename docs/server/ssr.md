---
title: Server Side Rendering
layout: doc
slug: ssr
---

# Server Side Rendering
Server-Side Rendering (SSR) is a technique where web pages are rendered on the server before being sent to the client's browser. This approach offers benefits like improved initial load times, better SEO, and enhanced performance on low-powered devices.

## Setting up SSR with Redux Saga

Here's a step-by-step guide to setting up SSR with Redux Saga:

### 1. Install Dependencies

```bash
npm install react react-dom redux react-redux redux-saga express
```

### 2. Create Redux Store and Sagas

```javascript
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);
```

### 3. Set Up Express Server

```javascript
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import App from './App';

const app = express();

app.get('*', (req, res) => {
  const content = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  );

  res.send(`
    <html>
      <body>
        <div id="root">${content}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(store.getState())}
        </script>
        <script src="/client.js"></script>
      </body>
    </html>
  `);
});
```

### 4. Handle Asynchronous Operations

For sagas that need to run on the server:

```javascript
import { END } from 'redux-saga';

// In your server code
store.dispatch(END);
store.sagaTask.toPromise().then(() => {
  // Render after sagas are complete
});
```

### 5. Client-Side Hydration

```javascript
import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';

const preloadedState = window.__PRELOADED_STATE__;
const store = createStore(rootReducer, preloadedState);

hydrate(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

### 6. Configure Build Process

Use a bundler like Webpack to create separate bundles for server and client.

By following these steps, you can set up SSR with Redux Saga, enabling efficient server-side rendering while managing complex asynchronous flows. Remember to handle errors gracefully and optimize for performance in production environments[1][2][4][5].

## References
- [1] https://www.geeksforgeeks.org/describe-the-process-of-setting-up-ssr-with-redux/
- [2] https://dev.to/alexsergey/server-side-rendering-from-zero-to-hero-2610
- [3] https://stackoverflow.com/questions/48611423/what-is-the-best-way-to-use-server-side-rendering-with-react/48625833
- [4] https://redux.js.org/usage/server-rendering
- [5] https://github.com/redux-saga/redux-saga/issues/13
- [6] https://stackoverflow.com/questions/51466276/how-to-use-redux-saga-with-server-side-rendering/55458726