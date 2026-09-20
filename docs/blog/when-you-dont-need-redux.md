---
title: "When you don't need Redux"
layout: post
slug: when-you-dont-need-redux
date: 2026-08-24
author: The Elegant team
category: terminology
tags: [state, redux, architecture, react]
description: Redux is a tool for a specific problem — a lot of client state, changed from many places, that many parts of the app must read. If that is not your problem, Redux is overhead you will resent.
cover: /assets/img/state-system-diagram.png
reading_minutes: 5
related_practice: [simple-store, counter-component]
---

Redux solves a specific problem: a lot of **client** state, changed from **many**
places, that **many** parts of the app must read. When that is your problem,
Redux's ceremony — actions, reducers, a store, selectors — is worth it, because
the alternative is worse. But teams reach for it reflexively, on apps that have
none of those three properties, and then resent the boilerplate. The honest
question is not "should I use Redux?" but "do I actually have the problem Redux
solves?" Most of the time the answer points at a smaller tool, and choosing it is
not cutting corners — it is matching the tool to the shape of the state.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 220" role="img" aria-labelledby="nr-t nr-d" class="blog-figure__svg">
  <title id="nr-t">A decision tree from the kind of state to the right tool</title>
  <desc id="nr-d">Is it server data? use a query cache. Is it local to one component? use useState. Is it shared but rarely changing? use context. Is it a lot of client state changed from many places? use Redux.</desc>
  <rect x="230" y="20" width="180" height="34" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="320" y="42" text-anchor="middle" fill="#157878" font-size="11">what kind of state?</text>
  <g font-size="10" text-anchor="middle">
    <rect x="20" y="100" width="130" height="46" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="85" y="120" fill="#155799">server data</text><text x="85" y="136" fill="#819198">→ query cache</text>
    <rect x="170" y="100" width="130" height="46" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="235" y="120" fill="#155799">one component</text><text x="235" y="136" fill="#819198">→ useState</text>
    <rect x="320" y="100" width="140" height="46" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="390" y="120" fill="#155799">shared, rarely changes</text><text x="390" y="136" fill="#819198">→ context</text>
    <rect x="480" y="100" width="140" height="46" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="550" y="120" fill="#c2571a">lots, many writers</text><text x="550" y="136" fill="#c2571a">→ Redux</text>
  </g>
  <g stroke="#819198" stroke-width="2" marker-end="url(#nr-a)"><path d="M290 54 L110 98"/><path d="M305 54 L245 98"/><path d="M335 54 L385 98"/><path d="M350 54 L540 98"/></g>
  <defs><marker id="nr-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Sort the state by its kind first. Only the bottom-right branch — a lot of client state with many writers — is the one Redux was built for.</figcaption>
</figure>

## Local state stays local

If a piece of state is used by one component and its children, it belongs in that
component. Reaching for a global store to hold a modal's open/closed flag or a
form's draft value just adds indirection for something `useState` handles in a
line:

```jsx
function SearchBox() {
  const [query, setQuery] = useState("");   // nobody else needs this — keep it here
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

Colocate first; lift state up only when a *second* component genuinely needs it.

## Server data is not client state

The biggest category people wrongly put in Redux is data that lives on the server.
Cached remote data has needs a store does not give you for free — caching,
revalidation, deduping, background refetch — and hand-rolling those in reducers is
a lot of code that a query library already ships:

```js
// a query cache handles loading, caching, and refetch — no reducer needed
const { data, isLoading, error } = useQuery(["user", id], () => fetchUser(id));
```

If most of your "global state" is really API responses, a query cache plus local
component state often removes the need for Redux entirely.

## Shared-but-simple has lighter tools too

For genuinely shared client state that changes *rarely* — a theme, the current
user, a locale — React Context is enough; you do not need reducers and middleware
for a value that flips occasionally. Redux earns its keep when the shared client
state is **substantial and changed from many places**: a collaborative editor's
document, a complex multi-step form's cross-cutting state, a cart touched by
dozens of actions. There the disciplined action log, the DevTools time-travel, and
the single source of truth stop being ceremony and start being the thing that
keeps a hard problem tractable. The rule of thumb: start with the smallest tool
that fits, and adopt Redux when you feel the *absence* of its structure, not
before. The simple-store exercise builds the store loop by hand so you can see
exactly what Redux gives you — and therefore when you actually need it.
