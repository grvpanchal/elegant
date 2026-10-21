---
channel: facebook
date: 2026-10-31
format: carousel
claim: A shared createSelector keeps one cache slot, so five sibling rows calling it with five ids miss every time — five recomputes per render; a selector factory gives each row its own slot and takes it to zero after the first render.
source: .benzene/material/marketing/articles/selector-factories-stop-cache-thrashing.md; skills/state-selectors/SKILL.md; render counts measured with a recompute counter in the article's script
campaign: selector-factory
slides: .benzene/material/marketing/slides/selector-factory.md
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=facebook&utm_medium=social&utm_campaign=selector-factory
---

A shared `createSelector` remembers only the last arguments it saw. Five TodoRow components calling it with five ids means every call misses — five recomputes per render pass, again and again. Zero percent hit rate, measured with a counter, not assumed.

The fix is one selector per row: `useMemo(makeSelectTodoById, [])` creates each instance once, so each row's cache slot holds its own id and nothing evicts a sibling. First render still costs five misses; the second costs zero.

This week's term on Elegant is the selector. The practice question has you write `createSelector` yourself with a `recomputations()` counter and run its tests in the browser. Free, no sign-up.

https://elegantfrontend.training/practice/memoized-selector.html?utm_source=facebook&utm_medium=social&utm_campaign=selector-factory

If you've used a memoized selector in a list, what hit rate did you see on the second render?