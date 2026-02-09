---
title: Actions
layout: doc
slug: actions
---

# Actions

> - Plain objects describing "what happened"
> - Only source of information for the store
> - Enables complete audit trail of state changes

## Key Insight

Actions are the "events" in your application's event-driven architecture—they don't tell the state how to change, they simply announce "user clicked login button" or "API returned product list." This declarative approach creates a complete audit trail of everything that happened in your app, powering time-travel debugging, analytics, and even replaying user sessions for bug reproduction. Think of actions as your app's historical record: every action is a timestamped event that, when replayed in sequence, reconstructs the exact state at any point in time.

## Detailed Description

Actions in frontend state management are plain JavaScript objects that describe changes to be made to the application's state. They are the primary way to interact with the store and trigger state updates. Unlike imperative approaches where you directly modify state ("set user to X"), actions are descriptive commands ("user logged in with credentials X").

The Redux architecture mandates that actions are the *only* way to change state. This constraint seems restrictive but is incredibly powerful: it means every state change is logged, trackable, and reproducible. Actions flow from UI events, API responses, timers, or any other source, through middleware, to reducers that update state.

Key characteristics:
1. **Plain objects** - Serializable JavaScript objects (no functions, classes, or Promises)
2. **Type property** - String constant identifying the action (convention: 'domain/eventName')
3. **Payload** - Additional data needed for state update (optional but common)
4. **FSA compliance** - Follow Flux Standard Action format for consistency
5. **Immutable** - Action objects shouldn't be modified after creation

## Code Examples

### Basic Example: Simple Action Creators

```javascript
// actionTypes.js - Constants prevent typos
export const ADD_TODO = 'todos/add';
export const TOGGLE_TODO = 'todos/toggle';
export const DELETE_TODO = 'todos/delete';

// actions.js - Action creators
let nextTodoId = 0;

// Basic action creator
export function addTodo(text) {
  return {
    type: ADD_TODO,
    payload: {
      id: nextTodoId++,
      text,
      completed: false
    }
  };
}

export function toggleTodo(id) {
  return {
    type: TOGGLE_TODO,
    payload: id
  };
}

export function deleteTodo(id) {
  return {
    type: DELETE_TODO,
    payload: id
  };
}

// Usage in components
import { useDispatch } from 'react-redux';
import { addTodo, toggleTodo } from './actions';

function TodoForm() {
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addTodo(text));  // Dispatch action
    setText('');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button type="submit">Add Todo</button>
    </form>
  );
}
```

### Practical Example: Async Action Creators (Thunks)

```javascript
// Synchronous action creators
export const fetchUsersStart = () => ({ type: 'users/fetchStart' });
export const fetchUsersSuccess = (users) => ({
  type: 'users/fetchSuccess',
  payload: users
});
export const fetchUsersFailure = (error) => ({
  type: 'users/fetchFailure',
  payload: error,
  error: true  // FSA standard for errors
});

// Async action creator (thunk)
export const fetchUsers = () => async (dispatch, getState) => {
  // Check if already loaded
  const { users } = getState();
  if (users.items.length > 0 && !users.stale) {
    return;  // Skip fetch if cached
  }
  
  dispatch(fetchUsersStart());
  
  try {
    const response = await fetch('/api/users');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    dispatch(fetchUsersSuccess(data));
  } catch (error) {
    dispatch(fetchUsersFailure(error.message));
  }
};

// Usage
function UsersList() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(state => state.users);
  
  useEffect(() => {
    dispatch(fetchUsers());  // Dispatch async thunk
  }, [dispatch]);
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  
  return (
    <ul>
      {items.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

### Advanced Example: Flux Standard Actions with Redux Toolkit

```javascript
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

// Simple actions with createAction
export const incrementBy = createAction('counter/incrementBy');
// Automatically generates type and payload

// With payload preparation
export const addTodo = createAction('todos/add', (text) => {
  return {
    payload: {
      id: nanoid(),
      text,
      completed: false,
      createdAt: new Date().toISOString()
    }
  };
});

// Usage
dispatch(incrementBy(5));  // { type: 'counter/incrementBy', payload: 5 }
dispatch(addTodo('Buy milk'));  // Full payload auto-generated

// Async actions with createAsyncThunk
export const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (userId, { getState }) => {
      // Cancel if already loading
      const { users } = getState();
      if (users.loading === 'pending') {
        return false;
      }
    }
  }
);

// Auto-generates three action types:
// - 'users/fetchById/pending'
// - 'users/fetchById/fulfilled'
// - 'users/fetchById/rejected'

// Handle in slice
import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
  name: 'users',
  initialState: { entities: {}, loading: 'idle', error: null },
  reducers: {
    // Sync reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.entities[action.payload.id] = action.payload;
        state.loading = 'idle';
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = 'idle';
      });
  }
});

// Advanced: Action batching for performance
import { batch } from 'react-redux';

export const loadDashboard = () => (dispatch) => {
  batch(() => {
    // Multiple dispatches batched into single render
    dispatch(fetchUsers());
    dispatch(fetchPosts());
    dispatch(fetchComments());
  });
};

// Conditional actions
export const likePost = (postId) => (dispatch, getState) => {
  const state = getState();
  const post = state.posts.items.find(p => p.id === postId);
  
  if (post.likedBy.includes(state.auth.userId)) {
    dispatch({ type: 'posts/unlike', payload: postId });
  } else {
    dispatch({ type: 'posts/like', payload: postId });
  }
};
```

## Common Mistakes

### 1. Including Non-Serializable Data in Actions
**Mistake:** Putting functions, Promises, or class instances in action payload.

```javascript
// ❌ BAD: Non-serializable data
dispatch({
  type: 'users/set',
  payload: new User({ id: 1, name: 'Alice' })  // Class instance
});

dispatch({
  type: 'data/fetch',
  payload: fetch('/api/data')  // Promise
});

dispatch({
  type: 'callback/set',
  payload: () => console.log('done')  // Function
});
// Breaks Redux DevTools, persistence, time-travel debugging
```

```javascript
// ✅ GOOD: Plain serializable objects
dispatch({
  type: 'users/set',
  payload: { id: 1, name: 'Alice' }  // Plain object
});

// Handle async in thunks
const fetchData = () => async (dispatch) => {
  const data = await fetch('/api/data');
  dispatch({ type: 'data/set', payload: data });  // Only plain data
};

// Store callback IDs, not functions
dispatch({
  type: 'callback/register',
  payload: { callbackId: 'onComplete' }  // Reference, not function
});
```

**Why it matters:** Redux requires serializable actions for DevTools, persistence, and debugging. Non-serializable data breaks these features.

### 2. Putting Logic in Action Creators
**Mistake:** Complex business logic in action creators instead of reducers/middleware.

```javascript
// ❌ BAD: Logic in action creator
function updateUserAge(userId, newAge) {
  const users = store.getState().users;  // Accessing store directly!
  const user = users.find(u => u.id === userId);
  
  if (user.age === newAge) {
    return { type: 'NO_OP' };  // Conditional logic
  }
  
  const canUpdate = newAge > 0 && newAge < 150;  // Validation
  
  if (!canUpdate) {
    return {
      type: 'users/updateFailed',
      payload: 'Invalid age'
    };
  }
  
  return {
    type: 'users/updateAge',
    payload: { userId, newAge, updatedAt: Date.now() }
  };
}
```

```javascript
// ✅ GOOD: Simple action creator, logic in reducer/middleware
function updateUserAge(userId, newAge) {
  return {
    type: 'users/updateAge',
    payload: { userId, newAge }
  };
}

// Validation in reducer
function usersReducer(state, action) {
  if (action.type === 'users/updateAge') {
    const { userId, newAge } = action.payload;
    
    // Validation logic here
    if (newAge <= 0 || newAge >= 150) {
      return state;  // Ignore invalid updates
    }
    
    return {
      ...state,
      items: state.items.map(u =>
        u.id === userId ? { ...u, age: newAge } : u
      )
    };
  }
  return state;
}
```

**Why it matters:** Action creators should create actions, not contain business logic. Logic belongs in reducers (sync) or middleware (async).

### 3. Inconsistent Action Naming
**Mistake:** No naming convention for action types.

```javascript
// ❌ BAD: Inconsistent naming
const actions = {
  addUser: { type: 'ADD_USER' },  // SCREAMING_SNAKE_CASE
  deleteUser: { type: 'user-delete' },  // kebab-case
  UpdateUser: { type: 'updateUser' },  // camelCase
  user_fetch: { type: 'FETCH' }  // snake_case, ambiguous type
};
// Hard to track, error-prone
```

```javascript
// ✅ GOOD: Consistent naming (domain/event)
const actions = {
  addUser: { type: 'users/add' },
  deleteUser: { type: 'users/delete' },
  updateUser: { type: 'users/update' },
  fetchUser: { type: 'users/fetch' }
};

// Or Redux Toolkit approach
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    add: (state, action) => { /* ... */ },  // Auto-generates 'users/add'
    delete: (state, action) => { /* ... */ },  // Auto-generates 'users/delete'
    update: (state, action) => { /* ... */ }  // Auto-generates 'users/update'
  }
});
```

**Why it matters:** Consistent naming improves debugging, reduces typos, and makes action logs readable. Convention: `domain/event` (e.g., `users/add`, `cart/checkout`).

## Quick Quiz

<details>
<summary><strong>Question 1:</strong> What's the difference between action types and action creators?</summary>

**Answer:** **Action types are string constants; action creators are functions that return actions:**

**Action Type (constant):**
```javascript
// Action type - just a string
const ADD_TODO = 'todos/add';

// Used directly
dispatch({ type: ADD_TODO, payload: 'Buy milk' });

// Benefits: prevents typos, easier refactoring
```

**Action Creator (function):**
```javascript
// Action creator - function returning action object
function addTodo(text) {
  return {
    type: 'todos/add',
    payload: {
      id: nanoid(),
      text,
      completed: false
    }
  };
}

// Usage
dispatch(addTodo('Buy milk'));

// Benefits: encapsulates creation logic, easier to test
```

**Why both exist:**

| Aspect | Action Type | Action Creator |
|--------|-------------|----------------|
| **What** | String constant | Function |
| **Purpose** | Identify action | Create action object |
| **Used in** | Reducers, middleware | Components, thunks |
| **Benefits** | Type safety, no typos | Reusability, consistency |

**Example using both:**
```javascript
// Define type
export const ADD_TODO = 'todos/add';

// Create action creator using type
export const addTodo = (text) => ({
  type: ADD_TODO,
  payload: { text }
});

// Use in reducer
function reducer(state, action) {
  switch (action.type) {
    case ADD_TODO:  // Type constant
      return [...state, action.payload];
    default:
      return state;
  }
}

// Use in component
dispatch(addTodo('Buy milk'));  // Action creator
```

**Modern approach (Redux Toolkit):**
```javascript
import { createAction } from '@reduxjs/toolkit';

// Combines both - function with .type property
const addTodo = createAction('todos/add');

addTodo('Buy milk');  // Function call
addTodo.type;  // 'todos/add' (type constant)

// Use in reducer
if (action.type === addTodo.type) { /* ... */ }
// Or use matcher
builder.addCase(addTodo, (state, action) => { /* ... */ });
```

**Why it matters:** Action types ensure consistency across reducers and middleware. Action creators ensure consistency across components dispatching actions.
</details>

<details>
<summary><strong>Question 2:</strong> When should you use thunks vs action creators?</summary>

**Answer:** **Use thunks for async operations or complex logic; use simple action creators for straightforward actions:**

**Simple Action Creator (sync, straightforward):**
```javascript
// Use when: Action is just data, no side effects
const increment = () => ({ type: 'counter/increment' });
const setUser = (user) => ({ type: 'auth/setUser', payload: user });

// Dispatch directly
dispatch(increment());
dispatch(setUser({ id: 1, name: 'Alice' }));
```

**Thunk (async or complex logic):**
```javascript
// Use when: Need async operations, multiple dispatches, or conditional logic

// 1. Async operations (API calls)
const fetchUser = (userId) => async (dispatch) => {
  dispatch({ type: 'users/fetchStart' });
  
  try {
    const res = await fetch(`/api/users/${userId}`);
    const user = await res.json();
    dispatch({ type: 'users/fetchSuccess', payload: user });
  } catch (error) {
    dispatch({ type: 'users/fetchFailure', payload: error.message });
  }
};

// 2. Multiple dispatches
const login = (credentials) => (dispatch) => {
  dispatch({ type: 'auth/loginStart' });
  dispatch({ type: 'ui/showLoading' });
  dispatch({ type: 'analytics/trackLogin' });
  
  return apiClient.login(credentials)
    .then(user => {
      dispatch({ type: 'auth/loginSuccess', payload: user });
      dispatch({ type: 'ui/hideLoading' });
    });
};

// 3. Conditional logic (access state)
const addTodoIfNotExists = (text) => (dispatch, getState) => {
  const { todos } = getState();
  
  if (todos.some(t => t.text === text)) {
    return;  // Don't add duplicate
  }
  
  dispatch({ type: 'todos/add', payload: text });
};

// 4. Delayed actions
const showNotification = (message, duration = 3000) => (dispatch) => {
  const id = nanoid();
  
  dispatch({ type: 'notifications/show', payload: { id, message } });
  
  setTimeout(() => {
    dispatch({ type: 'notifications/hide', payload: id });
  }, duration);
};
```

**Decision flowchart:**
```
Does action need to:
  - Make API calls?           → Thunk
  - Access current state?     → Thunk
  - Dispatch multiple actions? → Thunk
  - Have delays/timers?       → Thunk
  - Just describe what happened? → Simple action creator
```

**Example comparison:**
```javascript
// ❌ Wrong: Using thunk for simple action
const setTheme = (theme) => (dispatch) => {
  dispatch({ type: 'ui/setTheme', payload: theme });
};  // Unnecessary complexity

// ✅ Right: Simple action creator
const setTheme = (theme) => ({ type: 'ui/setTheme', payload: theme });

// ❌ Wrong: Using simple action for async
const fetchUser = (id) => ({ type: 'users/fetch', payload: id });
// Where does the API call happen??

// ✅ Right: Thunk for async
const fetchUser = (id) => async (dispatch) => {
  const user = await api.fetchUser(id);
  dispatch({ type: 'users/fetchSuccess', payload: user });
};
```

**Why it matters:** Thunks handle complexity (async, side effects) while keeping reducers pure. Simple actions keep dispatching straightforward when no complexity needed.
</details>

<details>
<summary><strong>Question 3:</strong> What is the Flux Standard Action (FSA) format?</summary>

**Answer:** **FSA is a convention for consistent action object structure:**

**FSA format:**
```typescript
interface FluxStandardAction {
  type: string;          // Required: action identifier
  payload?: any;         // Optional: action data
  error?: boolean;       // Optional: true if action represents error
  meta?: any;            // Optional: extra info not part of payload
}
```

**Examples:**
```javascript
// Basic FSA action
{
  type: 'todos/add',
  payload: { id: 1, text: 'Buy milk' }
}

// FSA error action
{
  type: 'users/fetchFailure',
  payload: new Error('Network error'),  // Payload is the error
  error: true  // Signals this is an error
}

// FSA with meta
{
  type: 'posts/create',
  payload: { title: 'Hello', body: '...' },
  meta: {
    timestamp: 1234567890,
    offline: true,  // Metadata for middleware
    analytics: { category: 'content', action: 'create' }
  }
}
```

**Why FSA matters:**

**1. Consistency:**
```javascript
// ❌ Non-FSA (inconsistent)
{ type: 'ADD_TODO', todo: { text: 'Buy milk' } }
{ type: 'DELETE_TODO', id: 1 }
{ type: 'FETCH_ERROR', errorMessage: 'Failed' }
// Different keys for data: 'todo', 'id', 'errorMessage'

// ✅ FSA (consistent)
{ type: 'todos/add', payload: { text: 'Buy milk' } }
{ type: 'todos/delete', payload: 1 }
{ type: 'todos/fetchFailure', payload: 'Failed', error: true }
// Always use 'payload' for data
```

**2. Error handling:**
```javascript
// Middleware can generically handle errors
const errorMiddleware = store => next => action => {
  if (action.error) {
    // Log all errors consistently
    console.error('Action error:', action.type, action.payload);
    
    // Show user notification
    store.dispatch({
      type: 'notifications/error',
      payload: action.payload.message
    });
  }
  
  return next(action);
};
```

**3. Type safety (TypeScript):**
```typescript
import { Action, PayloadAction } from '@reduxjs/toolkit';

// FSA-compliant types
type AppAction =
  | PayloadAction<string, 'todos/add'>
  | PayloadAction<number, 'todos/delete'>
  | PayloadAction<Error, 'todos/error', { error: true }>;

function reducer(state: State, action: AppAction) {
  // Type-safe payload access
  if (action.type === 'todos/add') {
    action.payload;  // Typed as string
  }
}
```

**4. Tooling compatibility:**
```javascript
// Redux DevTools, redux-actions, redux-toolkit all expect FSA
import { createAction } from '@reduxjs/toolkit';

const addTodo = createAction('todos/add');  // Auto-FSA compliant

addTodo('Buy milk');
// { type: 'todos/add', payload: 'Buy milk' }
```

**Non-payload data goes in `meta`:**
```javascript
// ❌ Wrong: Mixing payload and metadata
{
  type: 'posts/create',
  payload: { title: 'Hello' },
  timestamp: Date.now(),  // Metadata at root level
  userId: 123
}

// ✅ Right: Separate payload from meta
{
  type: 'posts/create',
  payload: { title: 'Hello' },
  meta: {
    timestamp: Date.now(),
    userId: 123
  }
}
```

**Why it matters:** FSA provides a standard contract for actions, enabling reusable middleware, better TypeScript support, and consistent error handling.
</details>

<details>
<summary><strong>Question 4:</strong> How do you test action creators?</summary>

**Answer:** **Simple action creators: test returned object; thunks: test dispatched actions:**

**Testing simple action creators:**
```javascript
import { addTodo, toggleTodo } from './actions';

describe('action creators', () => {
  test('addTodo creates ADD_TODO action', () => {
    const text = 'Buy milk';
    const action = addTodo(text);
    
    expect(action).toEqual({
      type: 'todos/add',
      payload: {
        id: expect.any(Number),
        text: 'Buy milk',
        completed: false
      }
    });
  });
  
  test('toggleTodo creates TOGGLE_TODO action', () => {
    const action = toggleTodo(5);
    
    expect(action).toEqual({
      type: 'todos/toggle',
      payload: 5
    });
  });
});
```

**Testing thunks (async action creators):**
```javascript
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'jest-fetch-mock';
import { fetchUsers } from './actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('fetchUsers thunk', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });
  
  test('dispatches fetchStart and fetchSuccess on successful fetch', async () => {
    const users = [{ id: 1, name: 'Alice' }];
    fetchMock.mockResponseOnce(JSON.stringify(users));
    
    const store = mockStore({ users: { items: [] } });
    
    await store.dispatch(fetchUsers());
    
    const actions = store.getActions();
    expect(actions).toEqual([
      { type: 'users/fetchStart' },
      { type: 'users/fetchSuccess', payload: users }
    ]);
  });
  
  test('dispatches fetchFailure on error', async () => {
    fetchMock.mockReject(new Error('Network error'));
    
    const store = mockStore({ users: { items: [] } });
    
    await store.dispatch(fetchUsers());
    
    const actions = store.getActions();
    expect(actions).toEqual([
      { type: 'users/fetchStart' },
      { type: 'users/fetchFailure', payload: 'Network error', error: true }
    ]);
  });
});
```

**Testing thunks with getState:**
```javascript
const addTodoIfNotExists = (text) => (dispatch, getState) => {
  const { todos } = getState();
  
  if (todos.some(t => t.text === text)) {
    return;
  }
  
  dispatch({ type: 'todos/add', payload: text });
};

// Test
test('does not add duplicate todo', () => {
  const store = mockStore({
    todos: [{ text: 'Existing todo' }]
  });
  
  store.dispatch(addTodoIfNotExists('Existing todo'));
  
  expect(store.getActions()).toEqual([]);  // No actions dispatched
});

test('adds non-duplicate todo', () => {
  const store = mockStore({
    todos: [{ text: 'Existing todo' }]
  });
  
  store.dispatch(addTodoIfNotExists('New todo'));
  
  expect(store.getActions()).toEqual([
    { type: 'todos/add', payload: 'New todo' }
  ]);
});
```

**Testing Redux Toolkit actions:**
```javascript
import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    add: (state, action) => {
      state.push(action.payload);
    }
  }
});

const { add } = todosSlice.actions;

test('add action creator', () => {
  const todo = { id: 1, text: 'Buy milk' };
  const action = add(todo);
  
  expect(action.type).toBe('todos/add');
  expect(action.payload).toEqual(todo);
});
```

**Snapshot testing:**
```javascript
test('addTodo matches snapshot', () => {
  const action = addTodo('Buy milk');
  expect(action).toMatchSnapshot();
});
// Saves action structure, alerts if changed
```

**Why it matters:** Testing action creators ensures consistent action structure. Testing thunks verifies async logic and dispatch sequences.
</details>

<details>
<summary><strong>Question 5:</strong> What's the difference between action creators and action types constants?</summary>

**Answer:** Covered in Question 1 - see above for comprehensive comparison.
</details>

## References