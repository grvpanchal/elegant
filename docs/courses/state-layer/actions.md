---
title: "Actions: describe what happened, not what to set"
layout: lesson
course: state-layer
slug: actions
term: state/actions
skill: state-actions
practice: action-creators
description: "Actions are your app's event log. Learn their shape, how to name them, and the request/success/error triple an agent's code must follow."
insight: "An action announces that something happened, such as 'todo created' or 'request failed'. It does not tell the state what to become. Keep actions plain, serialisable and consistently named, and the action log becomes a replayable record of every change."
---

## Events, not setters

The [Actions]({{ '/state/actions.html' | relative_url }}) doc sums up the term in one contrast. An imperative update says "set user to X". An action says "user logged in with credentials X", and the store decides what that means. Actions are the only way to change state, so every change gets logged, can be traced, and can be reproduced. Replay the sequence and you rebuild the state at any point in time.

Five characteristics make an action an action:

- It is a plain object: no functions, classes or Promises.
- It has a `type` string.
- It may carry a `payload`.
- It follows the Flux Standard Action shape.
- Nothing changes it after it is created.

## Read the templates' triple

Open `templates/chota-react-saga/src/state/todo/todo.type.js`. Every async event comes in threes: `CREATE_TODO`, `CREATE_TODO_SUCCESS` and `CREATE_TODO_ERROR`, and the same pattern for `READ`, `UPDATE`, `TOGGLE` and `DELETE`. The creators in `todo.actions.js` are one-liners. Each returns `{ type, payload }`, or `{ type, error }` for a failure.

NgRx expresses the same idea with `createAction` and a `[Todo]` prefix that names where the action came from, in `templates/chota-angular-ngrx/src/app/state/todo/todo.actions.ts`: `loadTodosRequest`, `loadTodosSuccess` and `loadTodosFail`. The reducer turns that triple into the loading, data and error states of the UI.

Now compare `templates/chota-react-redux/src/state/todo/todo.actions.js`. There, `createTodo` builds its payload by incrementing a module-level `nextTodoId`. Call it twice with the same text and you get two different actions, so the creator is no longer a pure function of its arguments. That trade-off should be made deliberately, not by accident. The practice question asks for the strict version: same arguments, same action.

## What agents get wrong

The doc's three Common Mistakes are the ones you will catch most often:

1. **Payloads that cannot be serialised.** A class instance, a `fetch()` Promise or a callback ends up in `payload`, which breaks DevTools, persistence and time-travel debugging. Async work belongs in a thunk or a saga, and the action carries only the resulting data.
2. **Logic in action creators.** The creator reads `store.getState()`, validates its input and returns `NO_OP`. A creator should only create the action. Synchronous validation belongs in the reducer, and async work in middleware.
3. **Inconsistent naming.** `ADD_USER`, `user-delete` and `updateUser` all appear in one codebase. Pick one convention and keep to it. The doc recommends `domain/event`, and the templates apply their `UPPER_SNAKE_CASE` constants consistently.

## Review checklist for agent output

- Every `type` follows the codebase's single naming convention and is defined once as a constant, not typed inline as a string.
- Payloads are plain data that `JSON.stringify` could round-trip without loss.
- Every async operation has request, success and error actions, and the error action is actually dispatched.
- No action creator reads the store or calls the network.
- Any value that varies between calls, such as an id or a timestamp, is generated in exactly one named place and never inside a reducer.
