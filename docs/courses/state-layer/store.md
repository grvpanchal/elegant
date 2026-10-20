---
title: "Store: one source of truth, one way in"
layout: lesson
course: state-layer
slug: store
term: state/store
skill: state-store
practice: simple-store
description: "What separates a store from a global object, how each template wires one up, and how to stop an agent turning it into a junk drawer."
insight: "A store is the single source of truth for shared state. Its rules are what make it more than a global object: one location, changes only through a defined surface, and subscriptions by slice. Review an agent's store against those rules, not by whether the code runs."
---

## Four properties, not one object

The [Store]({{ '/state/store.html' | relative_url }}) doc lists four properties that separate a store from any other global object:

1. **Centralization.** There is one well-known location that every component reads from.
2. **Predictability.** State changes only through a defined surface: dispatched actions, store methods, or Pinia store actions.
3. **Accessibility.** Any component at any depth can read or update state without passing it down through props.
4. **Observability.** A subscriber re-renders only when the slice it cares about changes.

Those properties are what make time-travel debugging, action replay, undo/redo and crash reports possible, since every change arrives as a recorded action. Now picture a module-level `let user = {}` that an agent imports into five files. It has the first property and none of the others.

## The same store, five spellings

Every template sets up its store in a few lines, and comparing them shows what is essential:

- `templates/chota-react-redux/src/state/index.js` calls `createStore(reducer, …)` and connects the DevTools extension.
- `templates/chota-react-rtk/src/state/index.js` calls `configureStore({ reducer: rootReducer })`, which sets up DevTools and thunk middleware for you.
- `templates/chota-react-saga/src/state/index.js` uses `createStore` with `applyMiddleware(sagaMiddleware)`, then `sagaMiddleware.run(sagas)`.
- `templates/chota-angular-ngrx/src/app/app.config.ts` registers `provideStore(reducers)` and `provideEffects([TodoEffects])` through Angular's dependency injection.
- `templates/chota-vue-pinia/src/state/todo/index.js` has no root store at all. Each `defineStore('todo', { state, getters, actions })` is a store in its own right.

What they share is the essential part. State is organised by domain (`todo`, `filters`, `config`), and there is exactly one way to change it.

## What to reject in review

Together, the doc's Common Mistakes and the skill's DON'T list make a review checklist:

- Component-local UI state such as `modalOpen` or `inputValue` in the store. Move it back to the component.
- A reducer that calls `state.items.push(...)` and then returns `state`. It hands back the same reference, so no subscriber sees the change.
- A flat store with `userName`, `cartTotal` and `productsLoading` side by side. Group state by domain, so each slice can be split out and combined with `combineReducers`.
- Values computed from other state but stored anyway, or values that cannot be serialised, such as functions and class instances.
- A second store created "just for this feature".

## Build the smallest one

The practice question strips a store down to its contract. `getState()` reads the state. `dispatch(action)` runs the reducer and notifies listeners. `subscribe(listener)` returns a function that unsubscribes. On creation, the store dispatches `@@INIT` so reducers can set their initial state. Once you have written those three methods, any store an agent produces is readable, whether it is Redux, NgRx or Pinia. Each one is the same three ideas in different syntax.

A prompt that uses the term precisely:

```text
Add a cart slice to the existing store. Do not create a new store.
Cart state is { items: [], status: 'idle' }; derive the total in a selector.
State changes only through actions; no component mutates cart state.
```
