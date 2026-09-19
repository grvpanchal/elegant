---
title: Implement Redux-style action creators
layout: question
slug: action-creators
format: coding
difficulty: easy
layer: state
topics: [actions]
skill: state-actions
minutes: 15
summary: Create action creators that return plain action objects for a Redux store.
---

A Redux action creator is a function that returns an action object. The action object must have a `type` property and may have a `payload`.

Implement three action creators for a counter:
- `increment()` – returns `{ type: 'INCREMENT' }`
- `decrement()` – returns `{ type: 'DECREMENT' }`
- `setCount(payload)` – returns `{ type: 'SET_COUNT', payload }`

Each action creator must be a pure function: given the same arguments, it returns the same action object.

{% include code-playground.html %}

## Solution

### Approach 1: explicit return statements

Write each action creator as a function that returns an object literal.

```js
export function increment() {
  return { type: 'INCREMENT' };
}

export function decrement() {
  return { type: 'DECREMENT' };
}

export function setCount(payload) {
  return { type: 'SET_COUNT', payload };
}
```

This approach is straightforward and easy to read. Each action creator is isolated, making it simple to test individually.

### Approach 2: higher-order function for reusable type

Create a helper function that generates action creators for a given type, reducing duplication.

```js
function createActionCreator(type) {
  return function actionCreator(payload) {
    return { type, payload };
  };
}

export const increment = createActionCreator('INCREMENT');
export const decrement = createActionCreator('DECREMENT');
export const setCount = createActionCreator('SET_COUNT');
```

This approach centralizes the action type string, making it easier to refactor if the type changes. It also shows how to create action creators with optional payloads (by passing `undefined` when not needed).

## Trade-offs

Approach 1 is explicit and avoids an extra function call, which can be beneficial for performance-critical code paths. Approach 2 reduces boilerplate and centralizes the action type definition, which is useful when many action creators share similar patterns. For a small set of actions, either approach is fine; for larger action sets, the higher-order function reduces duplication and the risk of typos in type strings.

## Related

- Reading: [Actions](../state/actions.html) · [Store](../state/store.html)
- Agent Skill: `state-actions`