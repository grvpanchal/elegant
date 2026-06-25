# chota-react-zustand

An Elegant front-end boilerplate: **React 19 + [Zustand](https://github.com/pmndrs/zustand) 5 + Vite 8 + Vitest 4 + Storybook 10**, styled with [chota](https://jenil.github.io/chota/).

It is the state-management twin of `chota-react-saga` — the **exact same atomic-design UI** (`src/ui/{atoms,molecules,organisms,templates,skeletons}`) wired to a Zustand store instead of Redux + Redux-Saga. The async todo flow (optimistic updates with rollback, loading/error states) is preserved; only the state layer and containers differ.

## Getting Started

```sh
npm install
npm start      # vite dev server on http://localhost:3000
```

Other scripts:

```sh
npm run build           # production build into build/
npm test                # vitest run with coverage
npm run test:watch      # vitest watch mode
npm run storybook       # component workshop on :6006
npm run build-storybook
```

## Architecture

The folder layout is identical to the other templates so they stay interchangeable:

```
src/
  ui/             atomic-design components (atoms → templates), copied 1:1 from chota-react-saga
  containers/     "smart" components that read the store and pass props/events to UI
  pages/          route-level composition
  state/          Zustand store, organised modular per domain
  utils/          api mock + providers (AtomicProvider, TestProvider)
```

### State — Zustand, modular per domain

Each domain is its own slice, keeping the same `state.todo` / `state.filters` / `state.config` shape as the Redux templates so the selectors are reused as-is:

```
state/
  index.js                 create() the store + createAppStore() factory (devtools middleware)
  rootStore.js             combines the slices (the combineReducers analogue)
  todo/
    todo.slice.js          async actions (read/create/edit/update/toggle/delete) with optimistic rollback
    todo.initial.js        initial state
    todo.selectors.js      getVisibleTodos
    todo.helper.js         mapTodoData / toggleCheckedState
  filters/
    filters.slice.js       setVisibilityFilter
    filters.initial.js
    filters.selectors.js
    filters.type.js        SHOW_ALL / SHOW_COMPLETED / SHOW_ACTIVE
  config/
    config.slice.js        updateConfig
    config.initial.js
    config.selectors.js
```

A Zustand slice collapses the Redux **action + reducer + saga** triple into one async store action: it applies the optimistic update, awaits the (mock) API, then confirms or rolls back — the same request/success/failure behaviour, fewer files.

### Containers

Containers subscribe with the `useStore` hook and read actions straight off the store:

```jsx
import useStore from "../state";

const filtersData = useStore((state) => state.filters);
const setVisibilityFilter = useStore((state) => state.setVisibilityFilter);
```

No `<Provider>` is needed — the store is a module singleton.

## Testing

`npm test` runs Vitest with V8 coverage. Slices are tested against a fresh `createAppStore()` (with the API mocked); containers are tested by mocking the `../state` hook, mirroring the structure of the sibling templates.
