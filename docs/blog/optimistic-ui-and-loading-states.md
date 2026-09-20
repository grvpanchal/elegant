---
title: "Design your loading and empty states before your happy path"
slug: optimistic-ui-and-loading-states
layout: post
date: 2026-07-05
author: The Elegant team
category: terminology
tags: [ui, ux, states, loading]
description: 'Every data-driven component has at least four states — loading, empty, error, and loaded — and the ones that are not the happy path are where real apps feel broken. Design all four, not just the screenshot.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 4
related_practice: [toast-notifications, offline-first-list, skeleton-list]
---

A component that shows data has more than one state, and the mistake that makes real
apps feel broken is designing only the one that looks good in a screenshot — the
loaded, populated, happy-path state. In reality every data-driven view has at least
four states, and the other three are where users actually get stuck: loading,
empty, error, and loaded. Designing all four up front is the difference between a
demo and a product.

## The four states, each a real screen

**Loading**: data has not arrived. Show a skeleton that previews the shape (not a
lonely spinner) so the layout is stable and the wait feels purposeful. **Empty**:
the request succeeded but there is nothing — no results, no items yet. This is the
most-skipped state, and a blank area with no explanation reads as broken; a good
empty state says what happened and what to do ("No results — try a broader search,"
"No projects yet — create one"). **Error**: the request failed. Say so plainly and
offer a way forward (retry), not a raw stack trace. **Loaded**: the happy path. Only
one of the four, and the only one most components actually handle.

## Empty is not one state, it's several

"Empty" deserves a second look because it hides distinctions that need different
copy. "You have no items yet" (first-run) wants encouragement and a call to action.
"No results match your filters" (filtered-empty) wants a way to clear or broaden the
filters. "This list was cleared" is different again. Treating all emptiness as one
blank screen misses that the *reason* it is empty changes what the user should do
next. The first-run empty state is also your onboarding moment — the one time you
can guide a new user toward their first action.

## Transitions matter as much as states

Beyond the states themselves, the *transitions* between them are where polish lives.
Going from loading to loaded should not jump the layout — that is what the skeleton
prevents. Going from loaded to error should not blank the content the user was
reading; better to keep it and surface the error as a toast or inline banner. Going
from empty to loaded (they just created the first item) should feel like a reward.
Each transition is a small UX decision, and abrupt ones make an otherwise-fine app
feel janky.

## Handle them structurally, not ad hoc

The reliable way to cover all four is to make state explicit in your data model —
the request/success/fail triple plus an empty check — so the component renders the
matching state from a single `status` rather than a tangle of booleans that can
represent impossible combinations (loading *and* error at once). When the state is
one enum, "which of the four am I in" is a clean switch, and none of them can be
forgotten because the type demands all cases. The toast, offline-first, and
skeleton exercises each build one of these non-happy states properly, which is
exactly where they are usually neglected.
