---
title: "Normalize your API responses: the refactor that pays for itself"
layout: post
slug: normalize-your-api-responses
date: 2026-09-21
author: The Elegant team
category: architecture
tags: [state, store, api, refactor]
description: A nested API payload is a tax you pay on every read and every update. Flattening it into entity tables keyed by id is the one refactor that makes the rest of your state code simpler.
cover: /assets/img/diagrams/state-system-diagram.png
reading_minutes: 5
related_practice: [normalize-entities, deep-clone, memoized-selector]
---

Every app starts the same way: the API returns a deeply nested object, and you
store it exactly as it arrived. Then the first edit request comes in — "update
the author's display name" — and you discover the cost of that decision. You
cannot update one author without walking the whole tree, cloning every level
above it, and hoping you did not accidentally share a reference. This post makes
the case for flattening that payload into entity tables keyed by id, and why it
is the highest-leverage refactor in a state layer.

## What normalization actually is

Normalization means storing each kind of thing once, in a table keyed by its
id, and referencing it by that id everywhere else. A nested `post -> author ->
comments` payload becomes three maps: `posts`, `authors`, and `comments`. A post
holds `authorId` and a list of `commentIds`, not the objects themselves.

The rule of thumb: **one update touches one place.** When the author's name
changes, you update `authors[42].name` and every screen that reads it sees the
new value. With a nested tree you would have to find every copy of that author
and change them all — and miss the one you forgot.

## Why the nested shape feels fine at first

The nested shape is not lazy; it is convenient. Rendering a post is a single
read of one object, and the data is already shaped for the view. That is why the
refactor keeps getting postponed. The problem is that reads are the easy half.
Writes, deduplication, and caching all punish the nested shape, and those are
the operations that grow as the app does.

The second trap is reference sharing. When you clone a nested object to update
one leaf, a shallow copy leaves the inner objects shared between the old and new
versions. Two components can end up mutating the same author object and
corrupting each other's view. Normalized tables make this impossible by
construction: there is exactly one object per id, and you replace it wholesale
rather than mutating it.

## What you get back

Three concrete wins. First, **selectors become cheap and memoizable** — a
derived selector that joins `posts` and `authors` recomputes only when one of
its inputs changes by reference, which is exactly what a normalized store gives
you. Second, **deduplication is free**: the same author appearing in ten posts
is stored once, so you never render ten copies of the same data. Third,
**updates stop being a search**: "find every place this appears" becomes "update
this one id".

The trade-off is real: reads need a join step, and the view layer has to
assemble what the API used to hand over whole. But that assembly is a pure
function of ids, which means it is testable, memoizable, and shared — a far
better place for the complexity than scattered across every mutation.

## When to make the leap

Do it when you see the tell-tale signs: a second feature that needs the same
nested data, a bug from two copies of one entity drifting apart, or a deep-clone
utility being called in more than one place. That is the moment the convenience
of the nested shape has been outweighed by the cost of maintaining it. The
refactor is mechanical once you decide to do it — write the flattening function,
build the id-keyed tables, and point your selectors at them.

Normalization is not glamorous, but it is the refactor that makes every other
piece of your state code — selectors, memoization, updates — simpler at once.
That is why it pays for itself.