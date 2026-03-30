---
description: Guidance for State fundamentals and management patterns
name: State - State
applyTo: |
  **/state/**/*.{js,ts}
  **/store/**/*.{js,ts}
  **/*State*.{js,ts}
---

# State Instructions

## What is State?

State is the memory of your application—any data that changes over time: user input, API responses, UI toggles, form values. Managing state means deciding what lives where (local vs global), keeping it synchronized, and making updates predictable.

## Key Principles

1. **Local vs Global**: Form input = local (useState). User auth = global (Redux). Over-globalizing creates complexity; under-globalizing causes prop drilling.

2. **Single Source of Truth**: Each piece of data should have one authoritative location. Avoid duplicating state across components.

3. **Unidirectional Data Flow**: State flows down (props), events flow up (callbacks). Predictable data flow makes debugging easier.

## Types of State

| Type | Location | Example | Tool |
|------|----------|---------|------|
| Local | Component | Input value, dropdown open | useState |
| Global | Store | User, theme, cart | Redux/Zustand |
| Server | Cache | API data | React Query/RTK Query |
| URL | Browser | Page, filters | React Router |

## Best Practices

✅ **DO**:
- Start with local state, lift up when needed
- Use server state tools for API data (React Query)
- Keep state normalized in global store
- Derive computed values (don't store them)
- Use URL state for shareable state (filters, pagination)

❌ **DON'T**:
- Store everything in global state
- Duplicate state across components
- Store derived data (calculate with selectors)
- Mutate state directly
- Forget to handle loading/error states

## Code Patterns

### Local State (Component)

```jsx
// Single component state
function SearchInput() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={focused ? 'focused' : ''}
    />
  );
}
```

### Lifted State (Parent)

```jsx
// State shared between siblings
function ProductPage() {
  const [selectedSize, setSelectedSize] = useState(null);
  
  return (
    <>
      <SizeSelector 
        selected={selectedSize} 
        onSelect={setSelectedSize} 
      />
      <AddToCart 
        disabled={!selectedSize}
        size={selectedSize}
      />
    </>
  );
}
```

### Global State (Redux)

```javascript
// State needed across app
const userSlice = createSlice({
  name: 'user',
  initialState: { profile: null, isAuthenticated: false },
  reducers: {
    login(state, action) {
      state.profile = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.profile = null;
      state.isAuthenticated = false;
    }
  }
});
```

### Server State (React Query)

```jsx
// API data with caching
function UserProfile({ userId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.getUser(userId),
    staleTime: 5 * 60 * 1000  // Cache for 5 minutes
  });
  
  if (isLoading) return <Skeleton />;
  if (error) return <Error message={error.message} />;
  
  return <Profile user={data} />;
}
```

### URL State

```jsx
// Shareable, bookmarkable state
function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';
  const page = parseInt(searchParams.get('page') || '1');
  
  const setFilter = (newFilter) => {
    setSearchParams({ filter: newFilter, page: '1' });
  };
  
  // URL: /products?filter=active&page=2
}
```

## State Decision Tree

```
Is state needed by multiple unrelated components?
  Yes → Global state (Redux/Zustand)
  No → Is it from an API?
    Yes → Server state (React Query)
    No → Is it shareable/bookmarkable?
      Yes → URL state (searchParams)
      No → Local state (useState)
```

## Related Terminologies

- **Store** (State) - Centralized global state
- **Actions** (State) - Events that change state
- **Reducer** (State) - Functions that update state
- **Props** (UI) - Passing state to children

## Quality Gates

- [ ] Appropriate state location chosen
- [ ] No duplicated state
- [ ] Loading/error states handled
- [ ] Server state uses caching layer
- [ ] Derived data computed, not stored
- [ ] State is serializable

**Source**: `/docs/state/state.md`
