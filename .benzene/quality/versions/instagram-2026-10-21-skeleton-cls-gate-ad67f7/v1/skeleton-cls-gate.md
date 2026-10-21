# Skeleton that matches the row

A skeleton that borrows its row's own CSS class keeps layout shift at zero after any CSS change.

---

# The failure mode

Hand-tuned skeleton heights match today. Change the row's padding six weeks later, and the page jumps on every load. Nothing fails loudly.

---

# The fix

Give the skeleton the real row's CSS class. Same class, same box, same height — no second set of numbers to go stale.

```jsx
<li className="user-card user-card--skeleton" aria-hidden="true">
```

---

# Prove it, not eyeball it

PerformanceObserver reads `layout-shift` entries. Assert total shift is 0 from loading to loaded. Twelve lines, fails the build.

---

# Why it's the only version that survives

Rendering the real row with empty props adds a branch that breaks on fallbacks and dates. The shared-class skeleton is just the row's own box, empty.

---

# Try it free

Practice question: Replace a spinner with a skeleton. Runs in your browser, no sign-up.

elegantfrontend.training/practice/skeleton-list.html
