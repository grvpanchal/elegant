---
description: Guidance for Store - centralized state container for applications
name: Store - State
applyTo: |
  **/store/**/*.{js,ts}
  **/redux/**/*.{js,ts}
  **/*Store*.{js,ts}
  **/*slice*.{js,ts}
---

# Store Instructions

## What is a Store?

A store is your application's single source of truth—a centralized JavaScript object where all state lives. Any component can access state without prop drilling, and updates follow predictable rules (dispatch action → reducer → new state).

## Key Principles

1. **Single Source of Truth**: One store for entire app. No scattered state across components. Every piece of data has one authoritative location.

2. **State is Read-Only**: Only way to change state is dispatching actions. No direct mutations. This enables time-travel debugging and predictability.

3. **Pure Reducer Updates**: Reducers are pure functions (state + action → newState). Same inputs always produce same outputs.

## Best Practices

✅ **DO**:
- Organize state by domain (users, products, ui)
- Keep state normalized (avoid nested duplicates)
- Use Redux Toolkit for less boilerplate
- Initialize with meaningful default values
- Subscribe components only to needed state slices

❌ **DON'T**:
- Mutate state directly (always return new objects)
- Store derived data (calculate with selectors)
- Put non-serializable values (functions, classes) in store
- Create multiple stores (one store rule)
- Store local-only UI state globally (use local state)

## Code Patterns

### Redux Toolkit Store Setup

```javascript
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';
import productsReducer from './productsSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    products: productsReducer,
    ui: uiReducer
  },
  // Middleware auto-included: thunk, serializableCheck, immutableCheck
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Slice Pattern (RTK)

```javascript
// store/todosSlice.js
import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    addTodo: (state, action) => {
      // RTK uses Immer - "mutations" are safe
      state.items.push(action.payload);
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    removeTodo: (state, action) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    }
  }
});

export const { addTodo, toggleTodo, removeTodo } = todosSlice.actions;
export default todosSlice.reducer;
```

### Provider Setup

```jsx
// index.js
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

### Typed Hooks

```javascript
// store/hooks.js
import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## State Shape Guidelines

```javascript
// Good: Normalized, flat structure
{
  users: {
    byId: { '1': { id: '1', name: 'John' } },
    allIds: ['1'],
    loading: false
  },
  posts: {
    byId: { 'a': { id: 'a', authorId: '1', title: '...' } },
    allIds: ['a']
  }
}

// Bad: Nested, denormalized
{
  users: [
    { id: '1', name: 'John', posts: [{ id: 'a', title: '...' }] }
  ]
}
```

## Related Terminologies

- **Actions** (State) - Events that trigger state changes
- **Reducer** (State) - Functions that update state
- **Selectors** (State) - Extract data from store
- **Middleware** (State) - Intercept actions for async/logging

## Quality Gates

- [ ] Single store for application
- [ ] State organized by domain
- [ ] No direct mutations
- [ ] TypeScript types for state
- [ ] DevTools configured
- [ ] Local vs global state appropriate

**Source**: `/docs/state/store.md`
