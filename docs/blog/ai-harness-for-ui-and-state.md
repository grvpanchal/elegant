---
title: "An AI harness for keeping UI and State apart"
layout: post
slug: ai-harness-for-ui-and-state
date: 2026-09-17
author: The Elegant team
category: ai-and-frontend
tags: [ai, guardrails, state, architecture, harness]
description: The fastest way to lose the UI/State boundary is to let an AI write across it a hundred times. The fix is a harness that fails the build the first time a component reaches into the store.
cover: /assets/img/ui-server-state.png
reading_minutes: 5
related_practice: [harness-state-shape, harness-atom-guardrail, harness-bundle-budget]
---

The UI seam renders. The state seam decides. Everyone agrees on the boundary
until it is 5pm, the feature is due, and the quickest path is a component that
imports the store, reads three slices, and dispatches inline. One shortcut is
survivable. An AI taking that shortcut on every task it is handed is not — it
erodes the boundary faster than any review can restore it. A harness is how you
make the boundary a fact of the build instead of a matter of discipline.

## What "segregation" means concretely

Segregating UI from State means a component never touches the store directly. It
receives data as props and emits events; a container above it does the reading
and dispatching. Selectors read derived state, actions describe intent, reducers
apply it. The UI can be rendered in a test with plain props and no store at all,
and the state logic can be tested with no DOM. That mutual independence is the
asset. The moment a component imports the store, both halves of that asset are
gone.

## Why a human review cannot hold it alone

The violation is invisible in the way that matters: the code works. Tests pass,
the screen renders, the PR looks fine. A reviewer has to *notice* the import, and
noticing is exactly what erodes under deadline and volume. Multiply the volume by
an AI that ships a dozen components an hour and "a reviewer will catch it"
becomes "a reviewer will catch some of it, eventually, after it has spread."

## The harness: three checks that make the boundary executable

A harness turns the rule into a script that runs on every diff.

### 1. No store imports below the container line

A static check that scans `src/ui/**` for imports of the store, `useSelector`,
`useDispatch`, or a `defineStore` handle. Found one? Fail the build with the file
and line. The rule stops depending on anyone remembering it.

### 2. The store's shape is asserted, not assumed

A check that the store matches a declared shape — the slices that should exist,
the fields on each, the types. An AI refactor that quietly renames a slice or
nests it one level deeper breaks selectors across the app; the shape check turns
that into a single named failure instead of a scavenger hunt.

### 3. Selectors are the only read path

A check that derived data comes from selectors, not from components indexing into
raw state. This is what keeps memoisation possible and re-renders bounded — and
it is precisely the kind of thing an AI drops when it inlines "just this once."

## How it changes the way you work with a model

With the harness in place, you can let the model move fast. Hand it a scoped task
— "write the container that selects the visible todos and passes them to the
list" — and if it reaches across the seam, the build tells it so in the same
loop, before a human ever looks. The model's speed becomes safe because the
boundary is no longer guarded by attention; it is guarded by a check that never
gets tired and never ships on Friday.

## The general lesson

Segregating UI and State is only the first boundary worth encoding. Once you have
one architectural rule expressed as a failing test, the pattern generalises:
accessibility gates, bundle budgets, "no data fetch in an organism." Each is a
piece of senior judgement lifted out of one person's head and into a script that
scales to every AI-authored diff. That is what a harness is for — not to slow the
model down, but to let it run without taking your architecture with it.
