---
title: Reducers
layout: doc
slug: reducer
---

# Reducer

> - Pure function mapping (state, action) → newState
> - Foundation of predictable state management
> - Enables time-travel debugging and state reproducibility

## Key Insight

Reducers transform Redux from "just another state container" into a predictable state machine—every state transition is a pure function, meaning given the same state and action, you'll always get the exact same result. This purity unlocks time-travel debugging, hot reloading, and deterministic testing that's impossible with mutable state. Think of reducers as the "laws of physics" for your application state: they define how your state universe evolves, and unlike messy imperative code, these laws can be tested, replayed, and proven correct.

## Detailed Description

A reducer in state management is a pure function that takes the current state and an action as arguments, and returns a new state. Reducers are fundamental to managing state in libraries like Redux, but the concept is applicable to other state management solutions as well. It's particularly useful for handling CRUD (Create, Read, Update, Delete) operations in a predictable manner.

The term "reducer" comes from the JavaScript `Array.reduce()` method—just as `reduce` transforms an array into a single value by applying a function to each element, Redux reducers transform a sequence of actions into the current state. Each action is like an event in time, and the reducer determines how that event changes the state.

Key characteristics of reducers:
1. **Pure functions** - No side effects, same inputs always produce same outputs
2. **Immutable updates** - Always return new state objects, never mutate existing state
3. **Predictable transformations** - Determine how state changes in response to actions
4. **Composable** - Complex reducers built from simpler reducer functions
5. **Testable** - Pure functions are trivial to unit test

## Code Examples

### Basic Example: Simple Counter Reducer

```javascript
// counterReducer.js - Basic pure function reducer
const initialState = {
  count: 0,
  history: []
};

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1,
        history: [...state.history, 'increment']
      };
    
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1,
        history: [...state.history, 'decrement']
      };
    
    case 'RESET':
      return initialState;  // Return fresh initial state
    
    default:
      return state;  // CRITICAL: always return state for unknown actions
  }
}

// Usage with Redux
import { createStore } from 'redux';
const store = createStore(counterReducer);

store.dispatch({ type: 'INCREMENT' });
console.log(store.getState());  // { count: 1, history: ['increment'] }

store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'DECREMENT' });
console.log(store.getState());  // { count: 1, history: ['increment', 'increment', 'decrement'] }
```

### Practical Example: CRUD Operations Reducer

```javascript
// todosReducer.js - Real-world CRUD patterns
const initialState = {
  items: [],
  loading: false,
  error: null,
  filter: 'all'  // 'all' | 'active' | 'completed'
};

function todosReducer(state = initialState, action) {
  switch (action.type) {
    // CREATE
    case 'todos/add':
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: action.payload.id,
            text: action.payload.text,
            completed: false,
            createdAt: Date.now()
          }
        ]
      };
    
    // READ (set from API)
    case 'todos/fetchStart':
      return { ...state, loading: true, error: null };
    
    case 'todos/fetchSuccess':
      return {
        ...state,
        items: action.payload,
        loading: false
      };
    
    case 'todos/fetchFailure':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // UPDATE
    case 'todos/toggle':
      return {
        ...state,
        items: state.items.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    
    case 'todos/update':
      return {
        ...state,
        items: state.items.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, ...action.payload.updates }
            : todo
        )
      };
    
    // DELETE
    case 'todos/delete':
      return {
        ...state,
        items: state.items.filter(todo => todo.id !== action.payload)
      };
    
    case 'todos/clearCompleted':
      return {
        ...state,
        items: state.items.filter(todo => !todo.completed)
      };
    
    // FILTER (UI state)
    case 'todos/setFilter':
      return {
        ...state,
        filter: action.payload
      };
    
    default:
      return state;
  }
}

// Action creators
const addTodo = (id, text) => ({ type: 'todos/add', payload: { id, text } });
const toggleTodo = (id) => ({ type: 'todos/toggle', payload: id });
const deleteTodo = (id) => ({ type: 'todos/delete', payload: id });
```

### Advanced Example: Reducer Composition

```javascript
// Composing reducers for complex state
import { combineReducers } from 'redux';

// Individual slice reducers
function authReducer(state = { user: null, token: null }, action) {
  switch (action.type) {
    case 'auth/login':
      return {
        user: action.payload.user,
        token: action.payload.token
      };
    
    case 'auth/logout':
      return { user: null, token: null };
    
    default:
      return state;
  }
}

function productsReducer(state = { items: [], selectedId: null }, action) {
  switch (action.type) {
    case 'products/load':
      return { ...state, items: action.payload };
    
    case 'products/select':
      return { ...state, selectedId: action.payload };
    
    default:
      return state;
  }
}

function cartReducer(state = { items: [] }, action) {
  switch (action.type) {
    case 'cart/add':
      const existing = state.items.find(i => i.productId === action.payload.productId);
      
      if (existing) {
        // Update quantity
        return {
          items: state.items.map(i =>
            i.productId === action.payload.productId
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          )
        };
      } else {
        // Add new item
        return {
          items: [...state.items, action.payload]
        };
      }
    
    case 'cart/remove':
      return {
        items: state.items.filter(i => i.productId !== action.payload)
      };
    
    case 'cart/clear':
      return { items: [] };
    
    default:
      return state;
  }
}

// Combine into root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  cart: cartReducer
});

// State shape:
// {
//   auth: { user, token },
//   products: { items, selectedId },
//   cart: { items }
// }

// Advanced pattern: Reducer enhancers
function withLogging(reducer) {
  return (state, action) => {
    console.log('Before:', state);
    console.log('Action:', action);
    const newState = reducer(state, action);
    console.log('After:', newState);
    return newState;
  };
}

function withUndo(reducer) {
  const initialState = {
    past: [],
    present: reducer(undefined, {}),
    future: []
  };
  
  return (state = initialState, action) => {
    const { past, present, future } = state;
    
    switch (action.type) {
      case 'UNDO':
        if (past.length === 0) return state;
        return {
          past: past.slice(0, -1),
          present: past[past.length - 1],
          future: [present, ...future]
        };
      
      case 'REDO':
        if (future.length === 0) return state;
        return {
          past: [...past, present],
          present: future[0],
          future: future.slice(1)
        };
      
      default:
        const newPresent = reducer(present, action);
        if (newPresent === present) return state;
        
        return {
          past: [...past, present],
          present: newPresent,
          future: []
        };
    }
  };
}

// Usage
const enhancedReducer = withUndo(withLogging(todosReducer));
```

## Common Mistakes

### 1. Mutating State Directly
**Mistake:** Modifying state object instead of returning new object.

```javascript
// ❌ BAD: Mutating state
function badReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      state.count++;  // MUTATION! Redux won't detect change
      return state;
    
    case 'ADD_ITEM':
      state.items.push(action.payload);  // MUTATION!
      return state;
    
    default:
      return state;
  }
}
// Redux uses shallow equality checks - mutations break change detection
```

```javascript
// ✅ GOOD: Immutable updates
function goodReducer(state = { count: 0, items: [] }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };  // New object
    
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload]  // New array
      };
    
    default:
      return state;
  }
}
```

**Why it matters:** Mutations prevent Redux from detecting changes, breaking React re-renders, DevTools time-travel, and selector memoization. Always return new objects.

### 2. Side Effects in Reducers
**Mistake:** Performing async operations or side effects inside reducer.

```javascript
// ❌ BAD: Side effects in reducer
function badReducer(state = {}, action) {
  switch (action.type) {
    case 'SAVE_DATA':
      localStorage.setItem('data', action.payload);  // SIDE EFFECT!
      return { ...state, saved: true };
    
    case 'FETCH_USER':
      fetch('/api/user')  // ASYNC SIDE EFFECT!
        .then(res => res.json())
        .then(user => state.user = user);  // Also mutating!
      return state;
    
    case 'LOG_ACTION':
      console.log('Action:', action);  // SIDE EFFECT (logging)
      return state;
    
    default:
      return state;
  }
}
```

```javascript
// ✅ GOOD: Pure reducer, side effects in middleware
function goodReducer(state = {}, action) {
  switch (action.type) {
    case 'SAVE_DATA':
      return { ...state, data: action.payload, saved: true };
    
    case 'FETCH_USER_SUCCESS':
      return { ...state, user: action.payload };
    
    case 'FETCH_USER_FAILURE':
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
}

// Side effects handled in middleware (e.g., Redux Thunk)
const saveDataThunk = (data) => (dispatch) => {
  localStorage.setItem('data', data);  // Side effect here
  dispatch({ type: 'SAVE_DATA', payload: data });
};

const fetchUserThunk = () => async (dispatch) => {
  try {
    const res = await fetch('/api/user');
    const user = await res.json();
    dispatch({ type: 'FETCH_USER_SUCCESS', payload: user });
  } catch (error) {
    dispatch({ type: 'FETCH_USER_FAILURE', payload: error.message });
  }
};
```

**Why it matters:** Reducers must be pure for time-travel debugging, testing, and predictability. Side effects belong in middleware or action creators.

### 3. Not Handling Default Case
**Mistake:** Missing default case in switch statement.

```javascript
// ❌ BAD: No default case
function badReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    
    case 'DECREMENT':
      return { count: state.count - 1 };
    // Missing default case!
  }
  // Returns undefined for unknown actions!
}

// Later:
const state = badReducer({ count: 5 }, { type: 'UNKNOWN' });
console.log(state);  // undefined - state destroyed!
```

```javascript
// ✅ GOOD: Always return state in default
function goodReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    
    case 'DECREMENT':
      return { count: state.count - 1 };
    
    default:
      return state;  // CRITICAL: preserve state for unknown actions
  }
}

const state = goodReducer({ count: 5 }, { type: 'UNKNOWN' });
console.log(state);  // { count: 5 } - state preserved
```

**Why it matters:** Redux dispatches initialization actions and other internal actions. Without default case, state becomes undefined, breaking the entire app.

## Quick Quiz

<details>
<summary><strong>Question 1:</strong> Why must reducers be pure functions?</summary>

**Answer:** Reducers must be pure functions (no side effects, same input → same output) for several critical reasons:

**1. Time-travel debugging:**
```javascript
// Pure reducer = reproducible state
const actions = [
  { type: 'ADD_TODO', payload: 'Buy milk' },
  { type: 'TOGGLE_TODO', payload: 1 }
];

// Replay actions = same state every time
let state = undefined;
actions.forEach(action => {
  state = todoReducer(state, action);
});
// Guaranteed same result every replay
```

**2. Testing:**
```javascript
// Pure = trivial to test
test('INCREMENT action', () => {
  const state = { count: 5 };
  const newState = counterReducer(state, { type: 'INCREMENT' });
  expect(newState.count).toBe(6);
  expect(state.count).toBe(5);  // Original unchanged
});
```

**3. Hot reloading:**
```javascript
// Pure reducer can be swapped without losing state
store.replaceReducer(newRootReducer);  // Works because pure
```

**4. Memoization/optimization:**
```javascript
// Selectors can memoize based on reducer purity
const selectExpensiveComputation = createSelector(
  [selectTodos],
  (todos) => /* expensive operation */
);
// Only recomputes when todos change (relies on immutability)
```

**Impure reducer breaks everything:**
```javascript
// ❌ Impure - different results each time
function impureReducer(state, action) {
  if (action.type === 'ADD_TIMESTAMP') {
    state.time = Date.now();  // Different every call!
    return state;
  }
}
// Time-travel = broken, tests = flaky, hot reload = crashes
```

**Why it matters:** Purity is what makes Redux's developer experience magical. Without it, you're just using a complicated global variable.
</details>

<details>
<summary><strong>Question 2:</strong> How do you update nested state immutably?</summary>

**Answer:** **Use spread operators, object destructuring, or libraries like Immer:**

**Pattern 1: Shallow nesting (spread operator):**
```javascript
// State: { user: { name: 'Alice', settings: { theme: 'dark' } } }
function userReducer(state, action) {
  if (action.type === 'UPDATE_THEME') {
    return {
      ...state,
      user: {
        ...state.user,
        settings: {
          ...state.user.settings,
          theme: action.payload  // Update nested property
        }
      }
    };
  }
  return state;
}
```

**Pattern 2: Array updates:**
```javascript
// Update item in nested array
function todosReducer(state, action) {
  if (action.type === 'UPDATE_TODO') {
    return {
      ...state,
      lists: state.lists.map(list => (
        list.id === action.listId
          ? {
              ...list,
              todos: list.todos.map(todo =>
                todo.id === action.todoId
                  ? { ...todo, ...action.updates }
                  : todo
              )
            }
          : list
      ))
    };
  }
  return state;
}
```

**Pattern 3: Immer library (simplifies deep updates):**
```javascript
import produce from 'immer';

function userReducer(state, action) {
  return produce(state, draft => {
    // Mutate draft freely - Immer handles immutability
    if (action.type === 'UPDATE_THEME') {
      draft.user.settings.theme = action.payload;
    }
  });
}

// Redux Toolkit uses Immer internally
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { user: { name: '', settings: {} } },
  reducers: {
    updateTheme(state, action) {
      // Looks like mutation, but Immer makes it immutable
      state.user.settings.theme = action.payload;
    }
  }
});
```

**Anti-pattern to avoid:**
```javascript
// ❌ Partial immutability (still mutates!)
function badReducer(state, action) {
  const newState = { ...state };  // Shallow copy
  newState.user.settings.theme = 'light';  // MUTATION of nested object!
  return newState;
}
// Shallow copy doesn't protect nested objects
```

**Why it matters:** Deep nesting is error-prone. Use Immer/Redux Toolkit to simplify complex updates while maintaining immutability.
</details>

<details>
<summary><strong>Question 3:</strong> What's the difference between `combineReducers` and a single reducer?</summary>

**Answer:** **`combineReducers` splits state management into independent slices, improving modularity:**

**Single reducer (monolithic):**
```javascript
function appReducer(state = { users: [], posts: [], comments: [] }, action) {
  switch (action.type) {
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    
    case 'ADD_POST':
      return { ...state, posts: [...state.posts, action.payload] };
    
    case 'ADD_COMMENT':
      return { ...state, comments: [...state.comments, action.payload] };
    
    // Gets unwieldy fast!
    default:
      return state;
  }
}
```

**Combined reducers (modular):**
```javascript
import { combineReducers } from 'redux';

// Each reducer manages its own slice
function usersReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_USER':
      return [...state, action.payload];
    default:
      return state;
  }
}

function postsReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_POST':
      return [...state, action.payload];
    default:
      return state;
  }
}

function commentsReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_COMMENT':
      return [...state, action.payload];
    default:
      return state;
  }
}

// Combine into one
const rootReducer = combineReducers({
  users: usersReducer,
  posts: postsReducer,
  comments: commentsReducer
});

// State shape: { users: [], posts: [], comments: [] }
```

**Key differences:**

| Aspect | Single Reducer | combineReducers |
|--------|---------------|------------------|
| **State shape** | Flat or custom structure | Object with keys matching reducer names |
| **Modularity** | All logic in one function | Each slice isolated |
| **Testing** | Test entire state tree | Test slices independently |
| **Scalability** | Gets unwieldy with growth | Scales to dozens of slices |
| **Code splitting** | Hard to split | Easy - each reducer is separate file |
| **Performance** | Runs all logic every action | Each reducer processes independently |

**How `combineReducers` works:**
```javascript
// Simplified implementation
function combineReducers(reducers) {
  return (state = {}, action) => {
    const nextState = {};
    
    Object.keys(reducers).forEach(key => {
      // Call each reducer with its slice
      nextState[key] = reducers[key](state[key], action);
    });
    
    return nextState;
  };
}
```

**When to use single reducer:**
- Very simple apps (2-3 state fields)
- Highly interconnected state requiring cross-slice logic

**When to use combineReducers:**
- Most apps (default choice)
- Independent state slices (users, products, UI)
- Team collaboration (different devs own different slices)

**Why it matters:** combineReducers scales Redux to enterprise apps. Single reducer is simpler initially but becomes maintenance nightmare.
</details>

<details>
<summary><strong>Question 4:</strong> How do you handle async actions in reducers?</summary>

**Answer:** **You don't—reducers are synchronous; async logic goes in middleware (thunks, sagas):**

**WRONG approach (async in reducer):**
```javascript
// ❌ Doesn't work - reducers can't be async
function badReducer(state, action) {
  if (action.type === 'FETCH_USER') {
    fetch('/api/user')  // Reducer returns immediately, fetch ignored
      .then(res => res.json())
      .then(user => /* can't dispatch from here! */);
    return state;  // State unchanged, fetch result lost
  }
  return state;
}
```

**CORRECT approach (async in middleware, sync in reducer):**

**Pattern 1: Redux Thunk (most common):**
```javascript
// Action creator (thunk) - handles async
export const fetchUser = (userId) => async (dispatch, getState) => {
  // 1. Dispatch loading action
  dispatch({ type: 'users/fetchStart' });
  
  try {
    // 2. Async operation
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();
    
    // 3. Dispatch success action
    dispatch({ type: 'users/fetchSuccess', payload: user });
  } catch (error) {
    // 4. Dispatch failure action
    dispatch({ type: 'users/fetchFailure', payload: error.message });
  }
};

// Reducer - purely synchronous
function usersReducer(state = { user: null, loading: false, error: null }, action) {
  switch (action.type) {
    case 'users/fetchStart':
      return { ...state, loading: true, error: null };
    
    case 'users/fetchSuccess':
      return { user: action.payload, loading: false, error: null };
    
    case 'users/fetchFailure':
      return { ...state, loading: false, error: action.payload };
    
    default:
      return state;
  }
}

// Usage
store.dispatch(fetchUser(123));
```

**Pattern 2: Redux Toolkit (createAsyncThunk):**
```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk auto-generates pending/fulfilled/rejected actions
export const fetchUser = createAsyncThunk(
  'users/fetch',
  async (userId) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: { user: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});
```

**Pattern 3: Redux Saga (advanced):**
```javascript
import { call, put, takeEvery } from 'redux-saga/effects';

function* fetchUserSaga(action) {
  yield put({ type: 'users/fetchStart' });
  
  try {
    const user = yield call(fetch, `/api/users/${action.payload}`);
    yield put({ type: 'users/fetchSuccess', payload: user });
  } catch (error) {
    yield put({ type: 'users/fetchFailure', payload: error.message });
  }
}

function* watchFetchUser() {
  yield takeEvery('FETCH_USER_REQUEST', fetchUserSaga);
}
```

**Why it matters:** Reducers must be pure and synchronous. Async logic in middleware keeps state transitions predictable and testable.
</details>

<details>
<summary><strong>Question 5:</strong> What are reducer composition patterns?</summary>

**Answer:** **Reducer composition builds complex reducers from simpler ones, improving reusability and maintainability:**

**Pattern 1: Slice composition (combineReducers):**
```javascript
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  posts: postsReducer
});
// Each reducer manages independent slice
```

**Pattern 2: Reducer delegation (nested reducers):**
```javascript
// Parent reducer delegates to child reducer
function todosReducer(state = [], action) {
  if (action.type === 'UPDATE_TODO') {
    return state.map(todo =>
      todo.id === action.id
        ? todoItemReducer(todo, action)  // Delegate to item reducer
        : todo
    );
  }
  return state;
}

// Child reducer handles single item
function todoItemReducer(todo, action) {
  switch (action.type) {
    case 'UPDATE_TODO':
      return { ...todo, text: action.text };
    default:
      return todo;
  }
}
```

**Pattern 3: Higher-order reducers (reducer enhancers):**
```javascript
// Reusable undo/redo logic
function withUndo(reducer) {
  const initialState = {
    past: [],
    present: reducer(undefined, {}),
    future: []
  };
  
  return (state = initialState, action) => {
    const { past, present, future } = state;
    
    switch (action.type) {
      case 'UNDO':
        return {
          past: past.slice(0, -1),
          present: past[past.length - 1],
          future: [present, ...future]
        };
      
      case 'REDO':
        return {
          past: [...past, present],
          present: future[0],
          future: future.slice(1)
        };
      
      default:
        const newPresent = reducer(present, action);
        if (newPresent === present) return state;
        
        return {
          past: [...past, present],
          present: newPresent,
          future: []
        };
    }
  };
}

// Apply to any reducer
const undoableCounter = withUndo(counterReducer);
const undoableTodos = withUndo(todosReducer);
```

**Pattern 4: Reducer utilities (shared logic):**
```javascript
// Reusable CRUD operations
function createCRUDReducer(entityName) {
  return (state = { items: [], loading: false }, action) => {
    switch (action.type) {
      case `${entityName}/add`:
        return {
          ...state,
          items: [...state.items, action.payload]
        };
      
      case `${entityName}/remove`:
        return {
          ...state,
          items: state.items.filter(i => i.id !== action.payload)
        };
      
      case `${entityName}/update`:
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id ? { ...i, ...action.payload } : i
          )
        };
      
      default:
        return state;
    }
  };
}

// Generate reducers
const usersReducer = createCRUDReducer('users');
const postsReducer = createCRUDReducer('posts');
```

**Pattern 5: Reducer map (alternative to switch):**
```javascript
// Map of action types to reducer functions
const counterHandlers = {
  'INCREMENT': (state) => ({ count: state.count + 1 }),
  'DECREMENT': (state) => ({ count: state.count - 1 }),
  'RESET': () => ({ count: 0 })
};

function createReducer(handlers, initialState) {
  return (state = initialState, action) => {
    const handler = handlers[action.type];
    return handler ? handler(state, action) : state;
  };
}

const counterReducer = createReducer(counterHandlers, { count: 0 });
```

**Benefits:**
- **Reusability**: Shared logic (undo, CRUD) used across multiple reducers
- **Testability**: Smaller reducers easier to test
- **Maintainability**: Changes isolated to specific functions
- **Scalability**: Large apps built from small, focused reducers

**Why it matters:** Composition prevents reducer bloat. Instead of 1000-line switch statements, compose small, focused, reusable reducers.
</details>

## References