---
description: Guidance for Reducers - pure functions transforming state
name: Reducer - State
applyTo: |
  **/store/**/*.{js,ts}
  **/reducers/**/*.{js,ts}
  **/*Reducer*.{js,ts}
  **/*slice*.{js,ts}
---

# Reducer Instructions

## What is a Reducer?

A reducer is a pure function that takes current state and an action, returning new state: `(state, action) => newState`. It's the "law of physics" for your state—deterministic, testable, and enabling time-travel debugging.

## Key Principles

1. **Pure Functions**: No side effects. Same inputs always produce same outputs. No API calls, no random values, no Date.now() inside reducers.

2. **Immutable Updates**: Never mutate state directly. Always return new objects. Use spread operator or Immer for nested updates.

3. **Handle Unknown Actions**: Always return current state for unrecognized action types. Never throw errors.

## Best Practices

✅ **DO**:
- Return new state objects (immutability)
- Handle all action types with switch/case or RTK
- Use Redux Toolkit (Immer handles immutability)
- Split reducers by domain (combineReducers)
- Initialize with meaningful default state

❌ **DON'T**:
- Mutate state or action parameters
- Perform side effects (API calls, logging)
- Call non-pure functions (Date.now(), Math.random())
- Handle async logic in reducers (use middleware)
- Create deeply nested state structures

## Code Patterns

### Classic Reducer Pattern

```javascript
// todosReducer.js
const initialState = {
  items: [],
  loading: false,
  error: null
};

function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/add':
      return {
        ...state,
        items: [...state.items, action.payload]  // New array
      };
    
    case 'todos/toggle':
      return {
        ...state,
        items: state.items.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }  // New object
            : todo
        )
      };
    
    case 'todos/delete':
      return {
        ...state,
        items: state.items.filter(t => t.id !== action.payload)
      };
    
    default:
      return state;  // CRITICAL: return current state
  }
}
```

### Redux Toolkit (Immer)

```javascript
// todosSlice.js - RTK uses Immer
import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    // "Mutations" are safe with Immer
    addTodo(state, action) {
      state.items.push(action.payload);
    },
    toggleTodo(state, action) {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo(state, action) {
      state.items = state.items.filter(t => t.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});
```

### Combining Reducers

```javascript
// rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import todosReducer from './todosSlice';
import usersReducer from './usersSlice';
import uiReducer from './uiSlice';

const rootReducer = combineReducers({
  todos: todosReducer,
  users: usersReducer,
  ui: uiReducer
});

export default rootReducer;

// State shape:
// { todos: {...}, users: {...}, ui: {...} }
```

### Immutable Update Patterns

```javascript
// Updating nested objects (without Immer)
case 'users/updateEmail':
  return {
    ...state,
    users: {
      ...state.users,
      [action.payload.id]: {
        ...state.users[action.payload.id],
        email: action.payload.email
      }
    }
  };

// With Immer (RTK)
updateEmail(state, action) {
  state.users[action.payload.id].email = action.payload.email;
}
```

## Testing Reducers

```javascript
describe('todosReducer', () => {
  it('should add todo', () => {
    const initial = { items: [] };
    const action = { type: 'todos/add', payload: { id: 1, text: 'Test' } };
    
    const result = todosReducer(initial, action);
    
    expect(result.items).toHaveLength(1);
    expect(result.items[0].text).toBe('Test');
    expect(result).not.toBe(initial);  // New reference
  });
});
```

## Related Terminologies

- **Actions** (State) - Trigger reducer execution
- **Store** (State) - Holds state, calls reducers
- **Selectors** (State) - Read computed data
- **Middleware** (State) - Pre-processes actions

## Quality Gates

- [ ] Pure functions (no side effects)
- [ ] Immutable updates (new objects)
- [ ] Default case returns state
- [ ] Organized by domain
- [ ] TypeScript typed state/actions
- [ ] Unit tests for each case

**Source**: `/docs/state/reducer.md`
