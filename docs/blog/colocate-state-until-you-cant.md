---
title: "Colocate state until you can't"
slug: colocate-state-until-you-cant
layout: post
date: 2026-08-25
author: The Elegant team
category: terminology
tags: [state, architecture, react, components]
description: The right home for a piece of state is the smallest scope that needs it. Lifting everything to a global store by default is how a simple app grows a state-management problem it never needed.
cover: /assets/img/state-system-diagram.png
reading_minutes: 5
related_practice: [counter-component, query-string-state]
---

The right home for a piece of state is the **smallest scope that needs it**.
Colocation means keeping state as close as possible to where it is used — in the
component that owns it — and only lifting it higher when something higher genuinely
needs it. The common anti-pattern is the opposite: reaching for a global store by
default, so a modal's open flag, a form's draft, and a hover state all end up in
Redux "to be safe." That is how a simple app grows a state-management problem it
never had. Global state is not the responsible default; it is the tool you escalate
to when colocation stops working, and knowing *when* it stops is the whole skill.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 200" role="img" aria-labelledby="cl2-t cl2-d" class="blog-figure__svg">
  <title id="cl2-t">Escalate state scope only as far as sharing requires</title>
  <desc id="cl2-d">A ladder of scopes: local component state, lifted to a common parent, the URL, and finally a global store — each step taken only when the previous can no longer reach all the consumers.</desc>
  <g font-size="9" text-anchor="middle">
    <rect x="30" y="130" width="130" height="40" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="95" y="150" fill="#157878">local (useState)</text><text x="95" y="164" fill="#819198">one component</text>
    <rect x="180" y="100" width="130" height="40" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="245" y="120" fill="#157878">lifted to parent</text><text x="245" y="134" fill="#819198">a few siblings</text>
    <rect x="330" y="70" width="130" height="40" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="395" y="90" fill="#155799">URL</text><text x="395" y="104" fill="#819198">shareable view</text>
    <rect x="480" y="40" width="130" height="40" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="545" y="60" fill="#c2571a">global store</text><text x="545" y="74" fill="#819198">many, far apart</text>
  </g>
  <g stroke="#819198" stroke-width="2" marker-end="url(#cl2-a)"><path d="M160 145 L178 128"/><path d="M310 115 L328 98"/><path d="M460 85 L478 68"/></g>
  <text x="320" y="188" text-anchor="middle" fill="#819198" font-size="9">only climb a rung when the current one can't reach all consumers</text>
  <defs><marker id="cl2-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Start at the bottom rung and climb only when forced: local, then lifted, then the URL, then a global store. Each step costs indirection, so earn it.</figcaption>
</figure>

## Start local

If one component uses a piece of state, it lives in that component. A search box's
query, a disclosure's open flag, a hovered index — none of these need to exist
anywhere but where they are used:

```jsx
function Disclosure({ children }) {
  const [open, setOpen] = useState(false);   // nobody else needs this — keep it here
  return (
    <>
      <button onClick={() => setOpen((o) => !o)}>Toggle</button>
      {open && <div>{children}</div>}
    </>
  );
}
```

This is not laziness; it is correctness. State this local has the smallest possible
blast radius — you can read the component and know everything that can change it.

## Lift only when a sibling needs it

When a *second* component needs the same state, lift it to their nearest common
parent — no further. Two inputs that must stay in sync share a parent's state; they
do not need a global store:

```jsx
function RangeFilter() {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);   // shared by exactly two children, lifted one level
  return (
    <>
      <NumberInput value={min} onChange={setMin} />
      <NumberInput value={max} onChange={setMax} />
      <Results min={min} max={max} />
    </>
  );
}
```

"Lift to the nearest common ancestor" is the rule — lifting higher than necessary
just widens the blast radius again.

## Escalate to a store only when colocation breaks

Global state earns its place when a piece of state is needed by **many components,
far apart in the tree**, and passing it as props would mean threading it through a
dozen layers that do not care ("prop drilling"). A logged-in user, a theme, a cart
touched from the header and three pages — those genuinely belong in a store or
context. But notice the two rungs people skip on the way up: the URL is the right
home for shareable view state (filters, tabs), and server data belongs in a query
cache, not the store. Colocation is the default because local state is the easiest
to understand, test, and delete; global state is the exception you escalate to when
sharing demands it. Reach for it deliberately — "many consumers, far apart, and the
URL isn't the answer" — not reflexively. The counter-component exercise starts state
at the local rung, and query-string-state is the URL rung, which together cover most
of what people wrongly send straight to a global store.
