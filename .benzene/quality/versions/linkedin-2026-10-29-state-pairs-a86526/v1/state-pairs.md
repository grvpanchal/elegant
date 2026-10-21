# 5 State pairs that sound alike, work differently

The State layer's words come in look-alike pairs.

Each one names a different side of a boundary, and a prompt that swaps them gets the wrong half built.

---

# Event vs action

An event is what the browser saw: a click, with a target node. It stays in the UI layer.

An action is what the store records, a plain serialisable object such as { type: "todo/toggled", payload: 3 }.

The container turns one into the other.

---

# Reducer vs selector

Both are pure functions of state. A reducer is the write path, (state, action) => nextState, and the only place state changes.

A selector is the read path, state => view. What it derives is never written back.

---

# Middleware vs operation

Middleware is the pipeline every action passes through between dispatch and the reducer: logging, async plumbing, crash reports.

An operation is one async job inside it: call the API, dispatch request, then success or fail.

---

# Store vs state

The store is the object you keep, one per app, with getState, dispatch and subscribe. State is the value it replaces on every dispatch.

A component that saves a copy of state is reading yesterday's.

---

# Plain selector vs memoized selector

Both return the same value.

Only the memoized one returns the same object until an input changes, and useSelector compares objects, not values.

In our template the plain one rendered the list on every theme toggle.

---

# Practise the pair agents get wrong most

Build createSelector by hand with a recomputations() counter and see why the same reference matters. Runs in your browser, free, no sign-up.

elegantfrontend.training/practice/memoized-selector.html
