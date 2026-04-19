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

{% include quiz.html id="actions-1"
   question="What's the difference between an action type and an action creator?"
   options="A|{ type, meta } — a minimal envelope where type identifies the action and meta carries the payload as a structured map, standardised by Redux 5;;B|{ type, payload, error?, meta? } — a consistent envelope where type identifies the action, payload carries the data, error=true flags failure (in which case payload is the Error), and meta holds cross-cutting info (requestId, timestamp, optimistic). createAction in RTK emits FSA-compliant creators by default;;C|Any plain object — Redux imposes no shape on actions as long as they can be serialized;;D|{ op, args, id } — an RPC-style envelope borrowed from JSON-RPC 2.0"
   correct="B"
   explanation="Types are the wire format. Creators encapsulate payload shaping, default fields, and any input coercion so callers just pass raw data." %}

{% include quiz.html id="actions-2"
   question="When should you reach for a thunk (or RTK's createAsyncThunk) vs a plain action creator?"
   options="A|Plain action creators return a bare action object (sync, pure). Thunks return a function that receives (dispatch, getState) so you can sequence async work, read state, and dispatch multiple actions — use them when an action needs to fetch, branch, or dispatch more actions. For complex async flows a saga/epic may suit better;;B|Thunks are only for Angular;;C|Plain action creators can't return objects;;D|Always use thunks"
   correct="A"
   explanation="Thunks are the simplest way to add async to Redux. If you find thunks getting complex (cancellation, retries, race conditions) that's the signal to step up to sagas/epics or RTK Query." %}

{% include quiz.html id="actions-3"
   question="What is the Flux Standard Action (FSA) shape?"
   options="A|{ name, data };;B|Any object shape at all;;C|{ type, payload, error?, meta? } — a consistent envelope where type identifies the action, payload carries the data, error flags failure (in which case payload is the Error), and meta holds cross-cutting info (requestId, timestamp). Keeps reducers/middleware predictable;;D|{ op, args }"
   correct="C"
   explanation="FSA is the de-facto contract the Redux ecosystem agrees on. RTK's createAction produces FSA-compliant creators by default." %}

{% include quiz.html id="actions-4"
   question="How should you unit-test an action creator?"
   options="A|You can't test action creators;;B|Call the creator with input and assert the returned action object equals the expected shape (type + payload + any meta). For thunk creators, call the returned function with mocked dispatch/getState and assert the sequence of dispatches. Pure inputs in, asserted outputs out;;C|Integration-test via the UI only;;D|Wrap it in a component and render"
   correct="B"
   explanation="Action creators are pure fns (even thunks are fns), which makes them the easiest thing to test in the whole stack — a few expect(creator(args)).toEqual(...) calls." %}

{% include quiz.html id="actions-5"
   question="Why keep action-type constants separate from action creators?"
   options="A|Creators can't reference constants;;B|The constants are imported by reducers, middleware, sagas, devtools, and tests — centralising them prevents typos, makes rename refactors safe, and keeps the &quot;string catalog&quot; discoverable. In RTK, createSlice generates both for you so the concern is automated away;;C|It's a historical quirk;;D|They must be in separate files for performance"
   correct="B"
   explanation="A typo'd string in one place is a bug that slips past TypeScript; a typo'd imported constant is a compile error. RTK hides this by auto-deriving types from slice names." %}

## References