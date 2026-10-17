---
title: "App shell: cache the frame, stream the data"
layout: lesson
course: server-layer
slug: app-shell
term: server/app-shell
skill: server-app-shell
practice: harness-bundle-budget
description: "The static frame a service worker serves instantly, the data that fills it, and the size budget that keeps the frame small enough to be instant."
insight: "An app shell is the minimal HTML, CSS and JavaScript that draws the frame — navigation, layout, critical styles — cached by a service worker on the first visit, so every later load paints from cache and fetches only data. It works only while the shell stays static, versioned and small."
---

## Two layers, two cache strategies

The [App Shell doc]({{ '/server/app-shell.html' | relative_url }}) splits an
application in two. The **static shell** is the navigation, the layout grid,
the critical CSS, the framework runtime and an offline fallback. The **dynamic
content** is everything fetched from an API and rendered into that frame.

A service worker makes the split pay. On `install` it precaches the shell under
a versioned cache name (`app-shell-v1`) and then serves those files cache-first.
The next deploy installs `app-shell-v2` and deletes the old cache on activation,
which is how an update reaches users without stale assets. Each resource type
gets its own strategy: shell assets cache-first with versioned URLs, API data
network-first with the cache as fallback, third-party scripts network-only.

The templates give you the pieces of a frame — the React template has a
`Layout` template under `src/ui/templates` and skeletons under
`src/ui/skeletons` — but none of them registers a service worker;
`templates/chota-wc-saga/src/sw.js` is an empty file. A cached shell is work you
specify, not a default you inherit.

## What an agent gets wrong

The skill's DON'T list reads like a review of a first attempt:

- personalised content baked into the shell — the shell is cached; content is
  what gets fetched per user
- API responses cached alongside the shell, under the shell's strategy
- no offline fallback page
- render blocked on resources that are not critical

The doc adds three more: shell assets that are not cached aggressively (the
whole benefit), a hydration mismatch when the shell is server-rendered, and
every micro-frontend loaded up front when the first route needs one.

## Budget the shell

"Instant" is a size claim, so give it a number. The practice question builds the
check: a `performance-budget.json` declaring a gzipped ceiling per entry point
and a smaller one for the **critical path** — the shell plus the first route.
Measure gzipped transfer size, not the file on disk. When the check fails, it
must name what grew (`+38kb: moment@2.30 (locales)`), because a total with no
cause gets answered by raising the budget. Raising it means editing the budget
file in the same pull request, so the increase is reviewed alongside the feature
that needed it. Start from today's number plus a small margin; a budget copied
from a Lighthouse recommendation is red on day one and gets bypassed.

## Brief it, then review it

```text
Register a service worker that precaches the shell (index.html, the
hashed app bundle, critical CSS) under a versioned cache name and
serves it cache-first. Fetch /api/* network-first with a cache
fallback. Show the skeleton until data arrives. Add an offline page.
```

1. The shell is cached under a versioned name, and old caches are deleted on
   activate.
2. Nothing user-specific is in the shell.
3. Skeletons show while content loads, and an offline fallback exists.
4. The critical path sits under a declared, gzipped budget.
