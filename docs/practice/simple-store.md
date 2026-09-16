---
title: Create a Redux-like store
layout: question
slug: simple-store
format: coding
difficulty: medium
layer: state
topics: [store, reducer]
skill: state-store
minutes: 20
summary: Implement a minimal store with getState, dispatch, and subscribe.
---

A Redux store holds the application state and provides three methods:
`getState()` to read the state, `dispatch(action)` to update it via a reducer,
and `subscribe(listener)` to register change listeners.

Implement `createStore(reducer, initialState)` that returns an object with
those three methods. The store must:

- Initialize state to `initialState`.
- Run the reducer with an `@@INIT` action on creation so reducers can set up
  their initial state.
- Return the current state with `getState()`.
- Update state with `dispatch(action)` by assigning `state = reducer(state,
  action)` and then calling all subscribed listeners.
- Allow listeners to unsubscribe by returning a function from `subscribe`
  that removes them from the internal list.
- Call subscribed listeners synchronously after each dispatch.

{% include code-playground.html %}

## Solution

### Approach 1: closure with mutable state

Keep the current state and a list of listeners in the closure. On creation,
dispatch an init action to let the reducer set up the state.

```js
export default function createStore(reducer, initialState) {
  let state = initialState;
  let listeners = [];

  // Initialize with @@INIT so reducers can set up state
  dispatch({ type: '@@INIT' });

  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action);
    // Copy to avoid issues if a listener unsubscribes during iteration
    const copy = listeners.slice();
    for (let i = 0; i < copy.length; i++) {
      copy[i]();
    }
  }

  function subscribe(listener) {
    listeners.push(listener);
    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }

  return { getState, dispatch, subscribe };
}
```

### Approach 2: separate subscribe and unsubscribe APIs

Instead of returning an unsubscribe function, store subscriptions in a
Map and return a token that can be used to unsubscribe later. This
demonstrates an alternative API but behaves the same externally.

```js
export default function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = new Map();
  let nextToken = 0;

  // Init
  dispatch({ type: '@@INIT' });

  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach(cb => cb());
  }

  function subscribe(listener) {
    const token = nextToken++;
    listeners.set(token, listener);
    return function unsubscribe() {
      listeners.delete(token);
    };
  }

  return { getState, dispatch, subscribe };
}
```

## Trade-offs

| | Closure with array | Map‑based tokens |
|---|---|---|
| Simplicity | Very straightforward; no extra data structures. | Slightly more code but shows how to decouple subscription from listener identity. |
| Unsubscribing during iteration | Requires copying the listener array to avoid skipping listeners. | Safe to delete from a Map while iterating because we iterate over values only. |
| Memory overhead | Array of listeners; duplicates possible if same listener added twice. | Map stores token→listener; prevents duplicate listeners if same token reused (unlikely). |
| Typical use case | Matches Redux’s internal implementation and is what most developers expect. | Useful when you want to unsubscribe by a handle rather than passing the original listener back. |

Both approaches satisfy the contract; choose the first for simplicity unless you need the token‑based unsubscribe pattern.

## Related

- Reading: [Store](../state/store.html) · [Reducer](../state/reducer.html)
- Agent Skill: `state-store`