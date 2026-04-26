---
title: AJAX
layout: doc
slug: ajax
---

# AJAX

> - Asynchronous server requests without full page reloads
> - Fetched data feeds the store via request/success/fail action triples
> - Lives in operations, sagas, effects, or Pinia actions — never in reducers

## Detailed Description

AJAX (Asynchronous JavaScript And XML) is the umbrella term for any client-side HTTP request made without navigating the browser. Two browser APIs implement it: the legacy `XMLHttpRequest` (event-driven, verbose, but supports upload progress and synchronous mode) and the modern `fetch` (Promise-based, streams-aware, the default in every template here). Libraries like Axios wrap one of those two; under the hood it's still XHR or fetch.

In this repo, AJAX never appears inside a reducer — reducers stay pure. Instead, network calls live in the side-effect layer for each framework: `src/state/<slice>/<slice>.operations.js` for Redux Saga and Pinia, `<slice>.effects.ts` for NgRx, and (when added) thunks/`createAsyncThunk` for plain Redux and RTK. Every template imports a thin `utils/api.js` helper that returns a `fetch`-compatible Response.

Every async flow follows the same three-action shape: a *request* action flips a loading flag, a *success* action commits the payload to the store, and a *fail* action records the error. The `try / catch` around the call dispatches success on the happy path and fail in the catch — that pattern is identical across saga, effect, thunk, and Pinia operation files. Watchers (`takeLatest`, `ofType`, action-listener middleware) wire the request action to the side effect.

Fetch and XHR have one critical asymmetry worth memorising: **`fetch` only rejects on network failures**, not on HTTP error status. A 404 or 500 produces a resolved Promise whose `response.ok` is `false`, so callers must check it explicitly before parsing JSON. XHR, by contrast, surfaces no error status either — you must inspect `xhr.status`. Either way, "the request returned" and "the request succeeded" are different questions.

## Key Insight

AJAX in a state-managed app is plumbing, not policy. The interesting design choice is *where* the fetch lives and *which actions* it dispatches — never whether to use XHR or fetch directly in a component. By pushing every network call into operations / sagas / effects / Pinia actions, the rest of the app becomes synchronous: components dispatch a request action and re-render off selectors, reducers stay pure functions of `(state, action)`, and tests can mock the network at one well-defined seam instead of stubbing `global.fetch` everywhere.

## Basic Example

The same "load todos from the server" flow expressed in each template's idiom. The watcher / effect / store-action listens for the request action, hits the API, then dispatches success or fail.

{::nomarkdown}<div class="code-tabs">{:/}

<p>React Redux</p>
{% raw %}
```jsx
// templates/chota-react-redux/src/state/todo/todo.actions.js (thunk form)
// Plain Redux uses redux-thunk: an action creator returns a function
// that receives dispatch, calls fetch, and dispatches the triple.
import fetchApi from "../../utils/api";
import { READ_TODO_SUCCESS, READ_TODO_ERROR } from "./todo.type";

export const readTodos = () => async (dispatch) => {
  dispatch({ type: "READ_TODO" });
  try {
    const res = await fetchApi("/todos");
    const data = await res.json();
    dispatch({ type: READ_TODO_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: READ_TODO_ERROR, payload: error.toString() });
  }
};
```
{% endraw %}

<p>React RTK</p>
{% raw %}
```jsx
// templates/chota-react-rtk/src/state/todo/todo.actions.js (createAsyncThunk)
// RTK collapses request/success/fail into pending/fulfilled/rejected
// lifecycle actions on a single thunk.
import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchApi from "../../utils/api";

export const readTodos = createAsyncThunk(
  "todo/read",
  async (_, { rejectWithValue }) => {
    const res = await fetchApi("/todos");
    if (!res.ok) return rejectWithValue(`HTTP ${res.status}`);
    return res.json();
  }
);
```
{% endraw %}

<p>React Saga</p>
{% raw %}
```jsx
// templates/chota-react-saga/src/state/todo/todo.operations.js
import { put, takeLatest, call } from "redux-saga/effects";
import { READ_TODO } from "./todo.type";
import { readTodoSuccess, readTodoError } from "./todo.actions";
import fetchApi from "../../utils/api";

export function getTodoApi() { return fetchApi("/todos"); }

export function* getTodos() {
  try {
    const res = yield call(getTodoApi);
    const data = yield res.json();
    yield put(readTodoSuccess(data));
  } catch (error) {
    yield put(readTodoError(error.toString()));
  }
}

export function* watchTodos() { yield takeLatest(READ_TODO, getTodos); }
```
{% endraw %}

<p>NgRx (Angular)</p>
{% raw %}
```ts
// templates/chota-angular-ngrx/src/app/state/todo/todo.effects.ts
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import * as TodoActions from './todo.actions';

loadTodosRequest$ = createEffect(() =>
  this.actions$.pipe(
    ofType(TodoActions.loadTodosRequest),
    switchMap(() =>
      this.todoService.getAllTodos().pipe(
        mergeMap((todos) => [TodoActions.loadTodos({ todos }),
                             TodoActions.loadTodosSuccess()]),
        catchError((error) =>
          of(TodoActions.loadTodosFail({ error: error.message })))
      ))));
```
{% endraw %}

<p>Pinia (Vue)</p>
{% raw %}
```js
// templates/chota-vue-pinia/src/state/todo/todo.operations.js
import { readTodo, readTodoSuccess, readTodoError } from "./todo.actions";
import { mapTodoData } from "./todo.helper";
import fetchApi from "../../utils/api";

export async function getTodos() {
  try {
    readTodo.bind(this)();
    const res = await fetchApi("/todos");
    const data = await res.json();
    readTodoSuccess.bind(this)(mapTodoData(data));
  } catch (error) {
    readTodoError.bind(this)(error.toString());
  }
}
```
{% endraw %}

{::nomarkdown}</div>{:/}

## Practical Example

A `createAsyncThunk` that fetches todos, with explicit `response.ok` checking and `AbortController` wired through RTK's `signal`. The slice's `extraReducers` reacts to the three lifecycle actions RTK generates automatically.

```javascript
// src/state/todo/todo.thunks.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchTodos = createAsyncThunk(
  "todo/fetch",
  async (_, { signal, rejectWithValue }) => {
    try {
      const res = await fetch("/api/todos", { signal });
      if (!res.ok) {
        return rejectWithValue({ status: res.status, message: res.statusText });
      }
      return await res.json();
    } catch (error) {
      if (error.name === "AbortError") throw error; // let RTK mark it canceled
      return rejectWithValue({ message: error.message });
    }
  }
);

const todoSlice = createSlice({
  name: "todo",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending,   (s) => { s.status = "loading"; s.error = null; })
      .addCase(fetchTodos.fulfilled, (s, a) => { s.status = "ready"; s.items = a.payload; })
      .addCase(fetchTodos.rejected,  (s, a) => {
        s.status = "error";
        s.error = a.payload ?? a.error.message;
      });
  },
});

export default todoSlice.reducer;
```

## Common Mistakes

### 1. Treating a 4xx/5xx response as success

```js
// BAD — fetch resolves on HTTP 500, so this swallows server errors
const res = await fetch("/api/todos");
const data = await res.json(); // may throw, or worse: parse an error body
dispatch(readTodoSuccess(data));
```

```js
// GOOD — gate on response.ok before parsing
const res = await fetch("/api/todos");
if (!res.ok) throw new Error(`HTTP ${res.status}`);
dispatch(readTodoSuccess(await res.json()));
```

**Why it matters:** `fetch` only rejects on network failures. Without an `ok` check, error pages get parsed as data and your reducer ends up with garbage state.

### 2. Leaking requests / race conditions

```js
// BAD — older request can resolve last and clobber newer data
useEffect(() => { dispatch(searchUsers(query)); }, [query]);
```

```js
// GOOD — abort the previous request when query changes
useEffect(() => {
  const ctrl = new AbortController();
  dispatch(searchUsers({ query, signal: ctrl.signal }));
  return () => ctrl.abort();
}, [query]);
```

**Why it matters:** Without cancellation, a slow earlier response overwrites the latest one and the UI shows stale results — `takeLatest` solves this in saga, `switchMap` in NgRx, `AbortController` in thunks.

### 3. Calling `fetch` inside a reducer

```js
// BAD — reducers must be pure; this breaks DevTools, tests, and SSR
case READ_TODO:
  fetch("/api/todos").then(r => r.json()); // side effect in reducer
  return state;
```

```js
// GOOD — fetch lives in the side-effect layer; reducer just handles success
case READ_TODO_SUCCESS:
  return { ...state, items: action.payload };
```

**Why it matters:** Reducers are run during time-travel, hydration, and tests. Any I/O inside them re-fires on replay, makes them non-deterministic, and shatters the mental model of `(state, action) => state`.

## Quick Quiz

{% include quiz.html
  id="ajax-1"
  question="A `fetch('/api/todos')` call returns HTTP 500. What happens to the returned Promise?"
  options="A: It rejects with a `FetchError`;;B: It resolves; you must check `response.ok` (false) yourself;;C: It throws synchronously before returning a Promise;;D: It resolves only if the body is valid JSON"
  correct="B"
  explanation="`fetch` only rejects on network errors (DNS failure, CORS, offline). HTTP error statuses produce a resolved Promise with `response.ok === false`. This is the single biggest gotcha vs Axios."
%}

{% include quiz.html
  id="ajax-2"
  question="In a Redux/RTK/Saga/NgRx app, where should the actual `fetch()` call live?"
  options="A: Inside the reducer, gated on action type;;B: Inside the React component that needs the data;;C: In the side-effect layer — operations, sagas, effects, or thunks — never in the reducer;;D: In a global window-level fetch wrapper called from anywhere"
  correct="C"
  explanation="Reducers must be pure: `(state, action) => state`. AJAX lives in operations.js / saga / NgRx effect / thunk, which dispatch a *_SUCCESS or *_FAIL action that the reducer consumes."
%}

{% include quiz.html
  id="ajax-3"
  question="What does `AbortController` solve in an AJAX flow?"
  options="A: It retries failed requests automatically;;B: It lets you cancel an in-flight request — passed via `fetch(url, { signal })` and triggered by `controller.abort()`;;C: It parses non-JSON responses safely;;D: It batches multiple fetches into one HTTP/2 stream"
  correct="B"
  explanation="`AbortController.signal` is the standard cancellation primitive. Combine with `useEffect` cleanup (or `takeLatest` / `switchMap` upstream) to avoid stale responses overwriting newer state."
%}

{% include quiz.html
  id="ajax-4"
  question="Why does an unguarded `useEffect(() => dispatch(search(q)), [q])` produce wrong UI?"
  options="A: React batches the dispatches and drops some;;B: `dispatch` is synchronous and blocks the render;;C: A slow earlier request can resolve AFTER a faster newer one, so the older payload overwrites the latest — a classic race condition;;D: The effect cleanup runs before the dispatch"
  correct="C"
  explanation="Network ordering is not guaranteed. Solutions: cancel previous (AbortController), use `takeLatest`/`switchMap`, or tag responses with the originating query and ignore mismatched results."
%}

{% include quiz.html
  id="ajax-5"
  question="Which order is safe for a fetch handler?"
  options="A: `await res.json()` first, then `if (!res.ok)` — JSON is faster to check;;B: `if (!res.ok) throw ...` first, THEN `await res.json()` — never parse an error body as data;;C: Skip the `ok` check entirely and rely on a try/catch;;D: Parse twice and compare"
  correct="B"
  explanation="Checking `response.ok` before `res.json()` prevents parsing an HTML error page or JSON error envelope into your data shape, which would silently corrupt the store."
%}

## References
- [MDN: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [MDN: XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [Redux Toolkit: createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk)
- [Redux Saga: Effects (call, put, takeLatest)](https://redux-saga.js.org/docs/api/#effect-creators)
- [NgRx Effects guide](https://ngrx.io/guide/effects)
