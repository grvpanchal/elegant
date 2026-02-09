---
description: Guidance for Operations - async state management patterns
name: Operations - State
applyTo: |
  **/store/**/*.{js,ts}
  **/operations/**/*.{js,ts}
  **/*thunk*.{js,ts}
---

# Operations Instructions

## What are Operations?

Operations are async workflows that coordinate actions, API calls, and state updates. They handle the complexity of loading states, error handling, optimistic updates, and batching—keeping components simple and state predictable.

## Key Principles

1. **Explicit State Management**: Every async operation tracks three states: loading (pending), success (fulfilled), error (rejected). Components react to these states.

2. **Optimistic Updates**: Update UI immediately, sync with server in background. Roll back on failure. Creates snappy user experience.

3. **Batching & Debouncing**: Group frequent mutations to reduce network requests. Debounce search inputs, batch related updates.

## Best Practices

✅ **DO**:
- Track loading/success/error for each operation
- Implement optimistic updates for responsive UX
- Debounce frequent operations (search, autosave)
- Use RTK createAsyncThunk for async actions
- Cancel outdated requests

❌ **DON'T**:
- Ignore error states (always show feedback)
- Skip loading indicators (users need feedback)
- Forget to handle race conditions
- Make too many sequential requests (batch them)
- Leave stale data after mutations

## Code Patterns

### Explicit State Management

```javascript
// todosSlice.js
const initialState = {
  items: [],
  status: 'idle',  // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

// Async thunk
export const fetchTodos = createAsyncThunk(
  'todos/fetch',
  async () => await api.getTodos()
);

// Slice
const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});
```

### Optimistic Updates

```javascript
// optimisticToggle.js
export const toggleTodo = createAsyncThunk(
  'todos/toggle',
  async (id, { dispatch, getState, rejectWithValue }) => {
    const todo = getState().todos.items.find(t => t.id === id);
    
    // Optimistic update
    dispatch(todosSlice.actions.optimisticToggle(id));
    
    try {
      await api.updateTodo(id, { completed: !todo.completed });
      return { id, completed: !todo.completed };
    } catch (error) {
      // Rollback on failure
      dispatch(todosSlice.actions.optimisticToggle(id));
      return rejectWithValue(error.message);
    }
  }
);

// In slice reducers
reducers: {
  optimisticToggle(state, action) {
    const todo = state.items.find(t => t.id === action.payload);
    if (todo) todo.completed = !todo.completed;
  }
}
```

### Debounced Search

```javascript
// useDebounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

// SearchComponent
function Search() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (debouncedQuery) {
      dispatch(searchProducts(debouncedQuery));
    }
  }, [debouncedQuery, dispatch]);
  
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

### Race Condition Handling

```javascript
// Cancel outdated requests
export const searchProducts = createAsyncThunk(
  'products/search',
  async (query, { signal }) => {
    const response = await fetch(`/api/search?q=${query}`, { signal });
    return response.json();
  }
);

// In component - abort previous request
const searchPromiseRef = useRef();

const handleSearch = (query) => {
  searchPromiseRef.current?.abort();
  searchPromiseRef.current = dispatch(searchProducts(query));
};
```

### Component Usage

```jsx
function TodoList() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(state => state.todos);
  
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);
  
  if (status === 'loading') return <LoadingSpinner />;
  if (status === 'failed') return <ErrorMessage message={error} />;
  if (items.length === 0) return <EmptyState />;
  
  return items.map(todo => <TodoItem key={todo.id} todo={todo} />);
}
```

## Related Terminologies

- **Ajax** (State) - HTTP requests in operations
- **Middleware** (State) - Async thunk middleware
- **Actions** (State) - Pending/fulfilled/rejected
- **CRUD** (State) - Operation types for data

## Quality Gates

- [ ] Loading/error/success states tracked
- [ ] Optimistic updates where appropriate
- [ ] Debouncing for frequent operations
- [ ] Race conditions handled
- [ ] Error feedback to users
- [ ] Request cancellation on unmount

**Source**: `/docs/state/operations.md`
