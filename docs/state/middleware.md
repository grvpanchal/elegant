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

1. **Asynchronous Operations**: Middleware like Redux Thunk allows action creators to return functions instead of plain objects, enabling asynchronous operations such as API calls.

2. **Logging**: Middleware can log actions and state changes, which is invaluable for debugging and monitoring application behavior.

3. **Error Handling**: Middleware can catch and process errors before they reach the reducer, enhancing application stability.

4. **Authentication and Authorization**: Middleware can intercept actions related to protected routes or sensitive data, enforcing security rules.

5. **Caching**: Middleware can implement caching mechanisms, intercepting actions and serving cached data when appropriate.

## Code Examples

### Basic Example: Async orchestration across libraries

The clearest place to see middleware in action is async work — fetch data, dispatch *Success* / *Error* outcomes. Each `chota-*` template solves the same "create a todo on the server, then update the store" problem with its native middleware story. RTK ships built-in middleware (immutable check, serializable check, thunks) via `configureStore` so you rarely write custom middleware in plain RTK; saga / NgRx Effects / Pinia operations do the heavy lifting in their respective templates.

{::nomarkdown}<div class="code-tabs">{:/}

Redux Saga
```javascript
// templates/chota-react-saga/src/state/todo/todo.operations.js
// Sagas are the middleware: takeLatest / call / put orchestrate the side
// effect. Failure dispatches the *_ERROR action; the reducer reacts.
import { put, takeLatest, call } from "redux-saga/effects";
import { CREATE_TODO } from "./todo.type";
import { createTodoError, createTodoSuccess } from "./todo.actions";
import fetchApi from "../../utils/api";

export function addTodoApi(payload) {
  return fetchApi("/todos", { method: "POST", body: payload });
}

export function* addTodos(action) {
  try {
    const payload = { ...action.payload, id: window.crypto.randomUUID() };
    yield call(addTodoApi, payload);
    yield put(createTodoSuccess(payload));
  } catch (error) {
    yield put(createTodoError(error.toString()));
  }
}

export function* watchTodos() {
  yield takeLatest(CREATE_TODO, addTodos);
  // ...DELETE_TODO, UPDATE_TODO, READ_TODO, TOGGLE_TODO
}
```

NgRx Effects
```typescript
// templates/chota-angular-ngrx/src/app/state/todo/todo.effects.ts
// NgRx Effects are RxJS pipes that listen to action streams and dispatch
// follow-up actions. createEffect + ofType is the saga-equivalent.
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { TodoService } from './todo.service';
import * as TodoActions from './todo.actions';

@Injectable()
export class TodoEffects {
  addTodoRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.addTodoRequest),
      switchMap(({ text }) =>
        this.todoService.createTodo(text).pipe(
          mergeMap((todo) => [
            TodoActions.createTodo({ id: todo.id, text: todo.text }),
            TodoActions.addTodoSuccess(),
          ]),
          catchError((error) =>
            of(TodoActions.addTodoFail({
              error: error.message || 'Failed to add todo',
            }))
          )
        )
      )
    )
  );

  constructor(private actions$: Actions, private todoService: TodoService) {}
}
```

Pinia operations
```javascript
// templates/chota-vue-pinia/src/state/todo/todo.operations.js
// Pinia "actions" can be async, so the operation is just an `async function`
// bound to the store. There's no middleware layer at all — the store method
// awaits the API and calls request/success/error helpers (which mutate
// `this`). Same control flow as a saga, expressed as straight async/await.
import { createTodo, createTodoSuccess, createTodoError } from "./todo.actions";
import fetchApi from "../../utils/api";

export function addTodoApi(payload) {
  return fetchApi("/todos", { method: "POST", body: payload });
}

export async function addTodos(text) {
  try {
    createTodo.bind(this)(text);
    const payload = { text, id: window.crypto.randomUUID() };
    await addTodoApi(payload);
    createTodoSuccess.bind(this)(payload);
  } catch (error) {
    createTodoError.bind(this)(error.toString());
  }
}
```

Redux Toolkit (built-in middleware)
```javascript
// templates/chota-react-rtk/src/state/index.js
// configureStore wires up immutable-check, serializable-check, and the
// thunk middleware automatically. You only write custom middleware when
// you have a cross-cutting concern beyond async — logging, analytics,
// crash reporting — and pass it via the `middleware` callback.
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

const store = configureStore({
  reducer: rootReducer,
  // Defaults already include thunk + checks; extend like:
  // middleware: (getDefault) => getDefault().concat(myLogger),
});

export default store;
```

{::nomarkdown}</div>{:/}

The conceptual job is identical in every tab: intercept an action, run a side effect, dispatch follow-up actions to update the store. The libraries differ in *where* you write that interception:

- **Saga**: a generator function plus a `takeLatest(action, saga)` watcher, run via `sagaMiddleware`.
- **NgRx Effects**: an injectable class whose properties are RxJS observables, registered via `provideEffects`.
- **Pinia**: skip the middleware layer entirely — just write an `async` store method. Reactivity propagates the mutations.
- **RTK**: most apps don't write middleware at all because `configureStore` ships sensible defaults plus thunks; you only reach for custom middleware for genuinely cross-cutting concerns.

### Practical Example: Async Middleware (Thunk Pattern)

The thunk pattern is the smallest piece of middleware that does real work: if the dispatched "action" is actually a function, call it with `dispatch` and `getState`; otherwise let it through. That's the whole engine behind `dispatch(fetchUsers())`. Layered alongside it, an error-catcher and an analytics tap show how a middleware *stack* composes — each one is the same `store => next => action` shape, just doing a different job.

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
// (This is essentially redux-thunk's implementation, simplified.)

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

Once the shape clicks, the same three-arg curry recurs everywhere: an API dispatcher that turns a `meta.api` field into request/success/failure actions, a debouncer that swallows action spam, an offline queue, a promise unwrapper, a router sync, a DevTools hook. Each is a few lines and reusable across slices — that's the payoff of the pipeline being a chain of higher-order functions.

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
   options="A|Always use store.dispatch — next() was deprecated when Redux Toolkit added the listener middleware, and calling next() is a legacy pattern that skips middleware ordering guarantees;;B|next(action) forwards the CURRENT action past this middleware; store.dispatch(action) sends a NEW action back through the entire middleware chain from the top. Dispatching the same action you just received (instead of calling next) is the classic infinite-loop bug;;C|They are identical — both forward to the reducer. next() is just a shorthand;;D|next(action) synchronously returns the next state tree, while dispatch(action) is asynchronous and returns a Promise of the new state"
   correct="B"
   explanation="That 3-level curry lets middlewares be composed with applyMiddleware. The double return lets you wrap async work around the next() call." %}

{% include quiz.html id="middleware-2"
   question="Inside middleware, when should you call next(action) vs store.dispatch(action)?"
   options="A|They're the same;;B|next(action) continues the current pipeline past this middleware — use it for the action you're currently processing. store.dispatch(action) restarts the pipeline from the top — use it to emit a NEW action (e.g. dispatching a success action after an async call). Mixing them up causes infinite loops;;C|Only use next;;D|Only use dispatch"
   correct="B"
   explanation="next = forward the current action. dispatch = fire a fresh action through all middleware again. Dispatching the same action from middleware is the classic infinite-loop bug." %}

{% include quiz.html id="middleware-3"
   question="Which is NOT a typical middleware use case?"
   options="A|Logging every action for debugging;;B|Handling thunks, sagas, promises, observables (async orchestration);;C|Attaching auth tokens / request IDs to async calls;;D|Storing component DOM refs"
   correct="D"
   explanation="Middleware is for cross-cutting concerns on the action pipeline: logging, auth, analytics, async orchestration, crash reporting. DOM refs have nothing to do with the action stream." %}

{% include quiz.html id="middleware-4"
   question="Does middleware order matter?"
   options="A|Yes — each middleware wraps the next one. A logger placed BEFORE thunk logs the raw thunk function; placed AFTER thunk it logs the resolved action. Crash reporters belong last to catch errors thrown by earlier middleware. Order = pipeline order;;B|No — composition is commutative;;C|Order only matters in production;;D|Order only matters for sagas"
   correct="A"
   explanation="applyMiddleware(a, b, c) means a wraps b wraps c. Shifting order changes which middleware sees the &quot;raw&quot; action vs already-transformed results." %}

{% include quiz.html id="middleware-5"
   question="How do you unit-test a middleware?"
   options="A|Only e2e tests work;;B|Boot a real app and interact with the UI;;C|Middleware can't be tested;;D|Construct fake store API ({ getState, dispatch }), a fake next spy, invoke middleware(storeAPI)(next)(action), then assert on what next was called with and what dispatch was called with. Pure function in, observable effects out"
   correct="D"
   explanation="Middleware is three nested functions — all pure. Mock the inputs, assert the outputs. No DOM, no real store needed." %}

## References
- [Redux Middleware Documentation](https://redux.js.org/understanding/history-and-design/middleware)
- [Redux Thunk](https://github.com/reduxjs/redux-thunk)
- [Redux Saga](https://redux-saga.js.org/)