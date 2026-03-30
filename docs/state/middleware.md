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

## How Middleware Works

Middleware intercepts actions before they reach the reducer, enabling developers to perform additional tasks or modify the action itself. Here's a breakdown of how middleware functions:

1. **Interception**: When an action is dispatched, it first passes through the middleware chain before reaching the reducer

2. **Processing**: Each middleware in the chain can access the dispatched action, the current state, and the `dispatch` function

3. **Modification**: Middleware can modify actions, dispatch new actions, or even cancel actions entirely

4. **Chaining**: Multiple middleware can be combined, with each passing the action to the next in the chain using the `next` function

## Common Use Cases

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

<details>
<summary><strong>Question 1:</strong> What's the middleware function signature and what does each part mean?</summary>

**Answer:** **Middleware signature: `store => next => action => { }`**

**Breaking it down:**
```javascript
const middleware = (store) => (next) => (action) => {
  // Implementation
};

// Equivalent to:
const middleware = function(store) {
  return function(next) {
    return function(action) {
      // Implementation
    };
  };
};
```

**Each parameter:**

**1. `store` - Redux store object:**
```javascript
const middleware = (store) => {
  // Access to:
  store.getState();  // Read current state
  store.dispatch();  // Dispatch new actions (start from beginning of chain)
  
  return (next) => (action) => {
    const state = store.getState();
    console.log('Current state:', state);
    return next(action);
  };
};
```

**2. `next` - Next middleware in chain:**
```javascript
const middleware = (store) => (next) => {
  // next is a function that calls next middleware (or reducer if last)
  
  return (action) => {
    console.log('Before next');
    const result = next(action);  // Pass to next middleware/reducer
    console.log('After next');
    return result;
  };
};
```

**3. `action` - Dispatched action object:**
```javascript
const middleware = (store) => (next) => (action) => {
  // action is the object passed to dispatch()
  console.log('Action type:', action.type);
  console.log('Action payload:', action.payload);
  
  // Can inspect, modify, or block action
  if (action.type === 'FORBIDDEN') {
    return;  // Block action
  }
  
  return next(action);
};
```

**Why this signature?**
```javascript
// Currying enables composition
const logger = store => next => action => { /* ... */ };
const thunk = store => next => action => { /* ... */ };

// applyMiddleware can compose them
const chain = [logger, thunk].map(mw => mw(store));
// Each middleware gets store, returns function expecting next

const dispatch = compose(...chain)(store.dispatch);
// Each middleware wraps the next
```

**Why it matters:** This curried signature enables Redux to compose middleware into a single dispatch pipeline where each middleware has access to store, can call the next middleware, and can intercept actions.
</details>

<details>
<summary><strong>Question 2:</strong> When should you use `next(action)` vs `store.dispatch(action)`?</summary>

**Answer:** **Use `next()` to continue chain with current action; use `store.dispatch()` to dispatch new actions:**

**`next(action)` - Continue middleware chain:**
```javascript
const middleware = (store) => (next) => (action) => {
  console.log('Processing:', action);
  
  // Pass current action to next middleware
  return next(action);  // ← Goes to NEXT middleware in chain
};

// Middleware chain: [A, B, C] → reducer
// Action flows: A.next() → B.next() → C.next() → reducer
```

**`store.dispatch(action)` - Start new dispatch cycle:**
```javascript
const middleware = (store) => (next) => (action) => {
  if (action.type === 'FETCH_DATA') {
    // Dispatch new action - starts from FIRST middleware
    store.dispatch({ type: 'FETCH_START' });  // ← Goes to A (first middleware)
    
    fetch('/api/data')
      .then(data => {
        store.dispatch({ type: 'FETCH_SUCCESS', payload: data });
      });
    
    return next(action);  // Continue with original action
  }
  return next(action);
};

// Middleware chain: [A, B, C] → reducer
// FETCH_DATA: A → B (calls dispatch) → C → reducer
// FETCH_START: A → B → C → reducer (new dispatch cycle)
// FETCH_SUCCESS: A → B → C → reducer (another new cycle)
```

**Example showing difference:**
```javascript
const loggerMiddleware = (store) => (next) => (action) => {
  console.log('[Logger] Action:', action.type);
  return next(action);
};

const customMiddleware = (store) => (next) => (action) => {
  console.log('[Custom] Received:', action.type);
  
  if (action.type === 'TEST_NEXT') {
    console.log('[Custom] Using next()');
    return next({ type: 'MODIFIED', payload: 'via next' });
  }
  
  if (action.type === 'TEST_DISPATCH') {
    console.log('[Custom] Using dispatch()');
    store.dispatch({ type: 'MODIFIED', payload: 'via dispatch' });
    return next(action);
  }
  
  return next(action);
};

// Apply: [logger, custom]
const store = createStore(reducer, applyMiddleware(logger, custom));

// Test next()
store.dispatch({ type: 'TEST_NEXT' });
// Output:
// [Logger] Action: TEST_NEXT
// [Custom] Received: TEST_NEXT
// [Custom] Using next()
// (No logger for MODIFIED - it skipped logger!)

// Test dispatch()
store.dispatch({ type: 'TEST_DISPATCH' });
// Output:
// [Logger] Action: TEST_DISPATCH
// [Custom] Received: TEST_DISPATCH
// [Custom] Using dispatch()
// [Logger] Action: MODIFIED  ← Logger sees it!
// [Custom] Received: MODIFIED
```

**Decision guide:**
- **Passing current action along** → `next(action)`
- **Modifying current action** → `next({ ...action, ... })`
- **Dispatching additional actions** → `store.dispatch(newAction)`
- **Replacing current action entirely** → `store.dispatch(replacement); return;`

**Why it matters:** `next()` is for middleware chaining; `dispatch()` is for creating new actions. Mixing them up causes actions to skip middleware.
</details>

<details>
<summary><strong>Question 3:</strong> What are common use cases for middleware?</summary>

**Answer:** **Middleware handles cross-cutting concerns: async, logging, analytics, routing, etc.**

**1. Async operations (API calls):**
```javascript
// Redux Thunk pattern
const thunk = store => next => action =>
  typeof action === 'function'
    ? action(store.dispatch, store.getState)
    : next(action);

// Usage
const fetchUser = (id) => async (dispatch) => {
  dispatch({ type: 'FETCH_START' });
  const user = await api.getUser(id);
  dispatch({ type: 'FETCH_SUCCESS', payload: user });
};
```

**2. Logging and debugging:**
```javascript
const logger = store => next => action => {
  console.group(action.type);
  console.log('Prev State:', store.getState());
  console.log('Action:', action);
  const result = next(action);
  console.log('Next State:', store.getState());
  console.groupEnd();
  return result;
};
```

**3. Analytics tracking:**
```javascript
const analytics = store => next => action => {
  // Track user actions
  if (action.type.startsWith('user/')) {
    window.gtag('event', action.type, {
      category: 'user_action',
      label: action.payload
    });
  }
  return next(action);
};
```

**4. Error handling and crash reporting:**
```javascript
const crashReporter = store => next => action => {
  try {
    return next(action);
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        action,
        state: store.getState()
      }
    });
    throw error;
  }
};
```

**5. Authentication:**
```javascript
const auth = store => next => action => {
  const state = store.getState();
  
  // Redirect unauthenticated requests
  if (action.meta?.requiresAuth && !state.auth.token) {
    store.dispatch({ type: 'REDIRECT_TO_LOGIN' });
    return;
  }
  
  return next(action);
};
```

**6. API request normalization:**
```javascript
const api = store => next => action => {
  if (!action.meta?.api) return next(action);
  
  const { endpoint, method = 'GET' } = action.meta.api;
  const state = store.getState();
  
  return fetch(endpoint, {
    method,
    headers: {
      'Authorization': `Bearer ${state.auth.token}`,
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => store.dispatch({
      type: `${action.type}_SUCCESS`,
      payload: data
    }));
};
```

**7. Action queue/batching:**
```javascript
const batcher = () => {
  let queue = [];
  let timer = null;
  
  return store => next => action => {
    if (action.meta?.batch) {
      queue.push(action);
      
      clearTimeout(timer);
      timer = setTimeout(() => {
        store.dispatch({ type: 'BATCH_ACTIONS', payload: queue });
        queue = [];
      }, 50);
      
      return;
    }
    return next(action);
  };
};
```

**Why it matters:** Middleware centralizes cross-cutting concerns, keeping reducers pure and components clean.
</details>

<details>
<summary><strong>Question 4:</strong> How does middleware order affect behavior?</summary>

**Answer:** **Middleware execute in application order (left-to-right), then reverse order after next():**

**Understanding the flow:**
```javascript
const middlewareA = store => next => action => {
  console.log('A: Before next');
  const result = next(action);
  console.log('A: After next');
  return result;
};

const middlewareB = store => next => action => {
  console.log('B: Before next');
  const result = next(action);
  console.log('B: After next');
  return result;
};

const middlewareC = store => next => action => {
  console.log('C: Before next');
  const result = next(action);
  console.log('C: After next');
  return result;
};

const store = createStore(
  reducer,
  applyMiddleware(middlewareA, middlewareB, middlewareC)
);

store.dispatch({ type: 'TEST' });

// Output:
// A: Before next  ← A receives action first
// B: Before next  ← A calls next, B receives action
// C: Before next  ← B calls next, C receives action
// C: After next   ← C calls next (reaches reducer), returns
// B: After next   ← C returns, B continues
// A: After next   ← B returns, A continues
```

**Order matters examples:**

**1. Logger should be first:**
```javascript
// ✅ GOOD: Logger first sees all actions
applyMiddleware(logger, thunk, api)

// ❌ BAD: Logger misses thunk-dispatched actions
applyMiddleware(thunk, api, logger)
// Thunk dispatches new actions that skip logger
```

**2. Error handler should wrap others:**
```javascript
// ✅ GOOD: Error handler catches all middleware errors
applyMiddleware(errorHandler, thunk, api, logger)

// ❌ BAD: Errors in errorHandler not caught
applyMiddleware(thunk, errorHandler, api)
```

**3. Auth before API:**
```javascript
// ✅ GOOD: Auth checks before API calls
applyMiddleware(auth, api)
// Auth blocks unauthorized actions before API middleware sees them

// ❌ BAD: API calls made before auth check
applyMiddleware(api, auth)
// API middleware already started request before auth blocks
```

**4. Thunk early for async actions:**
```javascript
// ✅ GOOD: Thunk handles functions before other middleware
applyMiddleware(thunk, logger, analytics)
// Thunk converts function → actions, then logger/analytics see them

// ❌ BAD: Logger sees function, not actions
applyMiddleware(logger, analytics, thunk)
// Logger logs function object instead of dispatched actions
```

**General ordering pattern:**
```javascript
applyMiddleware(
  errorHandler,    // 1. Wrap everything
  logger,          // 2. See all actions
  thunk,           // 3. Convert async early
  auth,            // 4. Check permissions
  api,             // 5. Make requests
  analytics        // 6. Track final actions
)
```

**Why it matters:** Middleware order determines which middleware see which actions. Wrong order = broken functionality.
</details>

<details>
<summary><strong>Question 5:</strong> How do you test middleware?</summary>

**Answer:** **Test middleware by mocking store, next, and actions:**

**Basic middleware test:**
```javascript
import loggerMiddleware from './loggerMiddleware';

describe('loggerMiddleware', () => {
  let store, next, action;
  
  beforeEach(() => {
    store = {
      getState: jest.fn(() => ({ count: 0 })),
      dispatch: jest.fn()
    };
    next = jest.fn();
    action = { type: 'TEST_ACTION', payload: 'test' };
  });
  
  test('calls next with action', () => {
    const middleware = loggerMiddleware(store)(next);
    
    middleware(action);
    
    expect(next).toHaveBeenCalledWith(action);
  });
  
  test('returns result from next', () => {
    const result = { success: true };
    next.mockReturnValue(result);
    
    const middleware = loggerMiddleware(store)(next);
    const returnValue = middleware(action);
    
    expect(returnValue).toBe(result);
  });
  
  test('logs action and state', () => {
    console.log = jest.fn();
    
    const middleware = loggerMiddleware(store)(next);
    middleware(action);
    
    expect(console.log).toHaveBeenCalledWith('Action:', action);
    expect(store.getState).toHaveBeenCalled();
  });
});
```

**Testing async middleware (thunk):**
```javascript
import thunkMiddleware from 'redux-thunk';

describe('thunk middleware', () => {
  test('calls function actions with dispatch and getState', () => {
    const store = {
      getState: jest.fn(() => ({ user: 'Alice' })),
      dispatch: jest.fn()
    };
    const next = jest.fn();
    
    const thunkAction = jest.fn();
    const middleware = thunkMiddleware(store)(next);
    
    middleware(thunkAction);
    
    expect(thunkAction).toHaveBeenCalledWith(store.dispatch, store.getState);
    expect(next).not.toHaveBeenCalled();  // Function not passed to next
  });
  
  test('passes plain objects to next', () => {
    const store = { getState: jest.fn(), dispatch: jest.fn() };
    const next = jest.fn();
    const action = { type: 'PLAIN_ACTION' };
    
    const middleware = thunkMiddleware(store)(next);
    middleware(action);
    
    expect(next).toHaveBeenCalledWith(action);
  });
});
```

**Integration test with mock store:**
```javascript
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import apiMiddleware from './apiMiddleware';

const middlewares = [thunk, apiMiddleware];
const mockStore = configureMockStore(middlewares);

describe('API middleware integration', () => {
  test('dispatches success action on successful API call', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ users: [] })
      })
    );
    
    const store = mockStore({ users: [] });
    
    await store.dispatch({
      type: 'FETCH_USERS',
      meta: { api: { endpoint: '/api/users' } }
    });
    
    const actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'FETCH_USERS_PENDING'
    });
    expect(actions).toContainEqual({
      type: 'FETCH_USERS_SUCCESS',
      payload: { users: [] }
    });
  });
});
```

**Testing middleware order:**
```javascript
test('middleware execute in correct order', () => {
  const calls = [];
  
  const middlewareA = () => next => action => {
    calls.push('A:before');
    const result = next(action);
    calls.push('A:after');
    return result;
  };
  
  const middlewareB = () => next => action => {
    calls.push('B:before');
    const result = next(action);
    calls.push('B:after');
    return result;
  };
  
  const store = createStore(
    reducer,
    applyMiddleware(middlewareA, middlewareB)
  );
  
  store.dispatch({ type: 'TEST' });
  
  expect(calls).toEqual([
    'A:before',
    'B:before',
    'B:after',
    'A:after'
  ]);
});
```

**Why it matters:** Testing middleware ensures side effects (API calls, logging) work correctly and middleware chain properly.
</details>

## Benefits of Using Middleware

1. **Separation of Concerns**: Middleware allows developers to extract complex logic from components and action creators, leading to cleaner, more maintainable code

2. **Reusability**: Common functionalities can be encapsulated in middleware and reused across different parts of the application

3. **Extensibility**: Middleware provides a flexible way to extend the capabilities of state management systems without modifying their core logic

By leveraging middleware, developers can create more robust, efficient, and feature-rich applications while maintaining a clean and organized codebase.

## References
- [Redux Middleware Documentation](https://redux.js.org/understanding/history-and-design/middleware)
- [Redux Thunk](https://github.com/reduxjs/redux-thunk)
- [Redux Saga](https://redux-saga.js.org/)