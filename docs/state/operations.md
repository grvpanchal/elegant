---
title: Operations
layout: doc
slug: operations
---

# Operations

## Glossary

> - **Operation** — an async function that wires an action to an API call and dispatches request/success/fail follow-ups.
> - **Side effect** — anything outside reducer purity: network, timers, storage, navigation.
> - **Lifecycle triple** — the request / success / fail action trio that drives loading, data, and error UI states.

## Detailed Description

An **operation** is the async layer between a UI event and the store. The component dispatches a plain action ("user clicked add"); the operation runs the fetch, awaits the response, and dispatches the resulting success or error action. Reducers stay pure; everything that touches the network lives here.

In this repo, operations live next to their slice. Saga and Pinia name the file `todo.operations.js`; RTK uses `createAsyncThunk`; classic Redux uses a hand-written thunk; NgRx uses `createEffect` in `todo.effects.ts`. Same role, different ceremony.

The distinction matters: **actions describe *what* happened**, **operations describe *how* to get there**. Separating them is what makes reducers replayable and devtools time-travel possible — the network round-trip is fully reified as the action triple it produced.

Operations also own the cross-cutting concerns of async UX: loading flags, optimistic updates with rollback (Saga and Pinia capture `previousStateTodoItems` before the request), and cancellation when a newer request supersedes an older one (`takeLatest` in sagas, `switchMap` in NgRx effects).

## Key Insight

Reducers are the *what*; operations are the *how*. Move every `await` and `try/catch` into operations and reducers stay as pure functions of `(state, action)` — fully testable and replayable — while the running app still gets real network behaviour, optimistic updates, and cancellation.

## Basic Example

The same "add a todo" operation in all five state libraries — each fires a request, calls the API, dispatches success or error.

{::nomarkdown}<div class="code-tabs">{:/}

<p>React Redux</p>
{% raw %}
```jsx
// templates/chota-react-redux/src/state/todo/todo.actions.js
export const createTodo = (text) => ({ type: CREATE_TODO, payload: { text } });
export const createTodoSuccess = (todo) => ({ type: CREATE_TODO_SUCCESS, payload: todo });
export const createTodoError = (e) => ({ type: CREATE_TODO_ERROR, error: e });

export const addTodo = (text) => async (dispatch) => {
  dispatch(createTodo(text));
  try {
    const res = await fetch("/todos", { method: "POST", body: JSON.stringify({ text }) });
    dispatch(createTodoSuccess(await res.json()));
  } catch (err) {
    dispatch(createTodoError(err.toString()));
  }
};
```
{% endraw %}

<p>React RTK</p>
{% raw %}
```jsx
// templates/chota-react-rtk/src/state/todo/todo.actions.js
import { createAsyncThunk } from "@reduxjs/toolkit";

export const addTodo = createAsyncThunk(
  "todo/add",
  async (text, { rejectWithValue }) => {
    try {
      const res = await fetch("/todos", { method: "POST", body: JSON.stringify({ text }) });
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.toString());
    }
  }
);
```
{% endraw %}

<p>React Saga</p>
{% raw %}
```jsx
// templates/chota-react-saga/src/state/todo/todo.operations.js
import { put, takeLatest, call } from "redux-saga/effects";
import { createTodoSuccess, createTodoError } from "./todo.actions";
import fetchApi from "../../utils/api";

export function addTodoApi(payload) {
  return fetchApi("/todos", { method: "POST", body: payload });
}

export function* addTodos(action) {
  try {
    const payload = { ...action.payload, id: window.crypto.randomUUID() };
    yield call(addTodoApi, payload);
    yield put(createTodoSuccess(payload));
  } catch (error) {
    yield put(createTodoError(error.toString()));
  }
}

export function* watchTodos() {
  yield takeLatest(CREATE_TODO, addTodos);
}
```
{% endraw %}

<p>NgRx (Angular)</p>
{% raw %}
```ts
// templates/chota-angular-ngrx/src/app/state/todo/todo.effects.ts
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError, mergeMap } from 'rxjs/operators';
import * as TodoActions from './todo.actions';

@Injectable()
export class TodoEffects {
  addTodoRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.addTodoRequest),
      switchMap(({ text }) =>
        this.todoService.createTodo(text).pipe(
          mergeMap((todo) => [
            TodoActions.createTodo({ id: todo.id, text: todo.text }),
            TodoActions.addTodoSuccess(),
          ]),
          catchError((error) => of(TodoActions.addTodoFail({ error: error.message })))
        )
      )
    )
  );
  constructor(private actions$: Actions, private todoService: TodoService) {}
}
```
{% endraw %}

<p>Pinia (Vue)</p>
{% raw %}
```js
// templates/chota-vue-pinia/src/state/todo/todo.operations.js
import { createTodo, createTodoSuccess, createTodoError } from "./todo.actions";
import fetchApi from "../../utils/api";

export function addTodoApi(payload) {
  return fetchApi("/todos", { method: "POST", body: payload });
}

export async function addTodos(text) {
  try {
    createTodo.bind(this)(text);
    const payload = { ...this.currentTodoItem, id: window.crypto.randomUUID() };
    await addTodoApi(payload);
    createTodoSuccess.bind(this)(payload);
  } catch (error) {
    createTodoError.bind(this)(error.toString());
  }
}
```
{% endraw %}

{::nomarkdown}</div>{:/}

## Practical Example

Optimistic toggle from the React Saga template. The reducer flips the checkbox immediately on `TOGGLE_TODO`; the saga calls the API and, on failure, waits 500ms then dispatches `TOGGLE_TODO_ERROR` with the pre-toggle snapshot the reducer captured.

{% raw %}
```jsx
// templates/chota-react-saga/src/state/todo/todo.operations.js
import { put, takeLatest, call, select, delay } from "redux-saga/effects";
import { TOGGLE_TODO } from "./todo.type";
import { toggleTodoSuccess, toggleTodoError } from "./todo.actions";
import { toggleCheckedState } from "./todo.helper";
import fetchApi from "../../utils/api";

export function updateTodoApi(payload) {
  return fetchApi("/todos", { method: "PUT", body: payload });
}

export function* updateToggleTodos(action) {
  try {
    // Reducer already flipped the checkbox optimistically on TOGGLE_TODO.
    yield call(updateTodoApi, toggleCheckedState(action.payload));
    yield put(toggleTodoSuccess());
  } catch (error) {
    // Rollback: brief delay so the user sees the optimistic state, then restore.
    yield delay(500);
    const previous = yield select((s) => s.todo.previousStateTodoItems);
    yield put(toggleTodoError(previous, error.toString()));
  }
}

export function* watchTodos() {
  // takeLatest cancels any in-flight toggle when a newer one arrives.
  yield takeLatest(TOGGLE_TODO, updateToggleTodos);
}
```
{% endraw %}

The pattern: optimistic update in the reducer, network call in the operation, rollback action on failure, `takeLatest` for cancellation.

## Common Mistakes

### 1. Doing API calls inside reducers

**Mistake:** Calling `fetch` from a reducer to keep things "in one place."

{% raw %}
```jsx
// BAD
function todoReducer(state, action) {
  if (action.type === CREATE_TODO) {
    fetch("/todos", { method: "POST", body: JSON.stringify(action.payload) }); // side effect!
    return { ...state, todoItems: [...state.todoItems, action.payload] };
  }
  return state;
}
```
{% endraw %}

{% raw %}
```jsx
// GOOD — reducer stays pure; side effect lives in the operation.
function todoReducer(state, action) {
  if (action.type === CREATE_TODO_SUCCESS) {
    return { ...state, todoItems: [...state.todoItems, action.payload] };
  }
  return state;
}
export function* addTodos(action) {
  try {
    const saved = yield call(addTodoApi, action.payload);
    yield put(createTodoSuccess(saved));
  } catch (e) { yield put(createTodoError(e.toString())); }
}
```
{% endraw %}

**Why it matters:** Reducers must be pure — same input, same output, no I/O. A `fetch` inside one breaks devtools time-travel, replay, SSR hydration, and most testing assumptions.

### 2. Not cancelling when the component unmounts

**Mistake:** Letting an in-flight request resolve into a store that no longer cares.

{% raw %}
```jsx
// BAD: every keystroke fires; results race; stale ones win.
useEffect(() => {
  dispatch(searchTodos(query));
}, [query]);
```
{% endraw %}

{% raw %}
```jsx
// GOOD: takeLatest in the saga cancels older requests automatically.
export function* watchSearch() {
  yield takeLatest(SEARCH_TODOS, runSearch);
}
// Or with createAsyncThunk: read signal in your fetch and abort on unmount.
const searchThunk = createAsyncThunk("todo/search", async (q, { signal }) => {
  const res = await fetch(`/todos?q=${q}`, { signal });
  return res.json();
});
```
{% endraw %}

**Why it matters:** Without cancellation, a slow earlier request can land *after* a fast later one and overwrite the correct result. `takeLatest` (saga) and `switchMap` (NgRx) solve this idiomatically; thunks need an `AbortController`.

### 3. Catching errors but never dispatching the FAIL action

**Mistake:** Swallowing the error so the UI sticks on its loading spinner forever.

{% raw %}
```jsx
// BAD
export function* addTodos(action) {
  try {
    yield call(addTodoApi, action.payload);
    yield put(createTodoSuccess(action.payload));
  } catch (error) {
    console.error(error); // logged, but the store still thinks isLoading=true
  }
}
```
{% endraw %}

{% raw %}
```jsx
// GOOD
export function* addTodos(action) {
  try {
    yield call(addTodoApi, action.payload);
    yield put(createTodoSuccess(action.payload));
  } catch (error) {
    yield put(createTodoError(error.toString())); // reducer flips isLoading=false, sets error
  }
}
```
{% endraw %}

**Why it matters:** The lifecycle triple is a contract — every request must end in either success *or* fail. Skipping the fail dispatch leaves the UI in a permanent loading state and hides bugs from users and devtools alike.

## Quick Quiz

{% include quiz.html
  id="operations-1"
  question="What is an 'operation' in this codebase, conceptually?"
  options="A: A reducer case that returns a Promise;;B: An async function that wires an action to an API call and dispatches request/success/fail follow-ups;;C: A selector with caching;;D: A middleware that rewrites action types"
  correct="B"
  explanation="Operations live next to the slice (todo.operations.js, todo.effects.ts, or a thunk) and own the network call plus the lifecycle dispatches. Reducers stay pure."
%}

{% include quiz.html
  id="operations-2"
  question="Which file holds operations in each template family?"
  options="A: Always todo.operations.js;;B: todo.operations.js for Saga and Pinia, a createAsyncThunk in todo.actions.js for RTK, a hand-written thunk for classic Redux, and todo.effects.ts for NgRx;;C: They all live in todo.reducer.js;;D: There are no operations — everything is in actions"
  correct="B"
  explanation="The naming varies by framework but the role is identical: an async function that dispatches the request/success/fail triple."
%}

{% include quiz.html
  id="operations-3"
  question="What does takeLatest in a saga (or switchMap in an NgRx effect) buy you?"
  options="A: Faster network calls;;B: Automatic retries on failure;;C: Cancellation — when a newer request of the same type arrives, the older in-flight one is cancelled, preventing race conditions where stale responses overwrite fresh data;;D: Local caching of responses"
  correct="C"
  explanation="Cancellation is the most common cause of stale-data bugs in async UIs. takeLatest and switchMap are the idiomatic solutions in their respective ecosystems."
%}

{% include quiz.html
  id="operations-4"
  question="Why keep API calls out of reducers?"
  options="A: Performance — reducers run on a hot path;;B: Reducers must be pure functions of (state, action) so the action log can be replayed deterministically; any I/O breaks time-travel devtools, SSR hydration, and testability;;C: Because Redux throws an error if you do;;D: It's a stylistic preference with no functional impact"
  correct="B"
  explanation="Purity is the contract that powers everything Redux-y — devtools, persistence, hot reload. The moment a reducer makes a network call that contract is gone."
%}

{% include quiz.html
  id="operations-5"
  question="An operation catches a network error and logs it but never dispatches a FAIL action. What goes wrong?"
  options="A: Nothing — logging is sufficient;;B: The reducer never flips isLoading back to false, so the UI stays stuck on a spinner and the error never reaches the user;;C: Redux DevTools throws;;D: The next dispatch is rejected"
  correct="B"
  explanation="The lifecycle triple is a contract: every request ends in success OR fail. Skipping the fail dispatch leaves loading=true forever and hides the error from the UI."
%}

## References

- [Redux Toolkit: `createAsyncThunk`](https://redux-toolkit.js.org/api/createAsyncThunk) — the official thunk creator with auto-generated pending/fulfilled/rejected actions.
- [Redux Saga: effect creators](https://redux-saga.js.org/docs/api/) — `takeLatest`, `call`, `put`, `select` and the cancellation primitives.
- [NgRx: Effects](https://ngrx.io/guide/effects) — `createEffect`, `switchMap` for cancellation, request/success/fail action pattern.
- [Pinia: Actions](https://pinia.vuejs.org/core-concepts/actions.html) — why Pinia operations are just async methods on the store.
- [Redux Style Guide: actions as events](https://redux.js.org/style-guide/#model-actions-as-events-not-setters) — the mindset that keeps operations and actions cleanly separated.
- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) — how to cancel a `fetch` from a thunk when the component unmounts.
- [React: `useOptimistic`](https://react.dev/reference/react/useOptimistic) — the hook-level counterpart to optimistic-with-rollback at the store level.
</content>
</invoke>