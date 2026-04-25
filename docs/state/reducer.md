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

### Basic Example: Todo reducer across state libraries

The same "todo slice" implemented four different ways, pulled from the actual templates. Notice that Classic Redux and Redux Saga use the same switch/case reducer (Saga adds request/success/error branches); RTK compresses the same effect into `createSlice` with Immer-backed mutating-looking code; NgRx uses `createReducer(on(...))`. Pinia doesn't have a reducer at all — its "actions" mutate the store state directly — so it isn't listed here.

{::nomarkdown}<div class="code-tabs">{:/}

Classic Redux
```javascript
// templates/chota-react-redux/src/state/todo/todo.reducer.js
import intialTodoState from "./todo.initial";
import { CREATE_TODO, DELETE_TODO, EDIT_TODO, TOGGLE_TODO, UPDATE_TODO } from "./todo.type";

const todo = (state = intialTodoState, action) => {
  let todoItems = [];
  switch (action.type) {
    case CREATE_TODO:
      return {
        ...state,
        todoItems: [
          ...state.todoItems,
          { id: action.payload.id, text: action.payload.text, completed: false },
        ],
      };
    case EDIT_TODO:
      return { ...state, currentTodoItem: action.payload };
    case UPDATE_TODO:
      todoItems = state.todoItems.map((t) =>
        t.id === action.payload.id ? { ...t, text: action.payload.text } : t);
      return { ...state, todoItems, currentTodoItem: intialTodoState.currentTodoItem };
    case TOGGLE_TODO:
      todoItems = state.todoItems.map((t) =>
        t.id === action.payload.id ? { ...t, completed: !t.completed } : t);
      return { ...state, todoItems };
    case DELETE_TODO:
      todoItems = state.todoItems.filter((t) => t.id !== action.payload.id);
      return { ...state, todoItems };
    default:
      return state;
  }
};
export default todo;
```

Redux Toolkit
```javascript
// templates/chota-react-rtk/src/state/todo/todo.reducer.js
// createSlice + Immer lets you write mutating-looking code that still
// produces an immutable update under the hood. The slice also auto-emits
// action creators and types.
import { createSlice } from "@reduxjs/toolkit";
import intialTodoState from "./todo.initial";

let nextTodoId = 0;
export const todoSlice = createSlice({
  name: "todo",
  initialState: intialTodoState,
  reducers: {
    createTodo: (state, action) => {
      state.todoItems.push({ text: action.payload, completed: false, id: nextTodoId++ });
    },
    editTodo: (state, action) => { state.currentTodoItem = action.payload; },
    updateTodo: (state, action) => {
      state.todoItems = state.todoItems.map((t) =>
        t.id === action.payload.id ? { ...t, text: action.payload.text } : t);
      state.currentTodoItem = intialTodoState.currentTodoItem;
    },
    toggleTodo: (state, action) => {
      state.todoItems = state.todoItems.map((t) =>
        t.id === action.payload.id ? { ...t, completed: !t.completed } : t);
    },
  },
});
export const { createTodo, editTodo, updateTodo, toggleTodo } = todoSlice.actions;
export default todoSlice.reducer;
```

Redux Saga
```javascript
// templates/chota-react-saga/src/state/todo/todo.reducer.js
// Same switch/case shape as Classic Redux, plus *_SUCCESS / *_ERROR branches
// because sagas dispatch those after completing async work. The React-Saga
// and WC-Saga templates share this exact reducer — the saga pattern is
// framework-agnostic.
import intialTodoState from "./todo.initial";
import {
  CREATE_TODO, CREATE_TODO_SUCCESS, CREATE_TODO_ERROR,
  READ_TODO, READ_TODO_SUCCESS, READ_TODO_ERROR,
  TOGGLE_TODO, TOGGLE_TODO_SUCCESS, TOGGLE_TODO_ERROR,
  /* ...DELETE_*, UPDATE_*, EDIT_TODO... */
} from "./todo.type";

const todo = (state = intialTodoState, action) => {
  switch (action.type) {
    case READ_TODO:
      return { ...state, isLoading: true, isContentLoading: true };
    case READ_TODO_SUCCESS:
      return { ...state, isLoading: false, isContentLoading: false, todoItems: action.payload };
    case READ_TODO_ERROR:
      return { ...state, isLoading: false, isContentLoading: false, error: action.error };
    case CREATE_TODO:
      return { ...state, isLoading: true, isActionLoading: true };
    case CREATE_TODO_SUCCESS:
      return {
        ...state, isLoading: false, isActionLoading: false,
        todoItems: [...state.todoItems, action.payload],
      };
    // ...same pattern for TOGGLE_/UPDATE_/DELETE_ triples
    default:
      return state;
  }
};
export default todo;
```

NgRx
```typescript
// templates/chota-angular-ngrx/src/app/state/todo/todo.reducer.ts
import { createReducer, on } from '@ngrx/store';
import initialTodoState from './todo.initial';
import {
  createTodo, editTodo, updateTodo, toggleTodo, deleteTodo, loadTodos,
  loadTodosRequest, loadTodosSuccess, loadTodosFail,
  addTodoRequest, addTodoSuccess, addTodoFail,
} from './todo.actions';

export const todoReducer = createReducer(
  initialTodoState,

  on(loadTodosRequest, (state) => ({ ...state, isContentLoading: true, error: '' })),
  on(loadTodosSuccess, (state) => ({ ...state, isContentLoading: false })),
  on(loadTodosFail, (state, { error }) => ({ ...state, isContentLoading: false, error })),
  on(loadTodos, (state, { todos }) => ({ ...state, todoItems: todos })),

  on(addTodoRequest, (state) => ({ ...state, isActionLoading: true, error: '' })),
  on(addTodoSuccess, (state) => ({ ...state, isActionLoading: false })),
  on(addTodoFail, (state, { error }) => ({ ...state, isActionLoading: false, error })),

  on(createTodo, (state, { id, text }) => ({
    ...state,
    todoItems: [...state.todoItems, { id, text, completed: false }],
  })),

  on(editTodo, (state, payload) => ({ ...state, currentTodoItem: payload })),

  on(toggleTodo, (state, { id }) => ({
    ...state,
    todoItems: state.todoItems.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t),
  })),
);
```

{::nomarkdown}</div>{:/}

Across all four tabs the *contract* is the same: given the previous state and an action, return a new state. The surface differs in whether you write the switch yourself (Classic Redux / Saga), let a library auto-generate the switch from handlers (NgRx, RTK), or dispense with the whole pattern in favour of store-method mutations (Pinia — see the `Store` docs).

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

{% include quiz.html id="reducer-1"
   question="Why must reducers be pure functions?"
   options="A|It's required by TypeScript;;B|Purity is just a style preference;;C|Pure functions are faster at runtime;;D|Reducers must be deterministic given (state, action), with no mutations or side effects, so that: Redux dev-tools can time-travel by replaying actions, Redux can rely on reference equality to know what changed, SSR returns consistent output, and tests only need inputs to assert outputs"
   correct="D"
   explanation="Impurity (mutation, side effects, random, now()) breaks time travel, reference equality checks, and predictability — the core guarantees Redux is built on." %}

{% include quiz.html id="reducer-2"
   question="What's the idiomatic way to update a deeply-nested property immutably?"
   options="A|JSON.parse(JSON.stringify(state));;B|Reassign state.x.y directly;;C|Mutate it in place and call setState;;D|Return a new outer object with spread, a new middle object with spread, a new inner object with the changed field — or use Immer (or RTK which uses Immer under the hood) to write mutating-looking code that produces an immutable update"
   correct="D"
   explanation="Manual spreads get verbose quickly, which is why RTK's createSlice is so popular — it lets you write state.todo.items.push(x) and Immer produces the immutable result." %}

{% include quiz.html id="reducer-3"
   question="What does combineReducers do?"
   options="A|Takes an object of slice reducers { todo, filters, config } and returns a single root reducer that calls each slice reducer with its slice of state and the same action, then assembles the results into { todo, filters, config }. That's how you scale from one reducer to many;;B|Nothing — decorative;;C|Deprecated in Redux 5;;D|Merges two states into one reducer"
   correct="A"
   explanation="It's pure scaffolding that lets each slice own its key in the state tree. RTK's configureStore accepts the same object form." %}

{% include quiz.html id="reducer-4"
   question="How should reducers handle async work (fetches, timeouts, etc.)?"
   options="A|Reducers should call setTimeout;;B|Redux can't do async;;C|Reducers should do the fetch themselves;;D|Reducers stay pure and only react to actions. The async work lives in thunks / sagas / epics / listeners, which dispatch request/success/fail actions that the reducer handles predictably — often into an { status, data, error } shape"
   correct="D"
   explanation="Keep reducers deterministic. Async -> actions -> reducer. The request/success/fail triple is the shared pattern across the Redux family." %}

{% include quiz.html id="reducer-5"
   question="Which of these is a legitimate reducer composition pattern?"
   options="A|Nothing — all reducers must be one giant switch;;B|Just copy-paste reducers;;C|combineReducers for slice composition, calling a shared sub-reducer for a nested shape, a higher-order reducer that wraps another reducer to add behavior (e.g. undo/redo, reset-on-logout), and RTK's extraReducers letting slices respond to other slices' actions;;D|Reducer composition is impossible"
   correct="C"
   explanation="Reducers are functions — they compose. combineReducers, sub-reducers, higher-order wrappers, and cross-slice listeners are the standard tools for keeping each reducer focused." %}

## References