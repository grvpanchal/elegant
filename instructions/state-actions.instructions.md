---
description: Guidance for Actions - events describing state changes
name: Actions - State
applyTo: |
  **/store/**/*.{js,ts}
  **/actions/**/*.{js,ts}
  **/*Actions*.{js,ts}
  **/*slice*.{js,ts}
---

# Actions Instructions

## What are Actions?

Actions are plain JavaScript objects describing "what happened"—not how state should change, just that a user clicked login or an API returned data. They're the only source of information for the store, creating an audit trail of every event in your application.

## Key Principles

1. **Descriptive, Not Imperative**: Actions say "user logged in" not "set user to X". They describe events, not commands.

2. **Plain Serializable Objects**: Actions must be plain objects (no functions, Promises, classes). This enables logging, replay, and persistence.

3. **Single Type Property**: Every action has a `type` string identifying it. Convention: `'domain/eventName'`.

## Best Practices

✅ **DO**:
- Use descriptive type names (`'todos/addTodo'`)
- Follow FSA (Flux Standard Action) format
- Use action creators to encapsulate creation
- Define type constants to prevent typos
- Use request/success/failure for async actions

❌ **DON'T**:
- Put non-serializable values in actions
- Make action types too generic (`'UPDATE'`)
- Dispatch from reducers (dispatch from components/middleware)
- Mutate actions after creation
- Skip action creators for complex payloads

## Code Patterns

### Action Types & Creators

```javascript
// Traditional pattern
export const ADD_TODO = 'todos/add';
export const TOGGLE_TODO = 'todos/toggle';
export const DELETE_TODO = 'todos/delete';

// Action creators
let nextId = 0;

export function addTodo(text) {
  return {
    type: ADD_TODO,
    payload: {
      id: nextId++,
      text,
      completed: false
    }
  };
}

export function toggleTodo(id) {
  return { type: TOGGLE_TODO, payload: id };
}

export function deleteTodo(id) {
  return { type: DELETE_TODO, payload: id };
}
```

### Redux Toolkit (Preferred)

```javascript
// RTK creates action types + creators automatically
import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    // Action creator: todosSlice.actions.addTodo
    // Action type: 'todos/addTodo'
    addTodo: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(text) {
        return { payload: { id: nanoid(), text, completed: false } };
      }
    },
    toggleTodo(state, action) {
      const todo = state.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    }
  }
});

export const { addTodo, toggleTodo } = todosSlice.actions;
```

### Async Action Pattern

```javascript
// Request/Success/Failure pattern
export const fetchUsers = createAsyncThunk(
  'users/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Reducer handles all three states
extraReducers: (builder) => {
  builder
    .addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    })
    .addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
}
```

### Dispatching Actions

```jsx
import { useDispatch } from 'react-redux';
import { addTodo, toggleTodo } from './todosSlice';

function TodoForm() {
  const dispatch = useDispatch();
  
  const handleSubmit = (text) => {
    dispatch(addTodo(text));  // Dispatch action
  };
  
  const handleToggle = (id) => {
    dispatch(toggleTodo(id));
  };
}
```

## FSA (Flux Standard Action)

```javascript
// Compliant action structure
{
  type: 'users/fetchSuccess',  // Required
  payload: [...users],         // Data for update
  meta: { timestamp: Date.now() },  // Optional metadata
  error: false                 // true if action represents error
}
```

## Related Terminologies

- **Reducer** (State) - Handles actions to update state
- **Store** (State) - Receives dispatched actions
- **Middleware** (State) - Intercepts actions
- **CRUD** (State) - Action naming for create/read/update/delete

## Quality Gates

- [ ] Actions are plain objects
- [ ] Type follows domain/event naming
- [ ] Payloads are serializable
- [ ] Async uses request/success/failure
- [ ] Action creators used for complex actions
- [ ] TypeScript types for actions

**Source**: `/docs/state/actions.md`
