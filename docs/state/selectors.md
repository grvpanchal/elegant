---
title: Selectors
layout: doc
slug: selectors
---

# Selectors

> - Pure functions extracting derived data from state
> - Memoization prevents expensive recomputations
> - Decouple components from state shape

## Key Insight

Selectors are the "computed properties" of Redux—they transform raw state into the exact shape your components need, and memoization ensures expensive computations only run when their inputs actually change. Without selectors, every component re-render triggers full data transformations (filtering, sorting, aggregating), but with memoized selectors like Reselect, a 10,000-item list gets filtered once and cached until the list changes. Selectors also future-proof your code: when you refactor state structure, you update selectors, not every component.

## Detailed Description

Selectors in state management are pure functions that extract and compute derived data from the application's state. They act as the "read" layer between raw Redux state and React components, transforming state into component-friendly formats without modifying the state itself.

The selector pattern emerged to solve several problems: components were duplicating transformation logic, expensive computations ran on every render, and state shape changes required updating dozens of components. Selectors centralize this logic, add memoization for performance, and create a clean API layer over state.

Key aspects of selectors:
- **Efficiency**: Selectors use memoization to optimize performance, especially for expensive computations
- **Reusability**: They can be shared across multiple components that need the same data
- **Simplification**: Selectors can create view models that combine multiple pieces of state, simplifying component logic
- **Encapsulation**: Hide state structure from components, making refactoring easier
- **Testability**: Pure functions are trivial to unit test independently of components

## Code Examples

### Basic Example: Simple Selectors

```javascript
// selectors.js - Basic state extraction
const selectTodos = (state) => state.todos.items;
const selectTodosLoading = (state) => state.todos.loading;
const selectTodosFilter = (state) => state.todos.filter;

// Component usage
import { useSelector } from 'react-redux';

function TodoList() {
  const todos = useSelector(selectTodos);
  const loading = useSelector(selectTodosLoading);
  
  if (loading) return <Spinner />;
  
  return todos.map(todo => <TodoItem key={todo.id} todo={todo} />);
}
```

### Practical Example: Memoized Selectors with Reselect

```javascript
import { createSelector } from 'reselect';

// Input selectors (simple extraction)
const selectTodos = state => state.todos.items;
const selectFilter = state => state.todos.filter;
const selectSearchTerm = state => state.todos.searchTerm;

// Memoized derived selector
const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter, selectSearchTerm],
  (todos, filter, searchTerm) => {
    // Expensive computation - only runs when inputs change
    let filtered = todos;
    
    // Filter by completion status
    if (filter === 'active') {
      filtered = filtered.filter(t => !t.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(t => t.completed);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }
);

// Composed selectors
const selectTodoById = createSelector(
  [selectTodos, (_, todoId) => todoId],
  (todos, todoId) => todos.find(t => t.id === todoId)
);

const selectCompletedCount = createSelector(
  [selectTodos],
  (todos) => todos.filter(t => t.completed).length
);

const selectTodoStats = createSelector(
  [selectTodos],
  (todos) => ({
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length
  })
);

// Usage
function TodoStats() {
  const stats = useSelector(selectTodoStats);
  
  return (
    <div>
      Total: {stats.total} | Active: {stats.active} | Done: {stats.completed}
    </div>
  );
}
```

### Advanced Example: Parametrized and Normalized Selectors

```javascript
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';

// Normalized state structure
const state = {
  users: {
    byId: {
      '1': { id: '1', name: 'Alice', postIds: ['101', '102'] },
      '2': { id: '2', name: 'Bob', postIds: ['103'] }
    },
    allIds: ['1', '2']
  },
  posts: {
    byId: {
      '101': { id: '101', title: 'Post 1', authorId: '1' },
      '102': { id: '102', title: 'Post 2', authorId: '1' },
      '103': { id: '103', title: 'Post 3', authorId: '2' }
    },
    allIds: ['101', '102', '103']
  }
};

// Base selectors
const selectUsersById = state => state.users.byId;
const selectPostsById = state => state.posts.byId;

// Parametrized selector factory
const makeSelectUserById = () =>
  createSelector(
    [selectUsersById, (_, userId) => userId],
    (usersById, userId) => usersById[userId]
  );

// Denormalized selector (joins data)
const makeSelectUserWithPosts = () =>
  createSelector(
    [makeSelectUserById(), selectPostsById],
    (user, postsById) => {
      if (!user) return null;
      
      return {
        ...user,
        posts: user.postIds.map(id => postsById[id])
      };
    }
  );

// Custom equality check for deep comparisons
const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  (a, b) => JSON.stringify(a) === JSON.stringify(b)
);

const selectFilteredUsers = createDeepEqualSelector(
  [selectUsersById, (_, filter) => filter],
  (usersById, filter) => {
    return Object.values(usersById).filter(user =>
      user.name.includes(filter.name) &&
      user.age > filter.minAge
    );
  }
);

// Usage with React
function UserProfile({ userId }) {
  // Create selector instance per component instance
  const selectUserWithPosts = useMemo(makeSelectUserWithPosts, []);
  
  const user = useSelector(state => selectUserWithPosts(state, userId));
  
  return (
    <div>
      <h1>{user.name}</h1>
      <ul>
        {user.posts.map(post => <li key={post.id}>{post.title}</li>)}
      </ul>
    </div>
  );
}
```

## Common Mistakes

### 1. Creating New Objects in Selectors Without Memoization
**Mistake:** Returning new object references on every call.

```javascript
// ❌ BAD: New array created every call
const selectActiveTodos = (state) => {
  return state.todos.filter(t => !t.completed);  // New array every time
};

// Component re-renders infinitely
function TodoList() {
  const todos = useSelector(selectActiveTodos);
  // todos is new array every render → triggers re-render → infinite loop
}
```

```javascript
// ✅ GOOD: Memoized selector
import { createSelector } from 'reselect';

const selectTodos = state => state.todos;

const selectActiveTodos = createSelector(
  [selectTodos],
  (todos) => todos.filter(t => !t.completed)
  // Only recomputes when todos array changes
);
```

**Why it matters:** Non-memoized selectors returning new objects cause unnecessary re-renders. Reselect memoization prevents this.

### 2. Sharing Selector Instances Across Components
**Mistake:** Using single parametrized selector for multiple component instances.

```javascript
// ❌ BAD: Shared selector instance
const selectUserById = createSelector(
  [state => state.users, (_, id) => id],
  (users, id) => users.find(u => u.id === id)
);

function UserList({ userIds }) {
  return userIds.map(id => <UserCard key={id} userId={id} />);
}

function UserCard({ userId }) {
  const user = useSelector(state => selectUserById(state, userId));
  // Selector cache thrashes - different userId each component
  return <div>{user.name}</div>;
}
```

```javascript
// ✅ GOOD: Selector factory
const makeSelectUserById = () =>
  createSelector(
    [state => state.users, (_, id) => id],
    (users, id) => users.find(u => u.id === id)
  );

function UserCard({ userId }) {
  const selectUserById = useMemo(makeSelectUserById, []);
  const user = useSelector(state => selectUserById(state, userId));
  return <div>{user.name}</div>;
}
```

**Why it matters:** Shared parametrized selectors lose memoization benefits. Create selector instance per component instance.

### 3. Putting Non-Serializable Data in Selectors
**Mistake:** Returning functions, class instances, or other non-serializable data.

```javascript
// ❌ BAD: Non-serializable result
const selectTodoHandlers = createSelector(
  [selectTodos],
  (todos) => ({
    todos,
    addTodo: (text) => dispatch(addTodo(text)),  // Function!
    deleteTodo: (id) => dispatch(deleteTodo(id))
  })
);
```

```javascript
// ✅ GOOD: Return data only
const selectTodos = state => state.todos;

// Handlers in component
function TodoList() {
  const todos = useSelector(selectTodos);
  const dispatch = useDispatch();
  
  const handleAdd = useCallback((text) => {
    dispatch(addTodo(text));
  }, [dispatch]);
  
  return <Todos todos={todos} onAdd={handleAdd} />;
}
```

**Why it matters:** Selectors should return serializable data. Functions belong in components or hooks.

## Quick Quiz

<details>
<summary><strong>Question 1:</strong> What problem does memoization solve in selectors?</summary>

**Answer:** **Memoization prevents expensive recomputations when inputs haven't changed:**

**Without memoization:**
```javascript
// ❌ Recomputes every render
const selectExpensiveData = (state) => {
  return state.todos
    .filter(t => !t.completed)
    .map(t => ({ ...t, formatted: formatDate(t.dueDate) }))
    .sort((a, b) => a.dueDate - b.dueDate);
  // Runs every component render, even if todos unchanged
};

// 60fps = 60 renders/sec → 60 computations/sec!
```

**With memoization:**
```javascript
// ✅ Recomputes only when todos change
const selectExpensiveData = createSelector(
  [state => state.todos],
  (todos) => {
    return todos
      .filter(t => !t.completed)
      .map(t => ({ ...t, formatted: formatDate(t.dueDate) }))
      .sort((a, b) => a.dueDate - b.dueDate);
    // Runs once, caches result, returns cached value until todos change
  }
);
```

**Performance impact:**
```javascript
// Benchmark
console.time('unmemoized');
for (let i = 0; i < 1000; i++) {
  unmemoizedSelector(state);  // ~500ms
}
console.timeEnd('unmemoized');

console.time('memoized');
for (let i = 0; i < 1000; i++) {
  memoizedSelector(state);  // ~1ms (999 cached)
}
console.timeEnd('memoized');
```

**Why it matters:** Memoization improves performance 100x-1000x for expensive computations, preventing jank and battery drain.
</details>

<details>
<summary><strong>Question 2:</strong> How do you compose multiple selectors?</summary>

**Answer:** **Use createSelector with multiple input selectors:**

```javascript
// Base selectors
const selectTodos = state => state.todos;
const selectFilter = state => state.filter;
const selectUser = state => state.user;

// Composed selector 1
const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => {
    if (filter === 'active') return todos.filter(t => !t.completed);
    if (filter === 'completed') return todos.filter(t => t.completed);
    return todos;
  }
);

// Composed selector 2 (uses selector 1)
const selectUserTodos = createSelector(
  [selectFilteredTodos, selectUser],
  (todos, user) => todos.filter(t => t.authorId === user.id)
);

// Composed selector 3 (aggregation)
const selectTodoStats = createSelector(
  [selectUserTodos],
  (todos) => ({
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    overdue: todos.filter(t => t.dueDate < Date.now()).length
  })
);
```

**Composition benefits:**
- **Reusability**: `selectFilteredTodos` used in multiple places
- **Memoization chain**: Each level caches independently
- **Modularity**: Change one selector without affecting others

**Why it matters:** Composition builds complex selectors from simple ones, maximizing reuse and memoization efficiency.
</details>

<details>
<summary><strong>Question 3:</strong> When should you use selector factories vs regular selectors?</summary>

**Answer:** **Use selector factories for parametrized selectors used by multiple component instances:**

**Regular selector (shared):**
```javascript
// ✅ Good for: Global/shared data
const selectAllUsers = createSelector(
  [state => state.users],
  (users) => Object.values(users.byId)
);

// Used by one component
function UsersList() {
  const users = useSelector(selectAllUsers);  // OK - no params
}
```

**Selector factory (per-instance):**
```javascript
// ✅ Good for: Parametrized data per component
const makeSelectUserById = () =>
  createSelector(
    [state => state.users.byId, (_, userId) => userId],
    (usersById, userId) => usersById[userId]
  );

// Used by many components with different params
function UserCard({ userId }) {
  const selectUserById = useMemo(makeSelectUserById, []);
  const user = useSelector(state => selectUserById(state, userId));
  // Each UserCard has own selector instance → own memoization cache
}

// List renders 100 UserCards
function UserList({ userIds }) {
  return userIds.map(id => <UserCard key={id} userId={id} />);
  // Each card's selector independently memoized
}
```

**Why factories matter:**
```javascript
// ❌ Bad: Shared parametrized selector
const selectUserById = createSelector(
  [(state, id) => state.users.byId[id]],
  user => user
);

<UserCard userId={1} />  // Calls selector(state, 1) → caches result
<UserCard userId={2} />  // Calls selector(state, 2) → cache miss!
<UserCard userId={1} />  // Calls selector(state, 1) → cache miss! (thrashing)
// Single cache slot → thrashes with multiple params
```

**Decision rule:**
- **No parameters** → regular selector
- **Same parameter always** → regular selector
- **Different parameters per instance** → selector factory

**Why it matters:** Factories prevent cache thrashing in lists, maintaining memoization benefits for each component instance.
</details>

<details>
<summary><strong>Question 4:</strong> How do selectors improve component decoupling?</summary>

**Answer:** **Selectors hide state structure, making refactoring safe:**

**Without selectors (tightly coupled):**
```javascript
// 10 components access state directly
function Component1() {
  const todos = useSelector(state => state.todos.items);
}
function Component2() {
  const todos = useSelector(state => state.todos.items);
}
// ... 8 more components

// Later: Refactor state structure
// Before: state.todos.items
// After: state.data.todosList

// Now must update 10 components! 💥
```

**With selectors (decoupled):**
```javascript
// 1 selector
const selectTodos = state => state.todos.items;

// 10 components use selector
function Component1() {
  const todos = useSelector(selectTodos);
}
function Component2() {
  const todos = useSelector(selectTodos);
}

// Refactor: Update 1 selector instead of 10 components
const selectTodos = state => state.data.todosList;  // ✅ Done!
```

**Complex refactoring example:**
```javascript
// Before: Flat structure
state = {
  users: [{ id: 1, name: 'Alice' }]
};
const selectUsers = state => state.users;

// After: Normalized structure
state = {
  users: {
    byId: { '1': { id: 1, name: 'Alice' } },
    allIds: ['1']
  }
};

// Update selector only
const selectUsers = createSelector(
  [state => state.users.byId, state => state.users.allIds],
  (byId, allIds) => allIds.map(id => byId[id])
  // Components still get array - unchanged API!
);
```

**Why it matters:** Selectors are the API layer over state. Components depend on selectors, not state shape. Refactor state freely without touching components.
</details>

<details>
<summary><strong>Question 5:</strong> What's the difference between input selectors and output selectors?</summary>

**Answer:** **Input selectors extract raw state; output selectors transform it:**

```javascript
// Input selectors (simple state access)
const selectTodos = state => state.todos;  // Raw todos array
const selectFilter = state => state.filter;  // Raw filter string
const selectUser = state => state.user;  // Raw user object

// Output selector (combines/transforms inputs)
const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter],  // Input selectors
  (todos, filter) => {  // Output selector function
    // Transform inputs → output
    return todos.filter(t => t.status === filter);
  }
);
```

**Key differences:**

| Aspect | Input Selector | Output Selector |
|--------|---------------|-----------------|
| **Purpose** | Extract raw state | Transform/combine data |
| **Memoization** | Not needed (simple access) | Memoized (expensive computation) |
| **Arguments** | `(state, ...args)` | `(input1, input2, ...)` |
| **Reusability** | High (used in many outputs) | Medium (specific transformations) |
| **Complexity** | Simple (1 line) | Complex (filtering, mapping, sorting) |

**Example showing both:**
```javascript
// Input selectors (reused across many outputs)
const selectProducts = state => state.products.items;
const selectCart = state => state.cart.items;
const selectPricing = state => state.pricing;

// Output selector 1
const selectCartTotal = createSelector(
  [selectCart, selectProducts, selectPricing],
  (cart, products, pricing) => {
    return cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      const price = pricing[product.id] || product.basePrice;
      return total + price * item.quantity;
    }, 0);
  }
);

// Output selector 2 (reuses same inputs)
const selectDiscountedTotal = createSelector(
  [selectCartTotal, selectUser],
  (total, user) => {
    return user.isPremium ? total * 0.9 : total;
  }
);
```

**Why it matters:** Separating input/output selectors maximizes reusability. Input selectors are shared building blocks for many output selectors.
</details>

## References
- [Redux Documentation - Deriving Data with Selectors](https://redux.js.org/usage/deriving-data-selectors)
- [Reselect Library](https://github.com/reduxjs/reselect)
Based on the search results and best practices in state management, here are key recommendations for working with selectors or views:

1. Keep Selectors Simple and Focused
   - Create selectors that target specific pieces of state
   - Avoid complex logic within selectors
   - Use composition to build more complex selectors from simpler ones

2. Use Memoization for Performance
   - Utilize libraries like Reselect to create memoized selectors
   - This optimizes performance by caching results and avoiding unnecessary recalculations

3. Centralize Selector Definitions
   - Define reusable selectors in a central location (e.g., in slice files or a dedicated selectors.js)
   - This improves maintainability and makes it easier to update state structure

4. Decouple Components from State Shape
   - Use selectors to abstract away the details of state structure from components
   - This makes it easier to refactor state without affecting components

5. Avoid Direct State Access in Components
   - Instead of accessing state directly, use selectors in useSelector hooks
   - This promotes better encapsulation and reusability

6. Compose Selectors for Complex Data Transformations
   - Build complex selectors by combining simpler ones
   - This improves readability and maintainability

7. Use Selectors for Derived Data
   - Calculate derived data in selectors rather than storing it in the state
   - This keeps the state minimal and avoids data duplication

8. Test Selectors Thoroughly
   - Write unit tests for selectors to ensure they work correctly
   - This is especially important for complex selectors

9. Consider Performance Implications
   - Be mindful of selector complexity and frequency of updates
   - Use memoization and other optimization techniques for expensive computations

10. Use Typed Selectors (for TypeScript projects)
    - Define proper types for selectors to improve type safety and developer experience

11. Avoid unnecessary re-renders
    - Ensure that your selectors only return new references when the underlying data has actually changed. This prevents unnecessary component re-renders.

By following these practices, you can create more maintainable, performant, and scalable state management solutions in your applications.

## References

- [1] https://30dayscoding.com/blog/mastering-the-use-selector-a-comprehensive-guide
- [2] https://tiennguyen.hashnode.dev/organizing-redux-code-best-practices-and-tips
- [3] https://codedamn.com/news/reactjs/what-are-the-best-practices-for-state-management-in-react
- [4] https://www.geeksforgeeks.org/why-are-selectors-considered-best-practice-in-react-redux/
- [5] https://stackoverflow.com/questions/74491856/how-should-i-use-selectors-in-redux-toolkit
- [6] https://deadsimplechat.com/blog/react-state-management-modern-guide/
- [7] https://30dayscoding.com/blog/using-selectors-in-react
- [8] https://javascript.plainenglish.io/boosting-redux-performance-with-memoized-selectors-best-practices-and-implementation-tips-51b4cf59d47c?gi=3d836a7c3ee8
- [9] https://www.linkedin.com/advice/3/what-best-practices-state-management-react-application-rphjc
- [10] https://redux.js.org/usage/deriving-data-selectors
- [11] https://www.reddit.com/r/reduxjs/comments/1dl7wim/should_you_exclusively_use_selectors_when/
- [12] https://stackoverflow.com/questions/71517397/react-redux-useselector-best-practice/74633021