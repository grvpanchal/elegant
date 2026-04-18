---
title: Middleware
layout: doc
slug: middleware
---

# Middleware

> - Extension point between dispatch and reducer
> - Handles async operations, logging, side effects
> - Composable pipeline for cross-cutting concerns

## Key Insight

Middleware is Redux's "plugin system"—it intercepts every action between dispatch and reducer, enabling async operations (API calls), logging, crash reporting, routing, and countless other cross-cutting concerns without polluting reducers or components. Think of middleware as airport security: every passenger (action) passes through the same checkpoints (middleware chain) before boarding the plane (reaching the reducer). Each middleware can inspect luggage (action payload), add stamps (metadata), deny boarding (cancel action), or redirect passengers (dispatch different actions)—all while keeping the core system (reducers) simple and pure.

## Detailed Description

Middleware plays a crucial role in state management, particularly in libraries like Redux. It acts as an intermediary layer between the action dispatch and the reducer, allowing developers to enhance and extend the functionality of their state management system without modifying Redux core or reducers.

The middleware pattern in Redux is inspired by Express.js middleware and functional composition. When you dispatch an action, it doesn't go directly to the reducer—it flows through a chain of middleware functions, each with the opportunity to observe, modify, delay, or cancel the action. This pipeline architecture enables powerful capabilities while maintaining separation of concerns.

Key characteristics of middleware:
1. **Higher-order functions** - Middleware has signature `store => next => action => { }`
2. **Composable** - Multiple middleware chain together seamlessly
3. **Access to dispatch and state** - Can read current state and dispatch new actions
4. **Side effect container** - Where impure operations (API calls, logging) live
5. **Order matters** - Middleware execute in the order they're applied

### How Middleware Works

Middleware intercepts actions before they reach the reducer, enabling developers to perform additional tasks or modify the action itself. Here's a breakdown of how middleware functions:

1. **Interception**: When an action is dispatched, it first passes through the middleware chain before reaching the reducer

2. **Processing**: Each middleware in the chain can access the dispatched action, the current state, and the `dispatch` function

3. **Modification**: Middleware can modify actions, dispatch new actions, or even cancel actions entirely

4. **Chaining**: Multiple middleware can be combined, with each passing the action to the next in the chain using the `next` function

### Common Use Cases

Middleware is particularly useful for handling various aspects of state management:

1. **Asynchronous Operations**: Middleware like Redux Thunk allows action creators to return functions instead of plain objects, enabling asynchronous operations such as API calls[10].

2. **Logging**: Middleware can log actions and state changes, which is invaluable for debugging and monitoring application behavior[2][5].

3. **Error Handling**: Middleware can catch and process errors before they reach the reducer, enhancing application stability[1].

4. **Authentication and Authorization**: Middleware can intercept actions related to protected routes or sensitive data, enforcing security rules[2].

5. **Caching**: Middleware can implement caching mechanisms, intercepting actions and serving cached data when appropriate[2].

## Code Examples

### Basic Example: Simple Logger Middleware

```javascript
// loggerMiddleware.js - Basic middleware structure
const loggerMiddleware = (store) => (next) => (action) => {
  console.group(action.type);
  console.log('Dispatching:', action);
  console.log('Previous State:', store.getState());
  
  const result = next(action);  // Pass to next middleware or reducer
  
  console.log('Next State:', store.getState());
  console.groupEnd();
  
  return result;  // Return result for dispatch() caller
};

// Apply middleware to store
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';

const store = createStore(
  rootReducer,
  applyMiddleware(loggerMiddleware)
);

// Usage
store.dispatch({ type: 'todos/add', payload: 'Buy milk' });
// Console output:
// todos/add
//   Dispatching: { type: 'todos/add', payload: 'Buy milk' }
//   Previous State: { todos: [] }
//   Next State: { todos: [{ text: 'Buy milk' }] }
```

### Practical Example: Async Middleware (Thunk Pattern)

```javascript
// thunkMiddleware.js - Handle async actions
const thunkMiddleware = (store) => (next) => (action) => {
  // If action is a function, call it with dispatch and getState
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  
  // Otherwise, pass to next middleware
  return next(action);
};

// This is the actual redux-thunk implementation (simplified)

// Usage: Async action creator
const fetchUsers = () => async (dispatch, getState) => {
  dispatch({ type: 'users/fetchStart' });
  
  try {
    const response = await fetch('/api/users');
    const users = await response.json();
    
    dispatch({ type: 'users/fetchSuccess', payload: users });
  } catch (error) {
    dispatch({ type: 'users/fetchFailure', payload: error.message });
  }
};

// Dispatch thunk
store.dispatch(fetchUsers());  // Function passed to middleware

// Error handling middleware
const errorMiddleware = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    console.error('Reducer error:', error);
    
    // Dispatch error action
    store.dispatch({
      type: 'app/error',
      payload: { message: error.message, action }
    });
    
    // Re-throw for error boundaries
    throw error;
  }
};

// Analytics middleware
const analyticsMiddleware = (store) => (next) => (action) => {
  // Track certain actions
  if (action.type.startsWith('user/')) {
    window.analytics?.track(action.type, {
      payload: action.payload,
      timestamp: Date.now()
    });
  }
  
  return next(action);
};

// Combine multiple middleware
const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware,
    errorMiddleware,
    analyticsMiddleware,
    loggerMiddleware  // Logger last to see final state
  )
);
```

### Advanced Example: Custom Middleware Patterns

```javascript
// 1. API middleware - Centralized API calling
const apiMiddleware = (store) => (next) => (action) => {
  // Convention: actions with meta.api field
  if (!action.meta?.api) {
    return next(action);
  }
  
  const { endpoint, method = 'GET', body } = action.meta.api;
  const { type, payload } = action;
  
  // Dispatch loading action
  next({ type: `${type}_PENDING`, payload });
  
  return fetch(endpoint, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  })
    .then(res => res.json())
    .then(data => {
      // Dispatch success action
      store.dispatch({ type: `${type}_SUCCESS`, payload: data });
      return data;
    })
    .catch(error => {
      // Dispatch failure action
      store.dispatch({
        type: `${type}_FAILURE`,
        payload: error.message,
        error: true
      });
      throw error;
    });
};

// Usage
store.dispatch({
  type: 'users/fetch',
  meta: {
    api: { endpoint: '/api/users' }
  }
});
// Middleware auto-dispatches:
// - users/fetch_PENDING
// - users/fetch_SUCCESS (with data)
// or users/fetch_FAILURE (on error)

// 2. Debounce middleware - Prevent action spam
const debounceMiddleware = () => {
  const timers = {};
  
  return (store) => (next) => (action) => {
    const debounceTime = action.meta?.debounce;
    
    if (!debounceTime) {
      return next(action);
    }
    
    // Clear existing timer for this action type
    if (timers[action.type]) {
      clearTimeout(timers[action.type]);
    }
    
    // Set new timer
    timers[action.type] = setTimeout(() => {
      next(action);
      delete timers[action.type];
    }, debounceTime);
  };
};

// Usage
store.dispatch({
  type: 'search/query',
  payload: 'search term',
  meta: { debounce: 300 }  // Wait 300ms
});

// 3. Offline middleware - Queue actions when offline
const offlineMiddleware = () => {
  let queue = [];
  
  return (store) => (next) => (action) => {
    if (!navigator.onLine && action.meta?.offline) {
      // Queue action when offline
      queue.push(action);
      
      store.dispatch({
        type: 'app/actionQueued',
        payload: action
      });
      
      return;
    }
    
    return next(action);
  };
};

// 4. Promise middleware - Handle promise actions
const promiseMiddleware = (store) => (next) => (action) => {
  if (!action.payload || typeof action.payload.then !== 'function') {
    return next(action);
  }
  
  // Dispatch pending action
  next({ ...action, payload: undefined, type: `${action.type}_PENDING` });
  
  return action.payload
    .then(result => {
      store.dispatch({ ...action, payload: result, type: `${action.type}_SUCCESS` });
      return result;
    })
    .catch(error => {
      store.dispatch({
        ...action,
        payload: error,
        type: `${action.type}_FAILURE`,
        error: true
      });
      throw error;
    });
};

// Usage
store.dispatch({
  type: 'users/fetch',
  payload: fetch('/api/users').then(r => r.json())
});

// 5. Router middleware - Sync routing with state
const routerMiddleware = (history) => (store) => (next) => (action) => {
  if (action.type === 'NAVIGATE') {
    history.push(action.payload.path);
  }
  
  return next(action);
};

// 6. DevTools middleware - Redux DevTools integration
const devToolsMiddleware = (store) => (next) => (action) => {
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    window.__REDUX_DEVTOOLS_EXTENSION__.send(action, store.getState());
  }
  
  return next(action);
};
```

## Common Mistakes

### 1. Not Calling `next(action)`
**Mistake:** Forgetting to call `next()` breaks the middleware chain.

```javascript
// ❌ BAD: Action never reaches reducer
const badMiddleware = (store) => (next) => (action) => {
  console.log('Action:', action);
  // Oops! Forgot to call next(action)
  // Action stops here, never reaches reducer
};

// Result: State never updates!
store.dispatch({ type: 'INCREMENT' });
// Console shows action, but state unchanged
```

```javascript
// ✅ GOOD: Always call next(action)
const goodMiddleware = (store) => (next) => (action) => {
  console.log('Action:', action);
  return next(action);  // Pass to next middleware/reducer
};

// Or conditionally skip certain actions
const conditionalMiddleware = (store) => (next) => (action) => {
  if (action.type === 'IGNORE_ME') {
    return;  // Intentionally block this action
  }
  return next(action);
};
```

**Why it matters:** `next(action)` is the pipeline—without it, actions never reach reducers and state never updates.

### 2. Dispatching Actions Synchronously in Middleware
**Mistake:** Using `next()` instead of `store.dispatch()` for new actions.

```javascript
// ❌ BAD: Using next() for new actions
const badMiddleware = (store) => (next) => (action) => {
  if (action.type === 'FETCH_DATA') {
    next({ type: 'FETCH_START' });  // Wrong!
    
    fetch('/api/data')
      .then(data => next({ type: 'FETCH_SUCCESS', payload: data }));  // Wrong!
    
    return next(action);  // Original action also passes through
  }
  return next(action);
};
// FETCH_START goes to middleware AFTER this one, skipping earlier ones
```

```javascript
// ✅ GOOD: Use store.dispatch() for new actions
const goodMiddleware = (store) => (next) => (action) => {
  if (action.type === 'FETCH_DATA') {
    store.dispatch({ type: 'FETCH_START' });  // Starts from beginning of chain
    
    fetch('/api/data')
      .then(data => store.dispatch({ type: 'FETCH_SUCCESS', payload: data }));
    
    return next(action);  // Or return without calling next to consume action
  }
  return next(action);
};
```

**Why it matters:** `next()` continues current middleware chain; `store.dispatch()` starts from the beginning. Use `dispatch()` for new actions to ensure all middleware process them.

### 3. Mutating Actions or State
**Mistake:** Modifying action objects or state directly.

```javascript
// ❌ BAD: Mutating action
const badMiddleware = (store) => (next) => (action) => {
  if (action.type === 'ADD_TODO') {
    action.payload.id = Date.now();  // MUTATION!
    action.timestamp = Date.now();  // MUTATION!
  }
  return next(action);
};
// Other middleware see mutated action - unpredictable behavior
```

```javascript
// ✅ GOOD: Create new action object
const goodMiddleware = (store) => (next) => (action) => {
  if (action.type === 'ADD_TODO') {
    return next({
      ...action,
      payload: {
        ...action.payload,
        id: Date.now()
      },
      meta: {
        ...action.meta,
        timestamp: Date.now()
      }
    });
  }
  return next(action);
};
```

**Why it matters:** Mutations break Redux DevTools time-travel and cause unpredictable behavior. Always create new objects.

## Quick Quiz

{% include quiz.html id="middleware-1"
   question="What is the Redux middleware function signature?"
   options="A|action => dispatch;B|({ getState, dispatch }) => next => action => { /* pre */ const result = next(action); /* post */ return result; } — a curried function that receives store API, the next middleware, and each dispatched action, and can inspect / transform / suppress / delay it before passing to next;C|store => void;D|It has no signature"
   correct="B"
   explanation="That 3-level curry lets middlewares be composed with applyMiddleware. The double return lets you wrap async work around the next() call." %}

{% include quiz.html id="middleware-2"
   question="Inside middleware, when should you call next(action) vs store.dispatch(action)?"
   options="A|They&apos;re the same;B|next(action) continues the current pipeline past this middleware — use it for the action you&apos;re currently processing. store.dispatch(action) restarts the pipeline from the top — use it to emit a NEW action (e.g. dispatching a success action after an async call). Mixing them up causes infinite loops;C|Only use next;D|Only use dispatch"
   correct="B"
   explanation="next = forward the current action. dispatch = fire a fresh action through all middleware again. Dispatching the same action from middleware is the classic infinite-loop bug." %}

{% include quiz.html id="middleware-3"
   question="Which is NOT a typical middleware use case?"
   options="A|Logging every action for debugging;B|Attaching auth tokens / request IDs to async calls;C|Handling thunks, sagas, promises, observables (async orchestration);D|Storing component DOM refs"
   correct="D"
   explanation="Middleware is for cross-cutting concerns on the action pipeline: logging, auth, analytics, async orchestration, crash reporting. DOM refs have nothing to do with the action stream." %}

{% include quiz.html id="middleware-4"
   question="Does middleware order matter?"
   options="A|No — composition is commutative;B|Yes — each middleware wraps the next one. A logger placed BEFORE thunk logs the raw thunk function; placed AFTER thunk it logs the resolved action. Crash reporters belong last to catch errors thrown by earlier middleware. Order = pipeline order;C|Order only matters in production;D|Order only matters for sagas"
   correct="B"
   explanation="applyMiddleware(a, b, c) means a wraps b wraps c. Shifting order changes which middleware sees the &quot;raw&quot; action vs already-transformed results." %}

{% include quiz.html id="middleware-5"
   question="How do you unit-test a middleware?"
   options="A|Boot a real app and interact with the UI;B|Construct fake store API ({ getState, dispatch }), a fake next spy, invoke middleware(storeAPI)(next)(action), then assert on what next was called with and what dispatch was called with. Pure function in, observable effects out;C|Middleware can&apos;t be tested;D|Only e2e tests work"
   correct="B"
   explanation="Middleware is three nested functions — all pure. Mock the inputs, assert the outputs. No DOM, no real store needed." %}

## References
- [Redux Middleware Documentation](https://redux.js.org/understanding/history-and-design/middleware)
- [Redux Thunk](https://github.com/reduxjs/redux-thunk)
- [Redux Saga](https://redux-saga.js.org/)