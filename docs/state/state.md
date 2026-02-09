---
title: State Basics
layout: doc
slug: state
---

# State Basics

## Key Insight

State is the memory of your application—every piece of data that changes over time, from user inputs to API responses to UI toggles. Mastering state management means understanding when state should live locally in components versus globally in a store, how to keep state synchronized with reality, and how to structure state to make your application predictable, debuggable, and performant.

## Detailed Description

Frontend state management is a crucial aspect of modern web development, focusing on efficiently handling and organizing data within an application. At its core, state represents any data that can change during the lifetime of your application—it's what makes your app dynamic and interactive rather than static.

## What is State?

State in frontend development refers to any information that an application needs to keep track of over time. This includes:

- User input data
- UI component states (e.g., open/closed modals)
- Data fetched from APIs
- Application-wide settings

## Types of State

1. **Local State**: Managed within individual components
2. **Global State**: Shared across multiple components or routes
3. **Server State**: Data fetched from external sources that needs synchronization

## Core Concepts

### Store

A centralized location where the application state is stored, typically as an object.

### Properties

Individual data points within the store that represent specific pieces of state.

### Actions

Functions or methods used to update properties in the store, similar to setter methods.

The distinction between local, global, and server state is fundamental to effective state management. Local state (component-specific data like input values or dropdown states) should remain close to where it's used. Global state (data needed across multiple unrelated components like user authentication or app theme) benefits from centralization. Server state (data from APIs) requires synchronization patterns to handle loading, caching, and stale data. Conflating these categories leads to over-complicated components or bloated global stores.

In the Universal Frontend Architecture, state management follows framework-agnostic principles. Whether using Redux, MobX, Vuex, or Pinia, the patterns remain consistent: unidirectional data flow, immutable updates, and separation of state logic from UI components. This consistency enables developers to transfer knowledge across projects and frameworks.

The evolution from manual state management to sophisticated solutions like Redux Toolkit and React Query reflects growing application complexity. Modern apps must handle optimistic updates, offline functionality, real-time synchronization, and complex derived data—challenges that simple `setState` cannot address. Understanding state fundamentals helps you choose the right tool for each scenario.

## Goals of State Management

- **Centralize** application state for easier tracking and management
- **Simplify** data flow within the application through predictable patterns
- **Ensure UI consistency** with underlying data through reactive updates
- **Improve predictability** with clear rules for how and when state changes
- **Enable debugging** through state snapshots, time-travel, and action logs

## Code Examples

### Basic Example: Local Component State

Simple state management within a single component:

```jsx
// Counter.js - Local state example

import React, { useState } from 'react';

const Counter = () => {
  // State lives in this component only
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([]);

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    setHistory([...history, `Incremented to ${newCount}`]);
  };

  const decrement = () => {
    const newCount = count - 1;
    setCount(newCount);
    setHistory([...history, `Decremented to ${newCount}`]);
  };

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      
      <h3>History:</h3>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>{entry}</li>
        ))}
      </ul>
    </div>
  );
};

export default Counter;
```

### Practical Example: Global State with Context API

Sharing state across multiple components:

```jsx
// ThemeContext.js - Global state with Context

import React, { createContext, useContext, useState } from 'react';

// 1. Create context
const ThemeContext = createContext();

// 2. Create provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState(16);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 24));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 12));

  // Expose state and actions
  const value = {
    theme,
    fontSize,
    toggleTheme,
    increaseFontSize,
    decreaseFontSize
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Create hook for consuming context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

Usage:

{% raw %}
```jsx
// App.js
import { ThemeProvider } from './ThemeContext';
import Header from './Header';
import Content from './Content';

const App = () => (
  <ThemeProvider>
    <Header />
    <Content />
  </ThemeProvider>
);

// Header.js - Consumes global state
import { useTheme } from './ThemeContext';

const Header = () => {
  const { theme, toggleTheme, fontSize, increaseFontSize, decreaseFontSize } = useTheme();

  return (
    <header style={{ fontSize: `${fontSize}px` }}>
      <h1>Current Theme: {theme}</h1>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={increaseFontSize}>A+</button>
      <button onClick={decreaseFontSize}>A-</button>
    </header>
  );
};
```
{% endraw %}

### Advanced Example: Derived State and Normalization

Complex state management with computed values:

```javascript
// userState.js - Normalized state structure

const initialState = {
  // Normalized by ID for efficient lookups
  users: {
    byId: {
      '1': { id: '1', name: 'Alice', role: 'admin', departmentId: 'd1' },
      '2': { id: '2', name: 'Bob', role: 'user', departmentId: 'd1' },
      '3': { id: '3', name: 'Charlie', role: 'user', departmentId: 'd2' }
    },
    allIds: ['1', '2', '3']
  },
  departments: {
    byId: {
      'd1': { id: 'd1', name: 'Engineering' },
      'd2': { id: 'd2', name: 'Marketing' }
    },
    allIds: ['d1', 'd2']
  },
  filters: {
    role: null,
    department: null,
    searchTerm: ''
  }
};

// Selectors - Derive state without storing it
const selectAllUsers = (state) => 
  state.users.allIds.map(id => state.users.byId[id]);

const selectFilteredUsers = (state) => {
  let users = selectAllUsers(state);
  const { role, department, searchTerm } = state.filters;

  // Apply role filter
  if (role) {
    users = users.filter(user => user.role === role);
  }

  // Apply department filter
  if (department) {
    users = users.filter(user => user.departmentId === department);
  }

  // Apply search filter
  if (searchTerm) {
    users = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return users;
};

const selectUserStats = (state) => {
  const users = selectAllUsers(state);
  return {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    byDepartment: users.reduce((acc, user) => {
      acc[user.departmentId] = (acc[user.departmentId] || 0) + 1;
      return acc;
    }, {})
  };
};

export { initialState, selectAllUsers, selectFilteredUsers, selectUserStats };
```

## Common Mistakes

## Common Mistakes

### 1. Storing Derived Data in State
**Mistake:** Duplicating data that can be calculated from existing state.

```jsx
// ❌ BAD: Storing derived data
const [items, setItems] = useState([...]);
const [itemCount, setItemCount] = useState(0); // Redundant!

const addItem = (item) => {
  setItems([...items, item]);
  setItemCount(itemCount + 1); // Easy to forget, causes bugs
};
```

```jsx
// ✅ GOOD: Calculate derived data
const [items, setItems] = useState([...]);
const itemCount = items.length; // Always synchronized

const addItem = (item) => {
  setItems([...items, item]); // Single source of truth
};
```

**Why it matters:** Derived data creates synchronization bugs and increases complexity. Compute it from source data.

### 2. Mutating State Directly
**Mistake:** Modifying state objects instead of creating new ones.

```javascript
// ❌ BAD: Mutating state
const [user, setUser] = useState({ name: 'Alice', age: 30 });

user.age = 31; // Direct mutation!
setUser(user); // React won't detect the change
```

```javascript
// ✅ GOOD: Immutable updates
const [user, setUser] = useState({ name: 'Alice', age: 30 });

setUser({ ...user, age: 31 }); // New object, React detects change
```

**Why it matters:** React and most state libraries rely on reference equality to detect changes. Mutations break reactivity and cause subtle bugs.

### 3. Putting Everything in Global State
**Mistake:** Making all state global when most should be local.

```jsx
// ❌ BAD: Global state for component-specific UI
// In Redux store
const state = {
  modal1Open: false,
  modal2Open: false,
  dropdown1Expanded: false,
  inputFocused: false, // UI state that doesn't need to be global
  // ...
};
```

```jsx
// ✅ GOOD: Keep UI state local
const Modal = () => {
  const [isOpen, setIsOpen] = useState(false); // Local to this modal
  // ...
};

const Dropdown = () => {
  const [isExpanded, setIsExpanded] = useState(false); // Local
  // ...
};
```

**Why it matters:** Global state adds complexity, hurts performance (more components re-render), and makes components less reusable. Only globalize state that's truly shared. See [Store](store.html) for more details.

## Quick Quiz

<details>
<summary><strong>Question 1:</strong> What is the difference between local state, global state, and server state?</summary>

**Answer:**

- **Local State:** Data specific to a single component (e.g., form input value, modal open/closed). Managed with `useState` or component-level state.
  - Example: `const [inputValue, setInputValue] = useState('')`

- **Global State:** Data shared across multiple components (e.g., user authentication, app theme). Managed with Context API, Redux, or similar.
  - Example: Current user logged in, accessible from header, sidebar, and profile page

- **Server State:** Data from external APIs that needs synchronization (e.g., user list, product catalog). Often managed with libraries like React Query or SWR.
  - Example: List of products fetched from `/api/products`

**Why it matters:** Choosing the right state type prevents over-engineering (local state in global store) and under-engineering (prop drilling for shared data).
</details>

<details>
<summary><strong>Question 2:</strong> True or False: You should always lift state to the highest common ancestor component.</summary>

**Answer:** **False.** While lifting state to a common ancestor is sometimes necessary for sharing, you should:

1. **Keep state as local as possible** - Only lift when actually needed
2. **Use composition** - Pass components as children to avoid lifting
3. **Use Context** - For deeply nested components that need shared state
4. **Use global state management** - For truly application-wide data

**Example of over-lifting:**
```jsx
// ❌ BAD: Lifting dropdown state to App unnecessarily
<App> {/* dropdown state here */}
  <Header />
  <Sidebar>
    <Menu>
      <Dropdown /> {/* Only component that needs the state */}
    </Menu>
  </Sidebar>
</App>

// ✅ GOOD: Keep state in Dropdown
<Dropdown> {/* state lives here */}
```

**Why it matters:** Over-lifting creates unnecessary re-renders and tight coupling. Lift state only when components actually need to share it.
</details>

<details>
<summary><strong>Question 3:</strong> Why is state immutability important?</summary>

**Answer:** Immutability is crucial because:

1. **Change Detection:** React and state libraries detect changes by comparing object references. Mutations don't create new references.
2. **Predictability:** Immutable updates make it clear when and where state changes
3. **Time-Travel Debugging:** Tools like Redux DevTools can replay actions because previous states are preserved
4. **Performance Optimization:** Shallow equality checks (used by React.memo, useMemo) only work with immutable updates

**Example:**
```javascript
// With mutation (breaks React)
const [users, setUsers] = useState([...]);
users.push(newUser); // Mutation!
setUsers(users); // Same reference, React won't update

// With immutability (works correctly)
setUsers([...users, newUser]); // New array, React detects change
```

**Why it matters:** Violating immutability causes subtle bugs where UI doesn't update even though data changed, or components re-render unnecessarily.
</details>

<details>
<summary><strong>Question 4:</strong> What is "normalized state" and when should you use it?</summary>

**Answer:** Normalized state structures data by ID like a database, avoiding nested duplication:

**Nested (not normalized):**
```javascript
{
  posts: [
    { id: 1, title: 'Post 1', author: { id: 5, name: 'Alice' } },
    { id: 2, title: 'Post 2', author: { id: 5, name: 'Alice' } } // Duplicated author!
  ]
}
```

**Normalized:**
```javascript
{
  posts: {
    byId: {
      1: { id: 1, title: 'Post 1', authorId: 5 },
      2: { id: 2, title: 'Post 2', authorId: 5 }
    },
    allIds: [1, 2]
  },
  users: {
    byId: {
      5: { id: 5, name: 'Alice' }
    },
    allIds: [5]
  }
}
```

**Benefits:**
- Single source of truth (update Alice once, reflects everywhere)
- Efficient lookups (O(1) by ID)
- Easier updates (no deep nesting)

**When to use:** Complex relational data, entities referenced in multiple places, or when using Redux.

**Why it matters:** Normalization prevents data inconsistency and makes updates easier in complex applications.
</details>

<details>
<summary><strong>Question 5:</strong> How do you decide between useState, Context API, Redux, and server state libraries?</summary>

**Answer:** Use this decision tree:

**useState (Local State):**
- Used by: Single component
- Examples: Form inputs, modal open/closed, accordion expanded
- **Use when:** State doesn't need to be shared

**Context API:**
- Used by: Multiple components across the tree
- Examples: Theme, locale, authenticated user
- **Use when:** Simple global state without complex updates

**Redux/MobX/Zustand:**
- Used by: Entire application
- Examples: Shopping cart, complex forms, UI state across routes
- **Use when:** Complex state logic, many state transitions, need DevTools

**React Query/SWR:**
- Used by: Server data consumers
- Examples: User lists, product catalogs, API data
- **Use when:** Fetching and caching server data

**Rule of thumb:**
1. Start with `useState`
2. If prop-drilling becomes painful → Context
3. If Context gets complex → Redux/Zustand
4. If fetching data from APIs → React Query/SWR

**Why it matters:** Using the right tool simplifies code and improves performance. Over-engineering (Redux for everything) and under-engineering (prop drilling 10 levels) both create problems.
</details>

## References
- [1] https://blog.pixelfreestudio.com/ultimate-guide-to-state-management-in-frontend-applications/
- [2] https://www.paulserban.eu/blog/post/mastering-state-management-in-front-end-development-a-comprehensive-guide/
- [3] https://www.capitalnumbers.com/blog/state-management-front-end-development/
- [4] https://www.womenwhocode.com/blog/the-back-end-of-the-front-end-state-part-1
- [5] https://www.reddit.com/r/Frontend/comments/17kyo0v/what_is_state_management/
- [6] https://www.linkedin.com/pulse/state-frontend-development-conceptual-overview-fernando-nunes-lkadf