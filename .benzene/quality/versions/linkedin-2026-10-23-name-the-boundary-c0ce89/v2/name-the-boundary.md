# Name the boundary

The agent writes the code. You name the layer a value belongs to, what crosses a boundary, and what "done" means as a test. That's the job an agent can't take.

---

# State: two layers, one word

UI state lives in a component. Server state comes from the network. Both are called "state." Putting network data in UI state blurs the boundary an agent won't redraw.

---

# Action vs Event

An event is what the browser saw. An action is what the store records. They sound the same but live on different sides of the boundary.

---

# Selector vs Reducer

A selector reads state and returns derived data. A reducer accepts an action and returns new state. Same store, opposite directions.

---

# Store vs State

The store is the container you keep. State is the value it replaces. Storing derived data in the store duplicates the truth; computing it with a selector doesn't.

---

# Done means a test passes

"It works" is an opinion. "The reference check passes" is a test: same input, same reference, no extra re-render. That's done.

---

# Start free: State essentials

The State essentials plan walks eight terms—state, store, actions, reducer, selectors, middleware, AJAX, CRUD—in 315 minutes, then eight practice questions. Start free: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors
