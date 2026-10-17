---
title: "Operations: every request is a lifecycle"
layout: lesson
course: state-layer
slug: operations
term: state/operations
skill: state-operations
practice: retry-with-backoff
description: "Operations are the async layer between a UI event and the store. Learn the request/success/fail contract, optimistic rollback and cancellation."
insight: "Reducers describe what changes; operations describe how it gets done. Every await and try/catch lives in an operation that ends in exactly one success or fail action. That keeps reducers replayable while the app still gets real network calls, optimistic updates and cancellation."
---

## Where the await goes

An operation is the async function that sits between a UI event and the store. The component dispatches a plain action, and the operation runs the fetch and dispatches the outcome. The [Operations]({{ '/state/operations.html' | relative_url }}) doc calls this outcome the lifecycle triple: request, success, fail. The triple drives three UI states: loading, data and error.

The templates keep each operation next to its slice, under different names. The saga and Pinia templates call the file `todo.operations.js` (in `templates/chota-react-saga/src/state/todo/` and `templates/chota-vue-pinia/src/state/todo/`). NgRx calls it `todo.effects.ts`. The role is the same and only the ceremony differs.

## Optimistic, with a way back

The saga template's toggle is the pattern worth copying. An optimistic update shows the change before the server confirms it, so the code has to be able to undo it.

1. On `TOGGLE_TODO`, the reducer flips the checkbox at once and saves the old list as `previousStateTodoItems`.
2. `updateToggleTodos` in `todo.operations.js` then calls the API. On success it dispatches `toggleTodoSuccess()` with `put`.
3. On failure, it waits 500 ms, reads the saved list with `select`, and dispatches `toggleTodoError(previous, error)`, which restores it.

`watchTodos` registers the operation with `takeLatest`, so a newer toggle cancels one that is still in flight. NgRx gets the same cancellation from `switchMap`, and a thunk needs an `AbortController`.

## The three ways it breaks

The doc's Common Mistakes are the failures an agent produces when asked to "add an API call":

1. **The fetch goes in the reducer** "to keep it in one place". The reducer is no longer pure, and with that you lose replay, time-travel and SSR hydration.
2. **There is no cancellation.** Every keystroke fires a search, and a slow early response can land after a fast later one and overwrite the right answer.
3. **The catch logs the error and dispatches nothing.** `isLoading` stays true, the spinner never stops, and neither the user nor DevTools sees the failure.

The third is the most dangerous, because the code looks finished. Treat the lifecycle triple as a contract: every request ends in success or fail.

## Retries belong here too

Retrying is also an operation's job. The naive version is `setTimeout(fn, 1000)` in a loop, which makes every client retry in lockstep during an outage. The practice question asks for the grown-up version:

- Back off exponentially, up to a capped maximum delay.
- Add full jitter, so the delay is random within that limit.
- Retry only network errors, `5xx` and `429`.
- Stop the moment an `AbortSignal` fires.

A brief you can hand an agent:

```text
Add loadProducts as an operation next to the products slice.
Dispatch request, then exactly one of success or fail.
Cancel the previous load when a new one starts.
Retry only network errors, 5xx and 429, with capped exponential backoff and jitter.
The reducer stays pure; no fetch outside the operation.
```
