---
description: Guidance for Selectors - efficient state data extraction
name: Selectors - State
applyTo: |
  **/store/**/*.{js,ts}
  **/selectors/**/*.{js,ts}
  **/*Selectors*.{js,ts}
  **/*slice*.{js,ts}
---

# Selectors Instructions

## What are Selectors?

Selectors are pure functions that extract and compute derived data from state. They're the "read layer" between raw Redux state and components—transforming, filtering, and memoizing data so components get exactly what they need without re-computing on every render.

## Key Principles

1. **Computed Properties**: Selectors derive data (filter active todos, calculate totals) from raw state. Never store derived data—compute it with selectors.

2. **Memoization**: Reselect's `createSelector` caches results. Expensive computations (filtering 10,000 items) only run when inputs change.

3. **State Shape Abstraction**: Components use selectors, not raw state paths. When you refactor state structure, update selectors—not every component.

## Best Practices

✅ **DO**:
- Use `createSelector` from Reselect for derived data
- Start with simple input selectors, compose complex ones
- Memoize expensive computations
- Colocate selectors with slices
- Name selectors `selectXxx`

❌ **DON'T**:
- Access state directly in components (`state.todos.items`)
- Compute derived data in components
- Create selectors that return new objects every time
- Skip memoization for filtered/sorted lists
- Make selectors impure

## Code Patterns

### Basic Input Selectors

```javascript
// Simple extraction - no memoization needed
export const selectTodos = (state) => state.todos.items;
export const selectTodosLoading = (state) => state.todos.loading;
export const selectFilter = (state) => state.todos.filter;
export const selectSearchTerm = (state) => state.todos.searchTerm;
```

### Memoized Derived Selectors

```javascript
import { createSelector } from 'reselect';

// Memoized: only recalculates when inputs change
export const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter, selectSearchTerm],
  (todos, filter, searchTerm) => {
    let filtered = todos;
    
    // Filter by status
    if (filter === 'active') {
      filtered = filtered.filter(t => !t.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(t => t.completed);
    }
    
    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }
);

// Composed selectors
export const selectCompletedCount = createSelector(
  [selectTodos],
  (todos) => todos.filter(t => t.completed).length
);

export const selectTodoStats = createSelector(
  [selectTodos],
  (todos) => ({
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length
  })
);
```

### Parameterized Selectors

```javascript
// Selector factory for passing arguments
export const makeSelectTodoById = () => createSelector(
  [selectTodos, (_, todoId) => todoId],
  (todos, todoId) => todos.find(t => t.id === todoId)
);

// Usage in component
const selectTodoById = useMemo(makeSelectTodoById, []);
const todo = useSelector(state => selectTodoById(state, todoId));
```

### RTK Integration

```javascript
// todosSlice.js
import { createSlice, createSelector } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: { items: [], filter: 'all' },
  reducers: { /* ... */ }
});

// Colocated selectors
export const selectTodosState = (state) => state.todos;

export const selectAllTodos = createSelector(
  [selectTodosState],
  (todosState) => todosState.items
);

export const selectVisibleTodos = createSelector(
  [selectAllTodos, selectTodosState],
  (todos, { filter }) => {
    switch (filter) {
      case 'active': return todos.filter(t => !t.completed);
      case 'completed': return todos.filter(t => t.completed);
      default: return todos;
    }
  }
);
```

### Usage in Components

```jsx
import { useSelector } from 'react-redux';
import { selectFilteredTodos, selectTodoStats } from './todosSelectors';

function TodoList() {
  // Memoized selector - only re-renders when filtered list changes
  const todos = useSelector(selectFilteredTodos);
  const { total, completed } = useSelector(selectTodoStats);
  
  return (
    <div>
      <p>{completed} of {total} completed</p>
      {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </div>
  );
}
```

## Related Terminologies

- **Store** (State) - Selectors read from store
- **Reducer** (State) - Produces state selectors read
- **Container** (Server) - Uses selectors for data
- **Props** (UI) - Selectors provide component props

## Quality Gates

- [ ] Input selectors for raw state paths
- [ ] `createSelector` for derived data
- [ ] Memoization for expensive computations
- [ ] Selectors colocated with slices
- [ ] No direct state access in components
- [ ] Naming convention (`selectXxx`)

**Source**: `/docs/state/selectors.md`
