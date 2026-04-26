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

A store in frontend state management is a centralized location where an application's state is stored and managed. It serves as a single source of truth for the application's data, typically implemented as a plain JavaScript object held behind an opinionated API. The store holds the properties that represent shared aspects of the application's state — the signed-in user, cart contents, feature flags, in-flight request status, data fetched from APIs.

The store pattern emerged from the complexity of managing shared state in large applications. Without a store, components pass data through props (prop drilling), creating tight coupling and making state changes difficult to track. With a store, any component can access or update state through a well-defined interface, regardless of its position in the component hierarchy. This architectural shift simplifies data flow and makes applications more maintainable.

In the Universal Frontend Architecture, stores follow framework-agnostic patterns inspired by Flux and Redux. The core principles—unidirectional data flow, immutable updates, and pure reducer functions—transcend specific implementations. Whether using Redux, Vuex, Pinia, Zustand, or MobX, these patterns provide consistency and predictability across different tech stacks.

Four characteristics distinguish a store from an arbitrary global object:

1. **Centralization** — one well-known location every component reads from, rather than ad-hoc module-level singletons scattered across the codebase.
2. **Predictability** — updates only happen through a defined surface (dispatched actions, store methods, or store actions in Pinia), so every state transition is traceable.
3. **Accessibility** — any component, at any depth, can read or update state without prop-drilling through intermediate parents.
4. **Observability** — subscribers re-render only when the slice they care about changes, enabling efficient reactive UI updates.

Together these enable features that bare globals can't: time-travel debugging, action replay, undo/redo, hot-reloadable state, and crash-report payloads with the exact action sequence that triggered the bug. The next section shows how each `chota-*` template wires up its store in the smallest possible amount of code.

## Code Examples

### Basic Example: Store bootstrap across state libraries

The React-Saga and WC-Saga templates share an identical saga-backed setup — the saga pattern is framework-agnostic — so only one tab is shown.

{::nomarkdown}<div class="code-tabs">{:/}

Classic Redux
```javascript
// templates/chota-react-redux/src/state/index.js
import { createStore } from "redux";
import reducer from "./rootReducer";

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
```

Redux Toolkit
```javascript
// templates/chota-react-rtk/src/state/index.js
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

const store = configureStore({
  reducer: rootReducer,
  // DevTools and thunk middleware are wired automatically by configureStore.
});

export default store;
```

Redux Saga
```javascript
// templates/chota-react-saga/src/state/index.js
// (Identical setup in templates/chota-wc-saga/src/state/index.js —
// sagas don't care whether the UI is React or Web Components.)
import { composeWithDevTools } from "@redux-devtools/extension";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import reducer from "./rootReducer";
import sagas from "./rootSagas";

const sagaMiddleware = createSagaMiddleware();
const enhancer = applyMiddleware(sagaMiddleware);
const composedEnhancers = composeWithDevTools(enhancer);

const store = createStore(reducer, composedEnhancers);
sagaMiddleware.run(sagas);

export default store;
```

NgRx
```typescript
// templates/chota-angular-ngrx/src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { reducers } from './state';
import { TodoEffects } from './state/todo/todo.effects';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideStore(reducers),
    provideEffects([TodoEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: environment.production }),
  ],
};
```

Pinia
```javascript
// templates/chota-vue-pinia/src/state/todo/index.js
// Pinia has no single root "store" — each defineStore() is its own
// self-contained store with state / getters / actions, wired on the app
// via app.use(createPinia()) in main.ts.
import { defineStore, acceptHMRUpdate } from 'pinia';
import { addTodos, deleteTodos, getTodos, updateTodos, updateToggleTodos } from './todo.operations';
import intialTodoState from './todo.initial';
import { getVisibleTodos } from './todo.selectors';
import { editTodo } from './todo.actions';
import { useFiltersStore } from '../filters';
import { getSelectedFilter } from '../filters/filters.selectors';

export const useTodoStore = defineStore('todo', {
  state: () => ({ ...intialTodoState }),
  getters: {
    visibleTodos: (state) => {
      const filtersData = useFiltersStore();
      return getVisibleTodos(state, getSelectedFilter(filtersData).id);
    },
  },
  actions: { getTodos, addTodos, editTodo, updateTodos, updateToggleTodos, deleteTodos },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTodoStore, import.meta.hot));
}
```

{::nomarkdown}</div>{:/}

Each tab is the full store bootstrap straight from the corresponding template — real imports, real enhancers, real devtools wiring. The Redux family shares the `createStore` primitive (or `configureStore` as its opinionated wrapper). NgRx provides the same store via Angular DI. Pinia throws out the notion of one central store entirely: every `defineStore` call is a store in its own right, and the store tree emerges from which stores a component happens to use.

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
- Redux docs — [Store](https://redux.js.org/api/store) and [Redux Toolkit `configureStore`](https://redux-toolkit.js.org/api/configureStore)
- Pinia docs — [Defining a Store](https://pinia.vuejs.org/core-concepts/) (option-store and setup-store forms)
- NgRx docs — [Store architecture](https://ngrx.io/guide/store) and [`provideStore`](https://ngrx.io/api/store/provideStore)
- Zustand — [Recipes & comparison with Redux](https://github.com/pmndrs/zustand)
- Dan Abramov — ["You Might Not Need Redux"](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367) (still the canonical "do I even need a store?" piece)
- Mark Erikson — ["When (and when not) to reach for Redux"](https://blog.isquaredsoftware.com/2021/01/context-redux-differences/) on Context vs. a store