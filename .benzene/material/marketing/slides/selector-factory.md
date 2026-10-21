# One cache slot, five rows, zero hits

A shared createSelector keeps one cache slot — the last args it saw. Five sibling rows calling it with five ids miss every time.

---

# The shared selector misses every call

Reselect's default memoizer compares only against the previous call's arguments. It is one slot, not a map keyed by id.

selectTodoById(state, 'a') caches 'a'. The next call, selectTodoById(state, 'b'), compares 'b' against 'a' and recomputes.

---

# Five ids, five misses, every render

Five TodoRow components, one shared selector instance, five different ids. Every call is a miss — five recomputes per render pass, and the same five again on the next render.

Zero percent hit rate, measured with a recompute counter.

---

# A factory gives each row its own slot

useMemo(makeSelectTodoById, []) creates one selector per row, once. Each instance's single cache slot belongs to one id for the component's lifetime.

Five instances, five slots, nothing evicts a sibling.

---

# First render: five misses. Second: zero.

The first render still costs five recomputes — caches must be filled. After that, each row's instance holds its own id and nothing misses.

Five calls across two renders cost five recomputes instead of ten.

---

# Build the memoizer yourself

Practice question: Memoize a derived selector. Write createSelector with a recomputations() counter and run its tests in your browser.

Free, no sign-up.

elegantfrontend.training/practice/memoized-selector.html
