---
title: Store
layout: doc
slug: store
---

# Store

> - Centralized state container as single source of truth
> - Eliminates prop drilling with global access
> - Predictable data flow that scales to enterprise systems

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

{% include quiz.html id="store-1"
   question="What's the main benefit of a centralised store over passing props?"
   options="A|Props were removed in React 19, so a centralised store is now the only way to pass data between components — that's the main benefit;;B|The store is strictly faster because Redux uses an internal Map that looks up values in O(1), while prop drilling is O(depth);;C|Single source of truth: any component can subscribe to exactly the slice it needs without prop-drilling through intermediate components. Data flow becomes predictable (dispatch -> reducer -> new state -> selective subscriber re-renders), devtools can replay action history, and senders are decoupled from receivers. For cross-cutting state (auth, theme, cart, feature flags) a store beats threading props through 6 unrelated layers; for purely local state, props are still the right tool;;D|It bypasses React's rendering cycle and mutates the DOM imperatively, which is how Redux became popular for animation-heavy apps"
   correct="C"
   explanation="For cross-cutting concerns (auth, theme, cart, feature flags) a store beats threading props through 6 layers. For local-only data, props are still the right tool." %}

{% include quiz.html id="store-2"
   question="What is a reducer and why is it called that?"
   options="A|It's unrelated to Array.reduce;;B|It's a marketing term;;C|It reduces code size;;D|It's the same shape as a function you'd pass to Array.prototype.reduce — (accumulator, next) => newAccumulator. A Redux reducer is (state, action) => newState: you can conceptually .reduce the entire action history into the current state. That's the provenance of the name"
   correct="D"
   explanation="The naming isn't arbitrary — Redux's state at any moment equals all past actions reduced over the initial state via the reducer. That's also what enables time-travel debugging." %}

{% include quiz.html id="store-3"
   question="When should you reach for Redux vs lighter options like Context or Zustand?"
   options="A|Use Context for small, low-churn shared values (theme, auth user). Use Zustand/Jotai/Valtio for lightweight client state without middleware machinery. Use Redux (especially RTK) when you want opinionated structure, powerful devtools, middleware ecosystem, or cross-cutting async orchestration via sagas/listeners — particularly in larger apps and teams;;B|Only Context works with server state;;C|Always use Redux;;D|Zustand is deprecated"
   correct="A"
   explanation="Match the tool to the app's scale and team needs. RTK has dramatically narrowed the &quot;Redux is heavy&quot; gap; Zustand is ideal when you want less ceremony." %}

{% include quiz.html id="store-4"
   question="What's the difference between calling dispatch(action) and calling a function that updates state directly?"
   options="A|Direct function calls are faster and preferred;;B|They are functionally identical;;C|dispatch routes the action through all middleware (logging, thunks, analytics, crash reporting) and produces a serialized, time-travel-able event; a direct function call is opaque to devtools, un-replayable, and doesn't get middleware cross-cutting concerns. dispatch is the unified event bus;;D|dispatch is a UI-only API"
   correct="C"
   explanation="Actions + dispatch are an event log. Direct state mutation is off-the-books. Devtools, replayability, and middleware ALL rely on going through dispatch." %}

{% include quiz.html id="store-5"
   question="Can you have multiple stores in a single application?"
   options="A|Technically yes (Redux allows multiple stores and NgRx supports feature stores), but the standard advice is a SINGLE app-wide store with slices. Multiple independent stores fragment devtools, complicate cross-slice logic, and usually indicate a design that would be cleaner as slices of one store. Exceptions: micro-frontends with isolated domains;;B|No — Redux forbids multiple stores entirely;;C|Multiple stores only work in Vue;;D|Yes, and you should — one per component"
   correct="A"
   explanation="Pinia naturally has multiple stores by design. Redux philosophy is one store with slices. Either way, needing many independent stores usually means something should be a slice." %}

## References
- [1] https://www.womenwhocode.com/blog/the-back-end-of-the-front-end-state-part-1
- [2] https://blog.pixelfreestudio.com/ultimate-guide-to-state-management-in-frontend-applications/
- [3] https://blog.codewithdan.com/simplifying-front-end-state-management-with-observable-store/
- [4] https://www.capitalnumbers.com/blog/state-management-front-end-development/
- [5] https://softwareengineering.stackexchange.com/questions/434294/are-front-end-state-management-tools-an-anti-pattern
- [6] https://www.reddit.com/r/Frontend/comments/17kyo0v/what_is_state_management/
- [7] https://news.ycombinator.com/item?id=34130767