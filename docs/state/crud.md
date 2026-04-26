---
title: CRUD
layout: doc
slug: crud
---

# CRUD

## Glossary

> - **CRUD** — the four verbs (Create, Read, Update, Delete) every persistent collection supports.
> - **Action triple** — `_REQUEST`, `_SUCCESS`, `_FAIL` variants of one verb that model the start, happy path, and error path of an async call.
> - **Domain prefix** — a feature scope like `[Todo]` or `todo/` that namespaces actions so two slices can share a verb without colliding.

## Detailed Description

CRUD is the lingua franca of persistence. Pick a noun in your app — todos, users, invoices — and the user-facing operations almost always reduce to creating new ones, reading the list, updating individual rows, and deleting them. Naming your state actions after these four verbs keeps the action log readable: anyone scanning a Redux DevTools timeline can guess what `CREATE_TODO` and `DELETE_TODO` do without opening a reducer.

The mapping holds across storage layers, which is why every template in this repo reuses the same vocabulary on the client:

| CRUD   | SQL    | HTTP   | Redux action       | NgRx action        |
| ------ | ------ | ------ | ------------------ | ------------------ |
| Create | INSERT | POST   | `CREATE_TODO`      | `[Todo] CreateTodo`|
| Read   | SELECT | GET    | `READ_TODO`        | `[Todo] LoadTodos` |
| Update | UPDATE | PUT    | `UPDATE_TODO`      | `[Todo] UpdateTodo`|
| Delete | DELETE | DELETE | `DELETE_TODO`      | `[Todo] DeleteTodo`|

Async CRUD needs more than four actions, though. Once a request leaves the browser, the UI has three things to render: the in-flight spinner, the resolved data, and the error. The Redux family templates encode that as the **request/success/fail triple** — `CREATE_TODO`, `CREATE_TODO_SUCCESS`, `CREATE_TODO_ERROR` — so the reducer can flip a `isLoading` flag on request, commit data on success, and surface an error string on failure. NgRx spells it `addTodoRequest` / `addTodoSuccess` / `addTodoFail`; RTK's `createAsyncThunk` generates `pending`/`fulfilled`/`rejected` automatically.

The exception is purely-local actions like `EDIT_TODO` (stage the row being edited) and `TOGGLE_TODO` (flip the checkbox). Those mutate UI state synchronously and don't need a triple. The rule of thumb: if it touches the network or another tab, give it a triple; if it only touches the current store, a single action is fine.

## Key Insight

A CRUD action name has two axes: the **verb** (what the user wants) and the **lifecycle phase** (where in the round-trip we are). One axis without the other leaves your reducer guessing. `CREATE_TODO` alone can't tell loading from done; `SUCCESS` alone can't tell create from update. The triple is the smallest naming scheme that pins down both.

## Basic Example

{::nomarkdown}<div class="code-tabs">{:/}

<p>React Redux</p>
{% raw %}
```jsx
// templates/chota-react-redux/src/state/todo/todo.type.js
export const CREATE_TODO = "CREATE_TODO";
export const READ_TODO   = "READ_TODO";
export const UPDATE_TODO = "UPDATE_TODO";
export const TOGGLE_TODO = "TOGGLE_TODO";
export const DELETE_TODO = "DELETE_TODO";

// classic Redux keeps action types as constants so typos
// surface at import time rather than at runtime
```
{% endraw %}

<p>React RTK</p>
{% raw %}
```jsx
// templates/chota-react-rtk/src/state/todo/todo.actions.js
import { todoSlice } from "./todo.reducer";

export const {
  createTodo,
  editTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
} = todoSlice.actions;
// createAsyncThunk inside the slice generates
// pending / fulfilled / rejected automatically
```
{% endraw %}

<p>React Saga</p>
{% raw %}
```jsx
// templates/chota-react-saga/src/state/todo/todo.actions.js
export const createTodo = (text) => ({
  type: CREATE_TODO,
  payload: { text, completed: false },
});
export const createTodoSuccess = (payload) => ({
  type: CREATE_TODO_SUCCESS,
  payload,
});
export const createTodoError = (error) => ({
  type: CREATE_TODO_ERROR,
  error,
});
```
{% endraw %}

<p>NgRx (Angular)</p>
{% raw %}
```ts
// templates/chota-angular-ngrx/src/app/state/todo/todo.actions.ts
export const addTodoRequest = createAction(
  '[Todo] AddTodoRequest',
  props<{ text: string }>()
);
export const addTodoSuccess = createAction('[Todo] AddTodoSuccess');
export const addTodoFail = createAction(
  '[Todo] AddTodoFail',
  props<{ error: string }>()
);
```
{% endraw %}

<p>Pinia (Vue)</p>
{% raw %}
```js
// templates/chota-vue-pinia/src/state/todo/todo.actions.js
export function createTodo(text) {
  this.isLoading = true;
  this.isActionLoading = true;
  this.currentTodoItem = { text, completed: false };
}
export function createTodoSuccess(payload) {
  this.isLoading = false;
  this.todoItems.push({ id: payload.id, text: payload.text, completed: false });
}
export function createTodoError(error) {
  this.isLoading = false;
  this.error = error;
}
```
{% endraw %}

{::nomarkdown}</div>{:/}

## Practical Example

A focused **optimistic update** flow using the saga template. Toggling a todo flips the checkbox immediately, then reconciles with the server — and rolls back if the request fails. The triple is what makes rollback possible: the success action clears the snapshot, the error action restores it.

{% raw %}
```js
// templates/chota-react-saga/src/state/todo/todo.operations.js
export function* updateToggleTodos(action) {
  try {
    yield call(updateTodoApi, toggleCheckedState(action.payload));
    yield put(toggleTodoSuccess());
  } catch (error) {
    // brief delay so the optimistic flip is visible before rollback
    yield delay(500);
    const previous = yield select(
      (state) => state.todo.previousStateTodoItems
    );
    yield put(toggleTodoError(previous, error.toString()));
  }
}

// reducer stashes the pre-toggle list when TOGGLE_TODO fires,
// drops it on TOGGLE_TODO_SUCCESS, and restores from it on
// TOGGLE_TODO_ERROR. Three actions, three reducer branches —
// one verb, one lifecycle.
```
{% endraw %}

The UI dispatches a single `toggleTodo(item)`. Saga intercepts, calls the API, and emits success or error. Without the triple you'd either block the UI on the network (no optimism) or have no way to undo the flip when the server rejects it.

## Common Mistakes

### 1. Collapsing the lifecycle into one action

{% raw %}
```js
// BAD — one action covers request, success, and error
dispatch({ type: 'CREATE_TODO', payload: newTodo });
// reducer has no idea whether to show a spinner, commit the row,
// or render an error banner — it's all the same action.
```
{% endraw %}

{% raw %}
```js
// GOOD — three actions, one per lifecycle phase
dispatch(createTodo(text));               // CREATE_TODO         → isLoading = true
// saga / thunk runs, then…
dispatch(createTodoSuccess(saved));       // CREATE_TODO_SUCCESS → push row, clear flag
// or on failure…
dispatch(createTodoError(err.toString()));// CREATE_TODO_ERROR   → set error, clear flag
```
{% endraw %}

**Why it matters:** the loading flag, the data commit, and the error message live in different reducer branches. One action means the reducer can't distinguish them, which means the UI can't render a spinner, an empty state, or an error toast without ad-hoc booleans bolted on top.

### 2. Naming actions after database rows instead of intents

{% raw %}
```js
// BAD — action sounds like a record, not an event
dispatch({ type: 'TODO_ROW', payload: { id: 7, text: 'milk' } });
// What happened to the row? Was it inserted? Edited? Loaded from cache?
```
{% endraw %}

{% raw %}
```js
// GOOD — action names a user intent, payload carries the record
dispatch(createTodo('milk'));    // intent: add a new todo
dispatch(updateTodo({ id: 7, text: 'oat milk' })); // intent: edit row 7
dispatch(deleteTodo(7));         // intent: remove row 7
```
{% endraw %}

**Why it matters:** actions are events in a log, not entities in a table. The DevTools timeline should read like a story (`CREATE_TODO`, `READ_TODO_SUCCESS`, `TOGGLE_TODO`) — not a dump of rows. Naming by intent also makes sagas and effects easier: you `takeLatest(CREATE_TODO, addTodos)` because that's the verb you're reacting to.

### 3. Forgetting to invalidate cached lists after Create or Delete

{% raw %}
```js
// BAD — DELETE_TODO_SUCCESS only flips the loading flag
case DELETE_TODO_SUCCESS:
  return { ...state, isLoading: false };
// the deleted row is still in state.todoItems until the next READ_TODO
```
{% endraw %}

{% raw %}
```js
// GOOD — Create / Delete success actions also reconcile the list
case DELETE_TODO_SUCCESS:
  return {
    ...state,
    isLoading: false,
    todoItems: state.todoItems.filter((t) => t.id !== action.payload.id),
    previousStateTodoItems: undefined, // drop the rollback snapshot
  };
```
{% endraw %}

**Why it matters:** Read-shaped caches (`state.todoItems`, RTK Query's `getTodos` cache, an NgRx entity adapter's collection) don't auto-update when a sibling mutation succeeds. Either invalidate the cache, optimistically patch it, or refetch — but pick one. Skipping this step is the single most common reason a "deleted" todo reappears after a route change.

## Quick Quiz

{% include quiz.html
  id="crud-1"
  question="Which CRUD verb maps to HTTP POST and SQL INSERT?"
  options="A: Read;;B: Update;;C: Create;;D: Delete"
  correct="C"
  explanation="Create is the verb for bringing a new resource into existence — POST in HTTP, INSERT in SQL, CREATE_TODO in the templates."
%}

{% include quiz.html
  id="crud-2"
  question="Why split an async create into CREATE_TODO, CREATE_TODO_SUCCESS, and CREATE_TODO_ERROR?"
  options="A: Redux requires three actions per thunk;;B: To distinguish in-flight, resolved, and failed phases so the reducer can render loading, data, and error states;;C: To keep the action log under 100 entries;;D: TypeScript can't infer payloads otherwise"
  correct="B"
  explanation="The triple gives the reducer three distinct branches — one per lifecycle phase — so the UI can render a spinner, the new row, or an error message without ambiguity."
%}

{% include quiz.html
  id="crud-3"
  question="Which action in the templates does NOT use a request/success/fail triple, and why?"
  options="A: CREATE_TODO — it's synchronous;;B: READ_TODO — it's cached;;C: EDIT_TODO — it only stages the row being edited locally, no network call;;D: DELETE_TODO — deletes are idempotent"
  correct="C"
  explanation="EDIT_TODO is a purely-local UI action that copies a row into currentTodoItem. No request goes out, so there's nothing to succeed or fail."
%}

{% include quiz.html
  id="crud-4"
  question="In NgRx, what does the bracketed prefix '[Todo]' in '[Todo] CreateTodo' represent?"
  options="A: The reducer file name;;B: The feature/domain scope, so two slices can share a verb without colliding;;C: TypeScript generics;;D: A required NgRx tag for DevTools"
  correct="B"
  explanation="The bracket prefix is the domain namespace. '[Todo] CreateTodo' and '[User] CreateUser' coexist because the prefix scopes them, and DevTools groups actions by it."
%}

{% include quiz.html
  id="crud-5"
  question="After DELETE_TODO_SUCCESS fires, the deleted row still shows up until the next page load. What's the most likely cause?"
  options="A: The success reducer flipped isLoading but did not remove the row from the cached list;;B: The DELETE HTTP call returned 204 instead of 200;;C: Sagas don't support delete;;D: createAsyncThunk swallowed the action"
  correct="A"
  explanation="A success action has to do two things: clear the loading flag AND reconcile the cache (filter out the deleted row, or refetch). Skipping the cache update is the canonical 'ghost row' bug."
%}

## References

- [CRUD on Wikipedia](https://en.wikipedia.org/wiki/CRUD_(acronym)) — origin of the acronym and its mapping to persistence verbs.
- [Redux Style Guide](https://redux.js.org/style-guide/) — official guidance on action naming, including the request/success/failure pattern.
- [NgRx Action Hygiene](https://ngrx.io/guide/store/actions) — the `[Source] Event` naming convention used by `chota-angular-ngrx`.
- [Redux Toolkit `createAsyncThunk`](https://redux-toolkit.js.org/api/createAsyncThunk) — auto-generated `pending`/`fulfilled`/`rejected` triple powering `chota-react-rtk`.
- [Redux-Saga `takeLatest`](https://redux-saga.js.org/docs/api/#takelatestpattern-saga-args) — how `chota-react-saga` watches a CRUD verb and runs the operation that emits the success/error action.
- [Pinia stores](https://pinia.vuejs.org/core-concepts/) — option-store form (`state` + `actions`) used by `chota-vue-pinia` to colocate the triple as plain methods.
- [REST vs CRUD](https://www.strongdm.com/what-is/crud-vs-rest) — how the four verbs translate to HTTP, useful when designing the API your actions call.
