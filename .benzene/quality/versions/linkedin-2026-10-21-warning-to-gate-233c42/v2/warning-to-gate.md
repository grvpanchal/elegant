# The warning your console already sends

React-Redux 9 runs a stability check the first time a selector runs in development. It calls the selector twice with the same state. If the two results aren't ===, it warns:

"Selector unknown returned a different result when called with the same parameters. This can lead to unnecessary rerenders."

---

# Why it says "unknown"

The warning names the selector. An inline arrow has no name, so React-Redux calls it "unknown". Name it — selectVisibleTodos — and the warning tells you exactly which selector is unstable, instead of leaving you to guess.

---

# The default only checks once

In development the check runs the first time, then stops. An unstable selector slips past on every later call. stabilityCheck="always" runs the check on every call — that's what a test suite needs, not what production ships.

---

# Fail the test when the console warns

Render your component under <Provider store={store} stabilityCheck="always">. Spy on console.warn and fail the test when it's called. One spy, one assertion. One unstable selector, one red test — before it reaches review.

---

# The prompt that passes the gate

"Add selectVisibleTodos with createSelector in todo.selectors.js. Inputs: selectTodo and the selected filter id. The component reads only the selector. Done means: the stability test passes and no test logs a warning."

---

# What the gate buys you

The checks carry the rules, so the prompt can stay short. The test runner reports "done", not an opinion. An agent writes the code; the gate decides whether it's acceptable.

---

# Build the memoizer yourself

Write createSelector with a recomputations() counter and watch unstable selectors fail the gate. Free practice question, no sign-up.

https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors
