---
title: Store
layout: doc
slug: store
---

# Store

## Key Insight

A store is your application's single source of truth—a centralized state container that every component can access without prop drilling, ensuring consistent data across your entire application. By consolidating state in one predictable location with clear rules for updates, stores transform chaotic component communication into elegant, debuggable data flow that scales from small apps to enterprise systems.

## Detailed Description

A store in frontend state management is a centralized location where an application's state is stored and managed. It serves as a single source of truth for the application's data, typically implemented as a JavaScript object. The store holds various properties that represent different aspects of the application's state, such as user information, UI component states, or data fetched from APIs[1][2].

The store pattern emerged from the complexity of managing shared state in large applications. Without a store, components pass data through props (prop drilling), creating tight coupling and making state changes difficult to track. With a store, any component can access or update state through a well-defined interface, regardless of its position in the component hierarchy. This architectural shift simplifies data flow and makes applications more maintainable.

In the Universal Frontend Architecture, stores follow framework-agnostic patterns inspired by Flux and Redux. The core principles—unidirectional data flow, immutable updates, and pure reducer functions—transcend specific implementations. Whether using Redux, Vuex, Pinia, Zustand, or MobX, these patterns provide consistency and predictability across different tech stacks.

Key characteristics of a store include:

1. Centralization: It provides a single point of access for state across the entire application[5].

2. Predictability: The store ensures that state can only be updated in a controlled and predictable manner, often through defined actions or methods[1][5].

3. Accessibility: Any component in the application can access or update the state stored in the store, regardless of its position in the component hierarchy[2].

4. Observability: Changes to the store's state can be observed and reacted to by different parts of the application, enabling reactive updates to the UI[3].

Popular state management libraries like Redux and Vuex implement the store concept. For example, in Redux:

```javascript
import { createStore } from 'redux';
const store = createStore(reducer);
```

This creates a centralized store that holds the entire state of the application[2][4].

By using a store, developers can more easily manage complex application states, implement features like undo/redo functionality, and maintain a clear, predictable data flow throughout the application[5].

## Code Examples

### Basic Example: Simple Redux Store

A fundamental store implementation demonstrating core concepts:

```javascript
// store.js - Basic Redux store

import { createStore } from 'redux';

// Initial state shape
const initialState = {
  user: null,
  theme: 'light',
  notifications: []
};

// Reducer - Pure function that updates state
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'TOGGLE_THEME':
      return { 
        ...state, 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    
    default:
      return state;
  }
};

// Create store
const store = createStore(rootReducer);

export default store;
```

Usage in components:

```jsx
// App.js - Connect components to store

import React from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './store';

const ThemeToggle = () => {
  const theme = useSelector(state => state.theme);
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch({ type: 'TOGGLE_THEME' })}>
      Current: {theme}
    </button>
  );
};

const App = () => (
  <Provider store={store}>
    <ThemeToggle />
  </Provider>
);
```

### Practical Example: Store with Middleware and DevTools

Real-world store configuration with logging and debugging:

```javascript
// store.js - Production-ready Redux store

import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './reducers/userReducer';
import cartReducer from './reducers/cartReducer';
import uiReducer from './reducers/uiReducer';

// Combine multiple reducers
const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  ui: uiReducer
});

// Logger middleware (custom)
const loggerMiddleware = store => next => action => {
  console.log('Dispatching:', action);
  const result = next(action);
  console.log('Next state:', store.getState());
  return result;
};

// Setup Redux DevTools
const composeEnhancers = 
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || 
  compose;

// Create store with middleware
const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      thunk,        // For async actions
      loggerMiddleware  // For development logging
    )
  )
);

export default store;
```

Example reducers:

```javascript
// reducers/cartReducer.js

const initialState = {
  items: [],
  total: 0
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const newItems = [...state.items, action.payload];
      return {
        items: newItems,
        total: calculateTotal(newItems)
      };

    case 'REMOVE_FROM_CART':
      const filtered = state.items.filter(item => item.id !== action.payload);
      return {
        items: filtered,
        total: calculateTotal(filtered)
      };

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
};

const calculateTotal = (items) => 
  items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

export default cartReducer;
```

### Advanced Example: Zustand Store (Modern Lightweight Alternative)

A simpler store implementation with modern patterns:

```javascript
// store/useStore.js - Zustand store

import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        user: null,
        cart: {
          items: [],
          total: 0
        },
        ui: {
          theme: 'light',
          sidebarOpen: false
        },

        // Actions
        setUser: (user) => set({ user }),
        
        logout: () => set({ user: null, cart: { items: [], total: 0 } }),

        addToCart: (product) => set((state) => {
          const newItems = [...state.cart.items, product];
          return {
            cart: {
              items: newItems,
              total: calculateTotal(newItems)
            }
          };
        }),

        removeFromCart: (productId) => set((state) => {
          const newItems = state.cart.items.filter(item => item.id !== productId);
          return {
            cart: {
              items: newItems,
              total: calculateTotal(newItems)
            }
          };
        }),

        toggleTheme: () => set((state) => ({
          ui: {
            ...state.ui,
            theme: state.ui.theme === 'light' ? 'dark' : 'light'
          }
        })),

        toggleSidebar: () => set((state) => ({
          ui: {
            ...state.ui,
            sidebarOpen: !state.ui.sidebarOpen
          }
        })),

        // Computed values
        getCartItemCount: () => get().cart.items.length,
        
        isAuthenticated: () => get().user !== null
      }),
      {
        name: 'app-storage', // LocalStorage key
        partialize: (state) => ({ 
          user: state.user,
          ui: { theme: state.ui.theme }
        })
      }
    ),
    { name: 'AppStore' }
  )
);

const calculateTotal = (items) => 
  items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

export default useStore;
```

Usage (simpler than Redux):

```jsx
// Components using Zustand

import useStore from './store/useStore';

const Cart = () => {
  const { cart, removeFromCart, getCartItemCount } = useStore();

  return (
    <div>
      <h2>Cart ({getCartItemCount()})</h2>
      <p>Total: ${cart.total.toFixed(2)}</p>
      {cart.items.map(item => (
        <div key={item.id}>
          {item.name} - ${item.price}
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

const ThemeToggle = () => {
  const { ui, toggleTheme } = useStore();
  
  return (
    <button onClick={toggleTheme}>
      Theme: {ui.theme}
    </button>
  );
};
```

## Common Mistakes

### 1. Putting All State in the Store
**Mistake:** Moving every piece of state to the global store, including component-local UI state.

```javascript
// ❌ BAD: Global store with component-specific UI state
const state = {
  modalOpen: false,           // Should be local
  dropdownExpanded: false,    // Should be local
  inputValue: '',             // Should be local
  searchResults: [],          // Should be in store (shared)
  currentUser: {}             // Should be in store (shared)
};
```

```javascript
// ✅ GOOD: Only shared state in store
const state = {
  searchResults: [],
  currentUser: {}
};

// Component-local state
const Modal = () => {
  const [isOpen, setIsOpen] = useState(false);
  // ...
};
```

**Why it matters:** Over-using the store increases complexity, causes unnecessary re-renders, and couples components to global state unnecessarily. See [State Basics](state.html) for guidance on state types.

### 2. Mutating Store State Directly
**Mistake:** Modifying state objects instead of returning new ones.

```javascript
// ❌ BAD: Direct mutation
const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      state.items.push(action.payload); // Mutation!
      return state; // Same reference, changes not detected
  }
};
```

```javascript
// ✅ GOOD: Immutable updates
const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload] // New array
      };
  }
};
```

**Why it matters:** Most state libraries rely on reference equality for change detection. Mutations break this mechanism, causing bugs and preventing optimization.

### 3. Not Structuring Store by Domain
**Mistake:** Creating a flat store structure that's hard to navigate.

```javascript
// ❌ BAD: Flat structure
const state = {
  userName: '',
  userEmail: '',
  userAvatar: '',
  cartItems: [],
  cartTotal: 0,
  productsLoading: false,
  productsData: [],
  productsError: null
  // ... becomes unmanageable
};
```

```javascript
// ✅ GOOD: Domain-organized structure
const state = {
  user: {
    name: '',
    email: '',
    avatar: ''
  },
  cart: {
    items: [],
    total: 0
  },
  products: {
    loading: false,
    data: [],
    error: null
  }
};
```

**Why it matters:** Domain-organized stores are easier to understand, enable code splitting by feature, and allow using `combineReducers` effectively.

## Quick Quiz

<details>
<summary><strong>Question 1:</strong> What is the primary benefit of using a centralized store instead of passing props?</summary>

**Answer:** A centralized store eliminates **prop drilling**—the need to pass data through many intermediate components that don't use it:

**Without store (prop drilling):**
```jsx
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <Menu user={user}>
        <UserProfile user={user} /> {/* Finally used here */}
      </Menu>
    </Sidebar>
  </Layout>
</App>
```

**With store:**
```jsx
<App>
  <Layout>
    <Sidebar>
      <Menu>
        <UserProfile /> {/* Accesses user from store directly */}
      </Menu>
    </Sidebar>
  </Layout>
</App>
```

**Additional benefits:**
- Components become decoupled (don't need to know about data they don't use)
- Easier refactoring (move components without updating props)
- Single source of truth (consistent data everywhere)

**Why it matters:** Prop drilling makes code brittle and components tightly coupled. Stores provide clean access to shared state.
</details>

<details>
<summary><strong>Question 2:</strong> What is a "reducer" and why is it called that?</summary>

**Answer:** A reducer is a **pure function** that takes current state and an action, then returns new state:

```javascript
const reducer = (state, action) => newState;
```

**Called "reducer" because** it's the same concept as Array.reduce():

```javascript
// Array.reduce
[1, 2, 3].reduce((sum, num) => sum + num, 0);
//                 ↑accumulator  ↑current  ↑initial

// Store reducer
actions.reduce((state, action) => newState, initialState);
//               ↑accumulator  ↑current     ↑initial
```

Both "reduce" a sequence of values into a single accumulated result. In Redux, the sequence is actions, and the result is the current state.

**Key properties:**
- **Pure:** Same input always produces same output
- **No side effects:** No API calls, no mutations, no randomness
- **Immutable:** Returns new state object, doesn't modify input

**Why it matters:** Understanding reducers as pure functions helps you write predictable state updates and avoid common bugs.
</details>

<details>
<summary><strong>Question 3:</strong> When should you use Redux vs simpler state management like Context or Zustand?</summary>

**Answer:** Use this decision matrix:

**Context API when:**
- Simple global state (theme, locale, auth)
- Infrequent updates
- Small to medium apps
- No complex state logic

**Zustand/Jotai when:**
- Want simpler API than Redux
- Medium complexity
- Don't need DevTools ecosystem
- Prefer hooks-based API

**Redux when:**
- Large, complex applications
- Need powerful DevTools (time-travel, action replay)
- Team familiar with Redux patterns
- Want extensive middleware ecosystem
- Need predictable, traceable state changes

**Example scenarios:**
- Blog with theme toggle → **Context**
- E-commerce site → **Zustand or Redux**
- Enterprise dashboard with complex workflows → **Redux**
- Personal project → **Zustand** (simpler)

**Why it matters:** Over-engineering with Redux for simple apps adds unnecessary complexity. Under-engineering with Context for complex apps leads to performance issues and hard-to-debug code.
</details>

<details>
<summary><strong>Question 4:</strong> What is the difference between `dispatch` and directly calling a function to update state?</summary>

**Answer:**

**Direct function call (not using store):**
```javascript
const updateUser = (newName) => {
  user.name = newName; // Direct mutation, no history
};
```

**Dispatch (store pattern):**
```javascript
dispatch({ type: 'UPDATE_USER', payload: { name: newName } });
```

**Key differences:**

1. **Traceability:** Dispatched actions are logged, direct calls aren't
2. **Middleware:** Dispatched actions can be intercepted (logging, analytics, async)
3. **DevTools:** Can inspect, time-travel, and replay dispatched actions
4. **Predictability:** Action objects describe "what happened," making flow explicit
5. **Debugging:** Can see every state change as a sequence of actions

**Real benefit:**
```javascript
// Redux DevTools shows:
// Action: UPDATE_USER { name: "Alice" }
// State before: { user: { name: "Bob" } }
// State after: { user: { name: "Alice" } }

// Can click to jump to any previous state!
```

**Why it matters:** The dispatch pattern enables powerful debugging and makes state changes explicit and traceable, especially valuable in large applications.
</details>

<details>
<summary><strong>Question 5:</strong> Can you have multiple stores in an application?</summary>

**Answer:** **It depends on the library:**

**Redux:** Officially recommends **single store** for the entire app
- Easier to serialize state
- Single subscription for whole app
- Simpler debugging
- But can use `combineReducers` to split logic

**Zustand/Jotai:** Supports **multiple stores**
```javascript
const useUserStore = create(/* ... */);
const useCartStore = create(/* ... */);
const useUIStore = create(/* ... */);
```
- Better code splitting
- Independent concerns
- More flexible

**When to use multiple stores:**
- Distinct application domains (user, cart, products)
- Code splitting requirements
- Team separation (different teams own different stores)

**When to use single store:**
- Need to coordinate state across domains
- Want centralized DevTools view
- Prefer Redux patterns

**Example:**
```javascript
// Multiple stores - domain separation
const useAuthStore = create(/* auth logic */);
const useDataStore = create(/* data fetching */);

// Usage
const auth = useAuthStore();
const data = useDataStore();
```

**Why it matters:** Store architecture affects code organization, testing, and debugging. Choose based on app complexity and team structure.
</details>

## References
- [1] https://www.womenwhocode.com/blog/the-back-end-of-the-front-end-state-part-1
- [2] https://blog.pixelfreestudio.com/ultimate-guide-to-state-management-in-frontend-applications/
- [3] https://blog.codewithdan.com/simplifying-front-end-state-management-with-observable-store/
- [4] https://www.capitalnumbers.com/blog/state-management-front-end-development/
- [5] https://softwareengineering.stackexchange.com/questions/434294/are-front-end-state-management-tools-an-anti-pattern
- [6] https://www.reddit.com/r/Frontend/comments/17kyo0v/what_is_state_management/
- [7] https://news.ycombinator.com/item?id=34130767