---
title: Implement a Redux-style reducer with immutability
layout: question
slug: counter-reducer
format: coding
difficulty: medium
layer: state
topics: [reducer, store]
skill: state-reducer
minutes: 20
summary: Build a reducer that handles state updates immutably for a simple counter.
---

A Redux reducer is a pure function that takes the current state and an action, and returns the next state. It must not mutate the state argument.

Implement a counter reducer that handles three action types:
- `'increment'` – increase `state.count` by 1
- `'decrement'` – decrease `state.count` by 1
- `'reset'` – set `state.count` to 0

The reducer must return a new state object on every change, leaving the original state untouched.

{% include code-playground.html %}

## Solution

### Approach 1: switch statement with object spread

Use a `switch` on `action.type` and return a new object with spread properties.

```js
export default function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state;
  }
}
```

Each case returns a fresh object, so the original `state` is never mutated. The `default` case returns the existing state reference, which is allowed when the state does not change.

### Approach 2: lookup table with implicit return

Map action types to reducer functions in an object and invoke the matching one, falling back to the identity reducer.

```js
const increment = (state) => ({ count: state.count + 1 });
const decrement = (state) => ({ count: state.count - 1 });
const reset = (state) => ({ count: 0 });
const identity = (state) => state;

const reducers = {
  increment,
  decrement,
  reset,
};

export default function counterReducer(state = { count: 0 }, action) {
  const reducer = reducers[action.type] || identity;
  return reducer(state);
}
```

This approach separates each case into a pure function, making it easy to test individually. The `identity` reducer ensures unchanged state is returned by reference when the action type is unknown.

## Trade-offs

The switch statement is familiar to most Redux developers and keeps all logic in one place, but it can become verbose as the number of actions grows. The lookup table scales linearly and isolates each action’s logic, but requires an extra object and a fallback. Both approaches guarantee immutability because they always return a new object for state-changing actions and never modify the input `state`. For this small counter, either choice is fine; in larger reducers, the lookup table often reduces cognitive load.

## Related

- Reading: [Reducer](../state/reducer.html) · [Store](../state/store.html)
- Agent Skill: `state-reducer`