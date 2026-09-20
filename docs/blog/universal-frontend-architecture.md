---
title: "The Universal Frontend Architecture: UI, Server, and State as three seams"
layout: post
slug: universal-frontend-architecture
date: 2026-09-19
author: The Elegant team
category: architecture
tags: [architecture, ssr, state, ui, separation-of-concerns]
description: One architecture that survives a framework swap because it separates the three concerns every frontend has — rendering the UI, talking to the server, and holding state — instead of tangling them.
cover: /assets/img/fe-segregation-all.png
reading_minutes: 6
related_practice: [presentational-vs-container, render-strategy-choice, design-micro-frontends]
---

Every frontend, in every framework, does three things: it **renders a UI**, it
**talks to a server**, and it **holds state**. React, Vue, Angular, Svelte, and web
components differ in syntax, but not in this — the three concerns are universal. The
Universal Frontend Architecture is simply the decision to keep those three as
*separate seams* rather than tangling them together. Do that, and your knowledge —
and often your code's shape — survives a framework swap, because you moved the
boundaries, not the framework. Tangle them, and every concern leaks into the others,
which is the state most codebases drift into by default.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 190" role="img" aria-labelledby="uf-t uf-d" class="blog-figure__svg">
  <title id="uf-t">Three seams — UI, State, Server — connected by narrow, explicit boundaries</title>
  <desc id="uf-d">UI renders and emits events; State holds and derives; Server fetches and persists. Arrows show UI reads State via selectors, State talks to Server via effects, and Server data flows back into State.</desc>
  <rect x="30" y="70" width="150" height="60" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="105" y="96" text-anchor="middle" fill="#c2571a" font-size="11" font-weight="700">UI</text><text x="105" y="114" text-anchor="middle" fill="#819198" font-size="9">render + events</text>
  <rect x="245" y="70" width="150" height="60" rx="8" fill="#e8eefb" stroke="#155799" stroke-width="2.5"/><text x="320" y="96" text-anchor="middle" fill="#155799" font-size="11" font-weight="700">State</text><text x="320" y="114" text-anchor="middle" fill="#819198" font-size="9">hold + derive</text>
  <rect x="460" y="70" width="150" height="60" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="535" y="96" text-anchor="middle" fill="#157878" font-size="11" font-weight="700">Server</text><text x="535" y="114" text-anchor="middle" fill="#819198" font-size="9">fetch + persist</text>
  <path d="M245 90 L182 90" stroke="#819198" stroke-width="2" marker-end="url(#uf-a)"/><text x="213" y="82" text-anchor="middle" fill="#819198" font-size="8">selectors</text>
  <path d="M180 112 L243 112" stroke="#819198" stroke-width="2" marker-end="url(#uf-a)"/><text x="212" y="126" text-anchor="middle" fill="#819198" font-size="8">actions</text>
  <path d="M395 90 L458 90" stroke="#819198" stroke-width="2" marker-end="url(#uf-a)"/><text x="426" y="82" text-anchor="middle" fill="#819198" font-size="8">effects</text>
  <path d="M460 112 L397 112" stroke="#819198" stroke-width="2" marker-end="url(#uf-a)"/><text x="428" y="126" text-anchor="middle" fill="#819198" font-size="8">data</text>
  <defs><marker id="uf-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Three concerns, three seams, narrow boundaries: UI reads State via selectors and reports events via actions; State reaches the Server via effects and absorbs its data back.</figcaption>
</figure>

## Each seam has one job and a narrow interface

The **UI** layer renders from props and emits events — nothing more. It does not
fetch, and it does not know the store exists. The **State** layer holds the app's
facts, exposes them via selectors, and mutates only through actions. The **Server**
layer fetches and persists, and its results flow into State as data, never straight
into a component. The interfaces between them are deliberately narrow:

```jsx
// UI: pure, reads via props, reports via callbacks — swappable framework, same shape
function Cart({ items, total, onRemove }) {
  return <ul>{items.map((i) => <Row key={i.id} {...i} onRemove={() => onRemove(i.id)} />)}</ul>;
}
```

```js
// State ↔ Server: the effect talks to the server; data comes back as an action
const loadCart = () => async (dispatch) => {
  dispatch({ type: "CART_REQUEST" });
  dispatch({ type: "CART_SUCCESS", data: await api.getCart() });  // server data → state
};
```

The `Cart` component would work, essentially unchanged in spirit, in Vue or a web
component, because it only depends on the seam's contract.

## The boundaries are what survive change

The payoff is portability of *reasoning*. When you separate the seams, a framework
migration is a rewrite of one layer's syntax, not an archaeology dig through tangled
concerns. A rendering-strategy change (CSR to SSR) touches the Server seam and leaves
UI and State alone. A store swap touches State and leaves UI alone. The value is that
each concern can change on its own schedule, which is exactly what a tangled codebase
cannot do — there, touching the fetch means touching the component means touching the
state, all at once.

## Defend the seams, because they erode by default

Left alone, these boundaries dissolve: a component fetches "just this once," a reducer
grows a derived field, server data gets edited as if owned. Each is locally reasonable
and globally corrosive — and an AI generating code erodes them faster, since crossing
a seam is usually the shortest path. So the architecture is only real if it is
*defended*, ideally with checks: a lint rule that forbids the UI layer importing
State, a shape test on the store, a boundary the build enforces. The Universal
Frontend Architecture is not a framework or a library; it is the discipline of keeping
three unavoidable concerns as three separate seams, and the guardrails that keep them
that way. The presentational-vs-container exercise is the UI↔State seam in practice,
render-strategy-choice is the State↔Server seam, and design-micro-frontends scales the
whole shape across teams.
