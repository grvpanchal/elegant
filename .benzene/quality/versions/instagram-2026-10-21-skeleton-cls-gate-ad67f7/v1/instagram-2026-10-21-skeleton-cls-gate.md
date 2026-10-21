---
channel: instagram
date: 2026-10-21
format: carousel
claim: Reusing the real row's CSS class in a skeleton keeps layout shift at zero after a CSS edit; a PerformanceObserver script proves it instead of an eyeball check.
source: .benzene/material/marketing/articles/skeleton-cls-gate.md; skills/ui-skeleton/SKILL.md; practice question skeleton-list
campaign: skeleton-cls-gate
slides: .benzene/material/marketing/slides/skeleton-cls-gate.md
alt_text: "Five slides on the skeleton: hand-tuned skeleton heights match today but break when the row's padding changes; give the skeleton the real row's own CSS class so same class means same box and same height; PerformanceObserver reads layout-shift entries and asserts total shift is 0 from loading to loaded; the shared-class skeleton survives CSS edits while rendering the real row with empty props adds a branch that breaks on fallbacks and dates; try it free in the skeleton-list practice question."
showcase_url: https://elegantfrontend.training/practice/skeleton-list.html?utm_source=instagram&utm_medium=social&utm_campaign=skeleton-cls-gate
first_comment: "Practice question: https://elegantfrontend.training/practice/skeleton-list.html?utm_source=instagram&utm_medium=social&utm_campaign=skeleton-cls-gate"
---
A skeleton that matches the row

Most teams ship a skeleton, eyeball it once, and never check again. Six weeks later someone edits the row's padding and the page jumps on every load — nothing fails loudly.

The fix is one line: give the skeleton the real row's own CSS class. Same class, same box, same height. No second set of numbers to go stale.

Then make it a gate: PerformanceObserver reads layout-shift entries; assert total shift is 0 from loading to loaded. Twelve lines, fails the build.

This week's term on Elegant is the skeleton. The practice question walks both versions against a live list with real tests. Free, in your browser, no sign-up.

Link in bio. The full link is in the first comment.

#frontend #css #performance #webdev #javascript
