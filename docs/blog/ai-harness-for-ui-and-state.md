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
reading_minutes: 6
related_practice: [harness-state-shape, harness-atom-guardrail, harness-bundle-budget]
---

The clearest boundary in a frontend architecture is between **UI** — components
that render props and emit events — and **State** — the store, the reducers, the
selectors. A presentational atom should not know your store exists. This
separation is easy to state and easy to erode, and AI makes the erosion faster:
ask a model to "make the button show the cart count" a hundred times and some
fraction of those completions will reach straight into the store from inside the
component, because that is locally the shortest path. No single diff looks wrong.
The hundredth one has quietly deleted the boundary. The fix is not more careful
prompting; it is a **harness** that fails the build the first time a UI file
imports from the state layer.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 220" role="img" aria-labelledby="hs-t hs-d" class="blog-figure__svg">
  <title id="hs-t">A container connects UI to state; the guardrail forbids UI importing state directly</title>
  <desc id="hs-d">UI atoms receive props and emit events. A container reads the store and passes props down. An arrow straight from a UI atom into the store is crossed out and labelled build fails.</desc>
  <rect x="30" y="80" width="120" height="60" rx="8" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="90" y="106" text-anchor="middle" fill="#155799" font-size="11">UI atom</text><text x="90" y="124" text-anchor="middle" fill="#819198" font-size="9">props in, events out</text>
  <rect x="250" y="80" width="120" height="60" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="310" y="106" text-anchor="middle" fill="#157878" font-size="11">container</text><text x="310" y="124" text-anchor="middle" fill="#819198" font-size="9">reads the store</text>
  <rect x="470" y="80" width="120" height="60" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="530" y="114" text-anchor="middle" fill="#c2571a" font-size="11">store / state</text>
  <path d="M250 110 L152 110" stroke="#819198" stroke-width="2" marker-end="url(#hs-a)"/><text x="200" y="100" text-anchor="middle" fill="#819198" font-size="9">props</text>
  <path d="M370 110 L468 110" stroke="#819198" stroke-width="2" marker-end="url(#hs-a)"/>
  <path d="M110 78 C 200 20, 440 20, 528 78" fill="none" stroke="#c2571a" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#hs-x)"/>
  <text x="320" y="30" text-anchor="middle" fill="#c2571a" font-size="10" font-weight="700">UI → store: build fails ✗</text>
  <defs><marker id="hs-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker><marker id="hs-x" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#c2571a"/></marker></defs>
</svg>
<figcaption>The container is the only file allowed to touch both sides. A direct UI-to-store import is the exact thing the harness is built to reject.</figcaption>
</figure>

## Make the boundary a check, not a convention

A convention documented in a README is enforced only when a human notices it in
review. A harness enforces it on every diff. The simplest version is a lint rule
that forbids importing the state layer from anywhere under `ui/`:

```js
// eslint: no state imports from presentational UI
{
  files: ["src/ui/**/*.{js,jsx}"],
  rules: {
    "no-restricted-imports": ["error", {
      patterns: ["**/state/*", "**/store", "react-redux"],
    }],
  },
}
```

Now the hundredth completion that does `import { useSelector } from "react-redux"`
inside an atom does not merge — the build is red, with a message pointing at the
exact line. The AI can write across the boundary all it likes; it just cannot
*land* the change.

## Assert the state shape, not just the imports

Import rules catch the crude violation. A subtler one is the store's shape
drifting — a reducer growing a field that should have been derived, a slice
storing server data as if it were truth. So the harness also asserts the
*structure* of state against a spec:

```js
// harness/state-shape.test.js — the store's contract, executable
test("cart slice stores items but never a derived total", () => {
  const keys = Object.keys(store.getState().cart);
  expect(keys).toContain("items");
  expect(keys).not.toContain("total");   // total is a selector, not a field
});
```

A model that "helpfully" adds a `total` field to avoid recomputing it now trips a
named test that explains why the field does not belong.

## The harness is how the boundary survives volume

The reason this matters more in an AI-heavy workflow is throughput. A team of
humans erodes an architecture slowly enough that a periodic cleanup keeps up. A
model generates changes faster than review can absorb, so erosion that used to
take a year takes a sprint — unless the boundary is machine-checked. Encoding
your architecture as executable rules turns "please keep UI and state separate"
from a hope into an invariant that holds no matter how much code, or how fast, is
written against it. The harness-state-shape and harness-atom-guardrail exercises
build exactly these checks, which is the point where the separation stops being a
principle you defend and becomes one the build defends for you.
