---
title: State Basics
layout: doc
slug: state
---

# State Basics

> - **State** — application memory that changes over time
> - Spans user input, API responses, UI toggles, and everything in between
> - Get it right and your app feels predictable; get it wrong and bugs multiply

## Detailed Description

Frontend state management is a crucial aspect of modern web development, focusing on efficiently handling and organizing data within an application. At its core, state represents any data that can change during the lifetime of your application—it's what makes your app dynamic and interactive rather than static.

### What is State?

State in frontend development refers to any information that an application needs to keep track of over time. This includes:

- User input data
- UI component states (e.g., open/closed modals)
- Data fetched from APIs
- Application-wide settings

### Types of State

1. **Local State**: Managed within individual components
2. **Global State**: Shared across multiple components or routes
3. **Server State**: Data fetched from external sources that needs synchronization

### Core Concepts

#### Store

A centralized location where the application state is stored, typically as an object.

#### Properties

Individual data points within the store that represent specific pieces of state.

#### Actions

Functions or methods used to update properties in the store, similar to setter methods.

The distinction between local, global, and server state is fundamental to effective state management. Local state (component-specific data like input values or dropdown states) should remain close to where it's used. Global state (data needed across multiple unrelated components like user authentication or app theme) benefits from centralization. Server state (data from APIs) requires synchronization patterns to handle loading, caching, and stale data. Conflating these categories leads to over-complicated components or bloated global stores.

In the Universal Frontend Architecture, state management follows framework-agnostic principles. Whether using Redux, MobX, Vuex, or Pinia, the patterns remain consistent: unidirectional data flow, immutable updates, and separation of state logic from UI components. This consistency enables developers to transfer knowledge across projects and frameworks.

The evolution from manual state management to sophisticated solutions like Redux Toolkit and React Query reflects growing application complexity. Modern apps must handle optimistic updates, offline functionality, real-time synchronization, and complex derived data—challenges that simple `setState` cannot address. Understanding state fundamentals helps you choose the right tool for each scenario.

### Goals of State Management

- **Centralize** application state for easier tracking and management
- **Simplify** data flow within the application through predictable patterns
- **Ensure UI consistency** with underlying data through reactive updates
- **Improve predictability** with clear rules for how and when state changes
- **Enable debugging** through state snapshots, time-travel, and action logs

## Key Insight

State is the memory of your application—every piece of data that changes over time, from user inputs to API responses to UI toggles. Mastering state management means understanding when state should live locally in components versus globally in a store, how to keep state synchronized with reality, and how to structure state to make your application predictable, debuggable, and performant.

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

{% include quiz.html id="state-1"
   question="What are the key differences between local, global, and server state?"
   options="A|Local state lives in a component; global state lives in a store; server state is data fetched from the backend — the three tools (useState, Redux, React Query) map one-to-one with no overlap, and you pick exactly one per app;;B|They are interchangeable labels for the same concept — all three are handled with useState and prop-drilling in modern React;;C|Local state is component-private (input focus, modal open) and belongs in useState. Global state is shared across the app (auth, theme, cart) and belongs in a client-state store or Context. Server state is a cached slice of remote data with its own concerns (fetching, staleness, refetch, invalidation) and deserves a dedicated server-state library;;D|Only global state matters — local and server state are anti-patterns that were deprecated when hooks were introduced"
   correct="C"
   explanation="Local -> useState. Global -> Redux/Pinia/NgRx/Zustand/Context. Server -> React Query/SWR/RTK Query — the last one has enough unique concerns (cache, invalidation, deduping) to warrant its own tool." %}

{% include quiz.html id="state-2"
   question="Should you always lift state to the highest common ancestor?"
   options="A|Yes, always lift to the top;;B|Only lift class components;;C|Never lift state;;D|No. Lift only as high as the components that genuinely need to read or update it. Over-lifting causes unnecessary re-renders across the tree and forces prop-drilling. If many distant components need it, reach for context or a store instead of the highest ancestor"
   correct="D"
   explanation="&quot;Lift to the closest common ancestor&quot; — not the root. If that ancestor is too far, a store or context is probably the right tool, not deeper lifting." %}

{% include quiz.html id="state-3"
   question="Why does state immutability matter?"
   options="A|Reference equality checks (Redux, React.memo, useMemo deps, Svelte stores) depend on new references for new values. Mutating state in place means consumers can't detect the change, dev-tools time-travel breaks, and concurrent rendering can observe inconsistent state. Immutability is the contract that makes those features work;;B|Only strings can be immutable;;C|It's purely stylistic;;D|Immutability is a performance regression"
   correct="A"
   explanation="Every framework relying on structural sharing / reference-equality shortcutting needs immutability. Immer and RTK let you write mutating-looking code while preserving the guarantee." %}

{% include quiz.html id="state-4"
   question="What is normalised state and when is it useful?"
   options="A|Flattening nested entities into { byId: {id: entity}, allIds: [id] } shapes so each entity lives in exactly one place, references are ids, and updates don't require deep mutation. Most useful for server-data heavy apps with cross-references (users, posts, comments);;B|Normalisation is a Vue-only concept;;C|It doubles your bundle;;D|It's always wrong"
   correct="A"
   explanation="When the same entity appears in many places, nested state becomes a sync nightmare. Normalisation (see createEntityAdapter in RTK) keeps a single source of truth." %}

{% include quiz.html id="state-5"
   question="How should you choose between useState, Context, Redux/Pinia/NgRx, and a server-state library?"
   options="A|Start with useState for local component state. Use Context for small, rarely-changing shared values (theme, locale, auth user) — but not for high-churn data. Use a store (Redux/Pinia/NgRx) when global state is complex, cross-cutting, devtools matter, or many slices interact. Use a server-state library (React Query, RTK Query) for remote data caching, invalidation, and refetch;;B|Never use Context;;C|Always use Redux;;D|Always use the biggest tool"
   correct="A"
   explanation="Match the tool to the actual problem. Context for infrequent shared config, a store for complex client state, a server-state lib for remote data — those three cover almost every need in a modern app." %}

## References
- [1] https://blog.pixelfreestudio.com/ultimate-guide-to-state-management-in-frontend-applications/
- [2] https://www.paulserban.eu/blog/post/mastering-state-management-in-front-end-development-a-comprehensive-guide/
- [3] https://www.capitalnumbers.com/blog/state-management-front-end-development/
- [4] https://www.womenwhocode.com/blog/the-back-end-of-the-front-end-state-part-1
- [5] https://www.reddit.com/r/Frontend/comments/17kyo0v/what_is_state_management/
- [6] https://www.linkedin.com/pulse/state-frontend-development-conceptual-overview-fernando-nunes-lkadf