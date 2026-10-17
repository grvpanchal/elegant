---
title: "Selectors: derive, don't store"
layout: lesson
course: state-layer
slug: selectors
term: state/selectors
skill: state-selectors
practice: memoized-selector
description: "Selectors are the read layer between store and UI. Learn why memoisation depends on reference equality, and how to spot the selector that re-renders everything."
insight: "Selectors are a store's computed properties. They turn raw state into exactly what a component needs, and memoisation means the work runs again only when an input changes by reference. They also hide the shape of state, so a refactor touches selectors instead of every component."
---

## The read layer

Every lesson so far has covered the write path. Selectors are the read path: pure functions that take state and return the shape a component renders. The [Selectors]({{ '/state/selectors.html' | relative_url }}) doc lists what they give you:

- memoisation, so expensive work isn't repeated
- reuse of the same logic across components
- view models that combine several slices
- a hidden state shape, so components don't depend on it
- testability, because they are pure functions

The `state-selectors` skill turns that into rules. Compute derived data in selectors and never store it. Components never read `state.todos.items` directly. Name each selector `selectXxx` and keep it next to its slice.

## Read the template's selector

The Redux-family templates all ship the same `getVisibleTodos(todo, filter)`; see `templates/chota-react-redux/src/state/todo/todo.selectors.js`. It switches on `SHOW_ALL`, `SHOW_COMPLETED` and `SHOW_ACTIVE`, filters `todoItems`, throws on an unknown filter, and returns `{ ...todo, todoItems: visibleTodos }`. Pinia exposes the same logic as a `visibleTodos` getter on the todo store, and NgRx wraps it in `createSelector` from `@ngrx/store`.

That return statement deserves a second look. It builds a new object on every call, so any subscriber that compares by reference sees a change every time. That is the doc's first Common Mistake. With a short list it costs nothing. With a 5,000-item list, which is the scenario in the practice question, it causes a re-render on every store update.

## Memoisation is reference equality

A memoised selector is built with `createSelector(...inputSelectors, resultFn)`. It runs each input selector, and if every result is `===` to the previous call's, it returns the cached result without calling `resultFn`. Agents routinely miss two consequences of this:

- **Memoisation only works if the reducers are immutable.** A mutated array keeps its reference, so the selector keeps returning stale data.
- **Reselect's cache is one entry deep.** Share one parametrised selector across many `UserCard`s with different ids, and each call overwrites the cache, so it never hits. The doc's fix is a selector factory, `makeSelectUserById`, called once per component instance.

The doc's third mistake completes the picture. A selector returns data, never handlers. An `addTodo: (text) => dispatch(...)` inside a selector's result belongs in the component.

## Ask for it like this

```text
Add selectVisibleProducts(state) in products.selectors.js using createSelector.
Inputs: selectProducts, selectFilter, selectSearchTerm. No derived field in state.
Components use the selector, never state.products directly.
Test that two calls with unchanged state return the same reference
and that recomputations() stays at 1.
```

The practice question has you build that `createSelector` yourself, `recomputations()` counter included. Once you have written the cache by hand, you can tell from a diff whether an agent's selector will ever hit it.
