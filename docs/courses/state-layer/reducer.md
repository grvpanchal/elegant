---
title: "Reducer: the only place state changes"
layout: lesson
course: state-layer
slug: reducer
term: state/reducer
skill: state-reducer
practice: counter-reducer
description: "A reducer is a pure function from state and action to new state. Learn the three rules an agent's reducer must pass and how the templates apply them."
insight: "Given the same state and action, a reducer always returns the same new state, and it never mutates either input. Purity is not a style choice: time-travel, replay and deterministic tests all depend on it, so treat any side effect in a reducer as a bug."
---

## Three rules

The `state-reducer` skill boils the term down to three principles:

1. **Pure functions.** No API calls, no random values, no `Date.now()`.
2. **Immutable updates.** Return new objects, and never mutate `state` or `action`.
3. **Handle unknown actions.** For any type you do not recognise, return the current state. Never throw.

The name comes from `Array.prototype.reduce`. A reducer folds a sequence of actions into the current state, just as `reduce` folds an array into a single value. The [Reducer]({{ '/state/reducer.html' | relative_url }}) doc calls reducers the "laws of physics" of your state, because they can be tested, replayed and proven correct.

## How the templates write one

`templates/chota-react-redux/src/state/todo/todo.reducer.js` shows the classic form. A `switch (action.type)` has every case return `{ ...state, ... }`, and `todoItems` is rebuilt with `map` or `filter`, never with `push`. The `default` case returns `state`.

The saga template's reducer, `templates/chota-react-saga/src/state/todo/todo.reducer.js`, adds success and error cases. Before it flips an item on `TOGGLE_TODO`, it copies the current list into `previousStateTodoItems`. If the request fails, that copy is what the list rolls back to, and taking it involves no side effect.

`templates/chota-react-rtk/src/state/todo/todo.reducer.js` uses `createSlice`. Inside a slice, a library called Immer lets you write `state.todoItems.push(...)` and still get an immutable update. So code that looks like mutation is correct inside a slice and wrong everywhere else. Agents often copy that style into plain reducers where Immer isn't running. Look at the slice's `createTodo` case too: it sets `id: nextTodoId++` from a counter declared outside the reducer. The reducer's output now depends on how many times it has run, which is exactly what the skill's rule against non-pure functions is there to catch.

## The mistakes the doc names

1. **Mutating state directly.** `state.count++; return state;` hands back the same reference. Redux checks for changes by comparing references, so it sees nothing new. The component never re-renders, DevTools time-travel breaks, and memoised selectors keep returning stale results.
2. **Side effects in reducers.** `localStorage.setItem`, `fetch` and even `console.log` all belong in middleware.
3. **No default case.** The reducer returns `undefined` for `@@INIT` or any other unknown action, and the whole slice disappears.

## Ask for it like this

```text
Write the cart reducer as a pure function (state = initialCart, action).
Return new objects for every change; never mutate state or action.
No fetch, storage, logging, Date.now() or Math.random() inside it.
Unknown action types return state unchanged.
Add one unit test per case, plus a test that the input state is not mutated.
```

The last line asks for exactly what the practice question's tests check: a change returns a new object, and the original state is left untouched.
