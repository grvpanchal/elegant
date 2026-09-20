---
title: Apply Middleware to a Store's Dispatch
layout: question
slug: apply-middleware
format: coding
difficulty: medium
layer: state
topics: [middleware, store]
skill: state-middleware
minutes: 20
summary: Implement a function that applies middleware to a store's dispatch, enabling composable store enhancers.
---

A Redux store's `dispatch` function is the only way to trigger state updates. Middleware provides a third-party extension point between dispatching an action and the moment it reaches the reducer. Common uses include logging, crash reporting, asynchronous operations, and routing.

Implement `applyMiddleware(dispatch, middlewares)`:

- `dispatch` is the original store.dispatch function.
- `middlewares` is an array of middleware functions, each following the signature `(store) => (next) => (action) => ...`.
- Return a new dispatch function that sequentially passes each action through every middleware.
- The enhanced dispatch must behave like the original when `middlewares` is empty.
- Each middleware receives a `store` object with `getState` and `dispatch` methods; for this exercise, `getState` may throw if called (we only need to mock `dispatch`).
- The middleware chain is composed from right to left so that the first middleware in the array is the outermost wrapper.

{% include code-playground.html %}

## Solution

### Approach 1: manual composition with a loop

Create a mock store that exposes `getState` (which throws) and the original `dispatch`. Iterate over the middlewares from right to left, building a chain where each middleware enhances the next dispatch function.

```js
export default function applyMiddleware(dispatch, middlewares) {
  if (!Array.isArray(middlewares)) {
    throw new Error('middlewares must be an array');
  }
  if (middlewares.length === 0) {
    return dispatch;
  }

  const mockStore = {
    getState: () => {
      throw new Error('getState not implemented in applyMiddleware mock store');
    },
    dispatch: (...args) => dispatch(...args)
  };

  let chain = middlewares.map(middleware => middleware(mockStore));
  // Compose from right to left: chain[0](chain[1](chain[2](...dispatch)))
  let enhancedDispatch = chain.reduceRight((next, enhancer) => enhancer(next), dispatch);
  return enhancedDispatch;
}
```

The loop is explicit and easy to debug. Each middleware receives the same mock store, ensuring they all see a consistent `dispatch` (the enhanced one so far) and a `getState` that throws if accessed.

### Approach 2: recursive composition

Define a helper function that recursively applies the middleware chain. The base case returns the original dispatch; each step wraps the result with the current middleware.

```js
export default function applyMiddleware(dispatch, middlewares) {
  if (!Array.isArray(middlewares)) {
    throw new Error('middlewares must be an array');
  }
  if (middlewares.length === 0) {
    return dispatch;
  }

  const mockStore = {
    getState: () => {
      throw new Error('getState not implemented in applyMiddleware mock store');
    },
    dispatch: (...args) => dispatch(...args)
  };

  function apply(middlewares) {
    if (middlewares.length === 0) {
      return dispatch;
    }
    const [first, ...rest] = middlewares;
    const enhanced = first(mockStore);
    return enhanced(apply(rest));
  }

  return apply(middlewares);
}
```

The recursive version mirrors the mathematical definition of composition and avoids an explicit reverse step. However, it uses more call stack space proportional to the number of middlewares.

## Trade-offs

| | Iterative | Recursive |
|---|---|---|
| Stack safety | safe for any length | limited by call stack depth |
| Readability | familiar loop pattern | declarative, closer to composition |
| Performance | minimal overhead | function call per middleware |
| Debugging | easier to set breakpoints | harder to trace intermediate steps |

In practice, the number of middlewares is small (rarely more than ten), so both approaches are acceptable. The iterative version is slightly more efficient and avoids recursion limits, making it the safer default for production utility libraries.

## Related

- Reading: [Middleware](../state/middleware.html) · [Store](../state/store.html)
- Agent Skill: `state-middleware`