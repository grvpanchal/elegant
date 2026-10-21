# 5 State pairs that sound similar but work differently

The State layer's words come in look-alike pairs. Mix one up in a prompt and the agent writes the wrong half. Save this for your next code review.

---

# Event vs action

An event is the browser saying something happened: a click, with a target and coordinates. It stays in the UI layer. An action is the store's record of it, a plain serialisable object such as `{ type: "todo/toggled", payload: 3 }`. The container turns one into the other.

---

# Reducer vs selector

Both are pure functions of state. A reducer is the write path: `(state, action) => nextState`, the only place state changes. A selector is the read path: `state => view`, and what it derives is never written back to the store.

---

# Middleware vs operation

Middleware is the pipeline every action passes through between dispatch and the reducer: logging, async plumbing, crash reports. An operation is one async job that calls an API and dispatches request, success or fail. Operations run inside middleware.

---

# Store vs state

State is the value at one moment, and every change replaces it with a new object. The store is the container you keep: one per app, with getState, dispatch and subscribe. Keep the store; read state through it. A saved copy goes stale on the next dispatch.

---

# Plain selector vs memoized selector

Both return the same value. Only the memoized one returns the same reference when its inputs haven't changed, and that reference is what useSelector compares. A plain selector that builds an object re-renders its component on every store change.

---

# Practise the pair agents get wrong most

Build createSelector by hand with a recomputations() counter, and see why the same reference matters. Runs in your browser, free, no sign-up.

elegantfrontend.training/practice/memoized-selector.html
