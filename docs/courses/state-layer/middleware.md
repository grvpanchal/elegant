---
title: "Middleware: the pipeline between dispatch and reducer"
layout: lesson
course: state-layer
slug: middleware
term: state/middleware
skill: state-middleware
practice: middleware-order
description: "Middleware is where side effects live. Learn the store => next => action shape, why order matters, and how sagas, effects and thunks play the role."
insight: "Middleware sees every action between dispatch and the reducer, which makes it the one approved home for side effects such as API calls, logging and analytics. It is a pipeline, not a switch: its order and its calls to next() decide what every later step sees."
---

## The shape

Middleware has one signature: `store => next => action => { … }`. Inside it, you can read the state, dispatch new actions, inspect or rewrite the current one, delay it, or stop it altogether. Calling `next(action)` passes the action on to the next middleware, and from the last one to the reducer. The [Middleware]({{ '/state/middleware.html' | relative_url }}) doc compares it to airport security: every passenger goes through the same checkpoints, in the same order, before boarding.

```js
const logger = (store) => (next) => (action) => {
  console.log('dispatching', action.type);
  const result = next(action);   // the rest of the chain, then the reducer
  console.log('next state', store.getState());
  return result;
};
```

## Four spellings of one job

Each template creates a todo on the server and then updates the store, and each does it through its own form of middleware:

- **Saga.** In `templates/chota-react-saga/src/state/todo/todo.operations.js`, `watchTodos` calls `takeLatest(CREATE_TODO, addTodos)`. The `addTodos` generator `call`s the API, then `put`s `createTodoSuccess` or `createTodoError`. The saga middleware is attached in `state/index.js` with `applyMiddleware(sagaMiddleware)`.
- **NgRx.** In `templates/chota-angular-ngrx/src/app/state/todo/todo.effects.ts`, an effect built from `createEffect`, `ofType` and `switchMap` does the work, registered with `provideEffects`.
- **Pinia.** There is no middleware layer. `templates/chota-vue-pinia/src/state/todo/todo.operations.js` is an `async` store action.
- **RTK.** `configureStore` already includes thunk middleware plus immutability and serialisability checks. To add your own middleware, extend the defaults with `getDefault().concat(...)` rather than replacing them.

## Order and next()

The practice quiz is built on the doc's three Common Mistakes:

1. **Forgetting `next(action)`.** The action stops there. The reducer never sees it, and the UI silently does nothing.
2. **Using `next()` for a new action.** `next` carries on from the current position, so middleware earlier in the chain never sees the new action. `store.dispatch()` starts it at the top. Use `dispatch` for new actions and `next` to pass the current one along. Re-dispatching the current action with `dispatch` sends it back through this same middleware, which loops forever.
3. **Mutating the action.** After `action.payload.id = Date.now()`, every later middleware receives a different object from the one that was dispatched. Create a new action instead.

Order matters because the chain works like an onion: the action passes in through every layer, then control unwinds back out. With `applyMiddleware(logger, thunk)`, the logger runs before thunk, so it receives the raw thunk function instead of an action. That is why the skill says to put the logger last.

## Review checklist

- Side effects such as fetch calls, storage and analytics live in middleware, sagas, effects or thunks, never in a reducer or a component.
- Every middleware calls `next(action)`, unless blocking the action is the documented intent.
- New actions go out through `store.dispatch`, and the current action is passed on with `next`.
- On RTK, the default middleware is extended with `getDefault().concat()`, not replaced.
- Every async path ends in either a success action or an error action.
