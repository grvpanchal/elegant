---
title: "The store is one source of truth, or it is not a source of truth"
layout: post
slug: the-store-is-one-source-of-truth
date: 2026-09-01
author: The Elegant team
category: terminology
tags: [state, redux, store, architecture]
description: A single source of truth is not a slogan — it is a constraint. The moment the same fact lives in two places, you own the job of keeping them in sync, and you will lose.
cover: /assets/img/state-system-diagram.png
reading_minutes: 3
related_practice: [simple-store, combine-reducers, counter-reducer]
---

"Single source of truth" gets repeated so often it stops meaning anything. It is
actually a hard constraint with a concrete payoff: every piece of state has
exactly one home, and everything else *derives* from it. Break the constraint —
store the same fact in two places — and you have signed up to keep them in sync
forever, a job software is famously bad at.

## Duplication is the bug

The classic failure: the cart total lives in the store, and also in a component's
local state "for convenience," and also in a `totalString` field someone added
for display. Now three things must change together on every cart edit, and the
first bug is the day one of them doesn't. The fix is not better syncing code —
it is deleting the duplicates. The cart items are the truth; the total is
*derived* from them with a selector, computed on read, never stored. The display
string is derived from the total. Nothing to keep in sync because nothing is
duplicated.

## Store the minimum; derive the rest

The discipline is to store the smallest set of facts from which everything else
can be computed, and compute the rest. Do not store `isEmpty` when you can derive
it from `items.length === 0`. Do not store a filtered list when you can filter
the full list on read. Do not store `fullName` when you have `first` and `last`.
Every derived value you store is a sync obligation; every derived value you
compute is free and always correct. Selectors are the tool for this, and
memoizing them keeps the computation cheap.

## The store is a single tree

The other half of "single" is structural: one store, one state tree, not a
scattering of independent stores that reference each other. `combineReducers`
lets you split that one tree into slices that different reducers own, but it is
still one tree the whole app reads from. This is what makes time-travel, a single
serialization for SSR, and one place to inspect state possible. The moment you
have two stores that must agree, you are back to the sync problem at the store
level.

Treat the store as the one place a fact is allowed to live, store only facts and
not their consequences, and derive everything else. Do that and "single source of
truth" stops being a poster on the wall and becomes the reason your state never
drifts out of agreement with itself. The simple-store exercise builds this tree
from scratch. The habit that keeps a store honest is to ask, of every field you
are tempted to add, whether it is a fact or merely a consequence of other facts —
and to admit only the facts, leaving the consequences to selectors that compute
them on read.
