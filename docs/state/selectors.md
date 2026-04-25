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

### Basic Example: getVisibleTodos across state libraries

The same derived selector — give me the filtered set of visible todos — across four state libraries. Classic Redux, Redux Saga, and WC-Saga all use the same plain-function selector (Saga templates share this exact file). Pinia exposes it as a getter on the store. NgRx composes memoized selectors via `createSelector`.

{::nomarkdown}<div class="code-tabs">{:/}

Classic Redux
```javascript
// templates/chota-react-redux/src/state/todo/todo.selectors.js
// Plain selector function. The React-Saga and WC-Saga templates ship the
// same file — the selector pattern is independent of the middleware.
import { SHOW_ACTIVE, SHOW_ALL, SHOW_COMPLETED } from "../filters/filters.type";

export const getVisibleTodos = (todo, filter) => {
  let visibleTodos = [];
  switch (filter) {
    case SHOW_ALL:       visibleTodos = todo.todoItems; break;
    case SHOW_COMPLETED: visibleTodos = todo.todoItems.filter((t) => t.completed); break;
    case SHOW_ACTIVE:    visibleTodos = todo.todoItems.filter((t) => !t.completed); break;
    default:             throw new Error("Unknown filter: " + filter);
  }
  return { ...todo, todoItems: visibleTodos };
};
```

Redux Toolkit
```javascript
// templates/chota-react-rtk/src/state/todo/todo.selectors.js
// RTK doesn't add a selector layer of its own for the basic case — you
// write a plain selector the same way. Reach for `createSelector`
// (re-exported from RTK) when you need memoization for expensive shapes.
import { SHOW_ACTIVE, SHOW_ALL, SHOW_COMPLETED } from "../filters/filters.type";

export const getVisibleTodos = (todo, filter) => {
  switch (filter) {
    case SHOW_ALL:       return { ...todo };
    case SHOW_COMPLETED: return { ...todo, todoItems: todo.todoItems.filter((t) => t.completed) };
    case SHOW_ACTIVE:    return { ...todo, todoItems: todo.todoItems.filter((t) => !t.completed) };
    default:             return todo;
  }
};

// With memoization:
// export const getVisibleTodos = createSelector(
//   [(state) => state.todo, (state) => state.filters],
//   (todo, filters) => { /* ...same logic... */ }
// );
```

NgRx
```typescript
// templates/chota-angular-ngrx/src/app/state/todo/todo.selectors.ts
// createSelector composes input selectors into a memoized output selector.
// The combiner only re-runs when an input selector returns a new reference.
import { createSelector } from '@ngrx/store';
import { AppState } from '../index';
import { getSelectedFilter } from '../filters/filters.selectors';

export const getTodoState = (state: AppState) => state.todo;

export const getVisibleTodos = createSelector(
  getTodoState,
  getSelectedFilter,
  (todoState, selectedFilter) => {
    const { todoItems } = todoState;
    switch (selectedFilter?.id) {
      case 'SHOW_COMPLETED':
        return { ...todoState, todoItems: todoItems.filter((t) => t.completed) };
      case 'SHOW_ACTIVE':
        return { ...todoState, todoItems: todoItems.filter((t) => !t.completed) };
      default:
        return todoState;
    }
  }
);
```

Pinia
```javascript
// templates/chota-vue-pinia/src/state/todo/index.js
// Pinia "selectors" are getters on the store — functions of state that
// Vue's reactivity system caches automatically. The selector function
// itself lives in todo.selectors.js and is reused from the getter.
import { defineStore } from 'pinia';
import { getVisibleTodos } from './todo.selectors';
import { useFiltersStore } from '../filters';
import { getSelectedFilter } from '../filters/filters.selectors';

export const useTodoStore = defineStore('todo', {
  state: () => ({ /* ...intialTodoState */ }),
  getters: {
    visibleTodos(state) {
      const filtersData = useFiltersStore();
      const selectedFilter = getSelectedFilter(filtersData);
      return getVisibleTodos(state, selectedFilter.id);
    },
  },
});

// templates/chota-vue-pinia/src/state/todo/todo.selectors.js
export const getVisibleTodos = (todo, filter) => {
  /* same switch on filter as the Redux tab */
};
```

{::nomarkdown}</div>{:/}

The takeaway: the *derivation* — "apply the active filter to the todo list" — is the same pure function everywhere. What changes is how each library wires memoization and subscription. Redux-family templates use plain functions and optionally opt into `createSelector`. NgRx uses `createSelector` as the default path so every output selector is memoized. Pinia uses Vue's reactivity (a getter on the store) and reuses the same plain selector internally.

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

{% include quiz.html id="selectors-1"
   question="What problem does memoization (e.g. via Reselect/createSelector) solve in selectors?"
   options="A|It caches HTTP responses, so subsequent selector calls skip the network round-trip — this is why Reselect is often described as a selector-side fetch cache;;B|Expensive derivations (filter / sort / shape) would re-run on every store update, and returning a new array/object each time causes consumers to re-render unnecessarily. A memoized selector caches (inputs -> output); when its input selectors return the same references, it returns the SAME cached output reference — no recomputation, no downstream re-render;;C|It makes selectors run asynchronously so expensive work moves off the main thread automatically;;D|It replaces the reducer — the selector becomes the source of truth for state, and the reducer only deals with actions that didn't match a selector"
   correct="B"
   explanation="Without memoization, a component subscribing to a derived array or object would re-render after every store update because selector() returns a new array/object each time." %}

{% include quiz.html id="selectors-2"
   question="How do you compose selectors?"
   options="A|Build small input selectors (state => slice.field), then use createSelector(input1, input2, ..., (a, b, ...) => derived) to compose them into output selectors. Output selectors can themselves be inputs to further selectors, so derivations stack in a dependency graph;;B|Selectors cannot be composed;;C|Inline them inside useSelector;;D|Only by copying code"
   correct="A"
   explanation="Composition keeps each selector tiny and reusable. The dependency graph is what lets Reselect memoize correctly." %}

{% include quiz.html id="selectors-3"
   question="When do you need a selector factory (createSelector inside a creator fn) vs a shared selector?"
   options="A|Factories are a Redux 5 deprecation;;B|A plain memoized selector has ONE cache slot — if two components call it with different props (e.g. selectItemById(state, id) for two ids), the cache thrashes. A selector FACTORY returns a fresh memoized selector per component instance, so each instance has its own cache;;C|They are identical;;D|Always use a factory"
   correct="B"
   explanation="Reselect's default cache size is 1. Per-instance memoization via a factory is the fix when a selector takes component-specific arguments." %}

{% include quiz.html id="selectors-4"
   question="How do selectors help decouple components from the store shape?"
   options="A|They don't — components still need to know the shape;;B|Selectors generate components;;C|They replace containers;;D|Components call a selector by name (selectVisibleTodos) instead of reaching into state.todo.items.filter(...). If the state shape changes, only the selector file changes — every component keeps working. That's the key refactor-safety win"
   correct="D"
   explanation="Selectors are the abstraction barrier over state shape. A slice rename is a one-file refactor with selectors, a grep-and-pray refactor without them." %}

{% include quiz.html id="selectors-5"
   question="What's the difference between input selectors and output selectors in Reselect?"
   options="A|Input selectors mutate state;;B|Only output selectors can be memoized;;C|Input selectors are simple state-readers (state => state.users). Output selectors are built via createSelector from one or more input selectors and a combiner function that produces the derived value. Keeping them separate maximizes reuse — the same input selectors feed many output selectors;;D|There is no difference"
   correct="C"
   explanation="Shared input selectors + focused output selectors is the composition pattern that lets a small set of primitives drive many derivations without duplicating work." %}

## References

- [Redux Documentation - Deriving Data with Selectors](https://redux.js.org/usage/deriving-data-selectors)
- [Reselect Library](https://github.com/reduxjs/reselect)
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
