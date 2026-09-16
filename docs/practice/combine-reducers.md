---
title: Combine Reducers
layout: question
slug: combine-reducers
format: coding
difficulty: medium
layer: state
topics: [reducer, store]
skill: state-reducer
minutes: 20
summary: Implement a function that combines multiple reducer functions into a single reducer.
---

A Redux store's reducer is a pure function that takes the previous state and an action, and returns the next state. As an application grows, managing state in a single reducer becomes unwieldy. The `combineReducers` utility splits the reducing logic into separate functions, each responsible for a slice of the state.

Implement `combineReducers(reducers)`:

- `reducers` is an object where keys are state slice names and values are reducer functions.
- Return a new reducer function that handles every slice.
- The combined reducer calls each slice reducer with its slice of state and the action, then combines the results into a new state object.
- If any slice reducer returns a new state, the combined reducer returns a new state object; otherwise, it returns the original state object (for immutability).
- The combined reducer must return the initial state when called with `undefined` (i.e., on store initialization).
- Validate that `reducers` is an object and each value is a function; throw an error otherwise.

{% include code-playground.html %}

## Solution

### Approach 1: iterate over reducer keys

Validate the input, then return a reducer function that loops over each reducer key, calls the reducer with the appropriate state slice, and builds the next state object. Track whether any slice changed to decide whether to return a new state object or the original.

```js
export default function combineReducers(reducers) {
  if (typeof reducers !== 'object' || reducers === null || Array.isArray(reducers)) {
    throw new Error('combineReducers expects an object.');
  }

  const reducerKeys = Object.keys(reducers);
  for (let key of reducerKeys) {
    if (typeof reducers[key] !== 'function') {
      throw new Error(`Expected the reducer at ${key} to be a function.`);
    }
  }

  return function combination(state = {}, action) {
    let hasChanged = false;
    const nextState = {};

    for (let key of reducerKeys) {
      const reducer = reducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    return hasChanged ? nextState : state;
  };
}
```

This approach is straightforward and efficient. It avoids creating a new state object when no slice has changed, preserving reference equality for performance.

### Approach 2: use Array.reduce to build next state

After validation, use `Array.reduce` to accumulate the next state object. This approach is more functional but still requires tracking changes to decide whether to return the original state.

```js
export default function combineReducers(reducers) {
  if (typeof reducers !== 'object' || reducers === null || Array.isArray(reducers)) {
    throw new Error('combineReducers expects an object.');
  }

  const reducerKeys = Object.keys(reducers);
  for (let key of reducerKeys) {
    if (typeof reducers[key] !== 'function') {
      throw new Error(`Expected the reducer at ${key} to be a function.`);
    }
  }

  return function combination(state = {}, action) {
    const hasChanged = reducerKeys.some(key => {
      const reducer = reducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      return nextStateForKey !== previousStateForKey;
    });

    if (!hasChanged) {
      return state;
    }

    return reducerKeys.reduce((nextState, key) => {
      nextState[key] = reducers[key](state[key], action);
      return nextState;
    }, {});
  };
}
```

The `some` method checks if any slice changed. If not, return the original state. Otherwise, build a new state object with `reduce`. This version separates the change detection from the state building, which can be easier to read.

## Trade-offs

| | Approach 1 (loop with tracking) | Approach 2 (some + reduce) |
|---|---|---|
| Iterations | single pass over keys | two passes (some then reduce) |
| Early exit | none (must build nextState to compare) | can exit early in some if a change is found |
| Garbage | creates nextState object only if changed | creates nextState object only if changed |
| Readability | explicit loop, easy to debug | functional style, uses array methods |

Both approaches are valid. Approach 1 may be slightly more efficient because it builds the next state object in the same loop where it detects changes. Approach 2 is more declarative but iterates twice. For a typical number of slices (less than ten), the difference is negligible. Choose the style that matches your codebase.

## Related

- Reading: [Reducer](../state/reducer.html) · [Store](../state/store.html)
- Agent Skill: `state-reducer`