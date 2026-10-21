---
channel: x
date: 2026-10-29
format: thread
claim: A skeleton that reuses the real row's CSS class keeps its height in step with the row, and a PerformanceObserver on layout-shift turns "it lines up" into an assertion.
source: "docs/practice/skeleton-list.md (Approach 1); .benzene/material/marketing/articles/skeleton-cls-gate.md (cls-gate.js); skills/ui-skeleton/SKILL.md"
campaign: skeleton-cls-gate
showcase_url: https://elegantfrontend.training/practice/skeleton-list.html?utm_source=x&utm_medium=social&utm_campaign=skeleton-cls-gate
---
A skeleton with its own hand-tuned height, .skeleton--title { height: 20px }, is right on the day you write it.

Then someone changes the row's padding. The skeleton doesn't move with it, and the list jumps on every load. Nothing fails.

---

Stop tuning heights. Give the placeholder the real row's own class:

<li className="user-card user-card--skeleton" aria-hidden="true">

Same class, same CSS, same height. A padding change moves both.

---

Then assert it instead of eyeballing it: observe "layout-shift" (buffered) while the data loads, add up the entries that had no recent input, and expect the total toBe(0).

Build the skeleton list yourself, free: https://elegantfrontend.training/practice/skeleton-list.html?utm_source=x&utm_medium=social&utm_campaign=skeleton-cls-gate
