---
title: "CSS specificity decides who wins, and it is not about order"
layout: post
slug: css-specificity-decides-who-wins
date: 2026-09-13
author: The Elegant team
category: terminology
tags: [ui, css, specificity, cascade]
description: When two rules target the same element, the more specific selector wins — regardless of which came last. Understanding the tiebreak is the difference between fixing a style and piling !important on it.
cover: /assets/img/ui-system-diagram.png
reading_minutes: 3
related_practice: [theme-toggle, loading-button-atom]
---

Every developer has been there: you write a style, it does nothing, and you add
`!important` until the page obeys. That reflex is a symptom of not reading the
cascade. CSS is not "last rule wins" — it is "most specific rule wins, and only
ties break by order." Learn the tiebreak and the `!important` habit disappears.

## How specificity is actually scored

Think of a selector's specificity as three numbers: IDs, then classes (and
attributes and pseudo-classes), then element tags. `#nav a.active` scores one
ID, one class, one element. `.active` scores one class. The ID selector wins,
even if `.active` is written later in the file. Inline styles sit above all of
these, and `!important` sits above everything — which is exactly why reaching
for it starts an arms race you cannot win cleanly.

The practical failure mode: a component ships with a class-based style, then a
page overrides it with an ID selector, and a third author "fixes" it with
`!important`. Now nobody can restyle that element without another `!important`.
The specificity kept climbing because each author treated the symptom.

## Keeping specificity flat

The fix is to keep specificity low and even across the codebase. Style with
single classes. Avoid IDs as styling hooks (keep them for anchors and
JavaScript). Don't nest selectors three levels deep when one class would do.
When every rule is roughly one class worth of specificity, the cascade collapses
back to something you *can* reason about by order — and overriding a style
becomes "add a more specific class," not "escalate to `!important`."

## Debugging a rule that "does nothing"

When a style refuses to apply, resist the `!important` reflex and open dev tools
instead. The styles panel shows every rule targeting the element, in cascade
order, with the losers struck through. The struck-through rule tells you exactly
what beat it — usually a more specific selector you forgot about, sometimes an
inline style, occasionally an existing `!important` three files away. That is the
real fix: match or reduce the winning selector's specificity, not escalate past
it. Nine times in ten the culprit is an ID used as a styling hook or a selector
nested one level too deep. Once you can read the panel, the cascade stops feeling
random and starts feeling like the deterministic scoring system it actually is —
and you stop shipping `!important` as a debugging tool.

## The layer that changes the game

Modern CSS adds `@layer`, which lets you declare the priority order of whole
groups of styles explicitly, independent of specificity. Put your reset in one
layer, your design system in another, your page overrides last, and the layer
order decides — a far saner model than counting selector parts. But even with
layers, the discipline is the same: keep individual selectors simple, and make
overriding a deliberate, declared act rather than a specificity brawl. A
stylesheet you can override predictably is one you can theme; see the theme
toggle exercise for where that pays off.
