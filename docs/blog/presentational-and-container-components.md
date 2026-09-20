---
title: "Presentational and container components: the split that keeps testing sane"
layout: post
slug: presentational-and-container-components
date: 2026-07-28
author: The Elegant team
category: architecture
tags: [ui, architecture, components, testing]
description: 'Split components by whether they render or whether they fetch and decide. The presentational half takes props and stays dumb; the container half talks to the outside. That one boundary is what makes both halves testable and reusable.'
cover: /assets/img/ui-server-state.png
reading_minutes: 6
related_practice: [presentational-vs-container, loading-button-atom, form-field-molecule]
---

The single most useful split in a component tree is by *responsibility*: does this
component **render**, or does it **fetch and decide**? A presentational component
takes props and produces markup — it is "dumb" on purpose. A container component
talks to the outside world — the store, an API, the router — figures out what the
presentational component needs, and hands it down as props. Draw that one line and
both halves get dramatically easier to test and reuse: the presentational half has
no dependencies to mock, and the container half has no markup to assert against.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 200" role="img" aria-labelledby="pc-t pc-d" class="blog-figure__svg">
  <title id="pc-t">A container fetches and decides, then passes props to a presentational component</title>
  <desc id="pc-d">A container connects to the store and API on the left, and passes data and callbacks as props to a presentational component on the right, which only renders.</desc>
  <rect x="40" y="70" width="150" height="70" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="115" y="100" text-anchor="middle" fill="#157878" font-size="11">container</text><text x="115" y="118" text-anchor="middle" fill="#819198" font-size="9">store, API, decisions</text>
  <path d="M190 105 L300 105" stroke="#819198" stroke-width="2" marker-end="url(#pc-a)"/><text x="245" y="95" text-anchor="middle" fill="#819198" font-size="9">props + callbacks</text>
  <rect x="300" y="70" width="160" height="70" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="380" y="100" text-anchor="middle" fill="#c2571a" font-size="11">presentational</text><text x="380" y="118" text-anchor="middle" fill="#819198" font-size="9">renders, emits events</text>
  <path d="M380 140 C 380 175, 190 175, 150 142" fill="none" stroke="#157878" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#pc-a)"/><text x="270" y="172" text-anchor="middle" fill="#157878" font-size="9">events bubble up</text>
  <rect x="500" y="80" width="100" height="50" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="550" y="102" text-anchor="middle" fill="#155799" font-size="10">store /</text><text x="550" y="118" text-anchor="middle" fill="#155799" font-size="10">API</text>
  <path d="M115 70 C 200 20, 470 20, 550 78" fill="none" stroke="#819198" stroke-width="1.5" stroke-dasharray="3 3"/>
  <defs><marker id="pc-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Data flows down as props; events flow up as callbacks. Only the container touches the store and API — the presentational component is sealed off from both.</figcaption>
</figure>

## The presentational half takes props and stays dumb

A presentational component receives everything it needs and reports what happened
via callbacks. It does not know where the data came from or where the events go:

```jsx
// presentational: no store, no fetch, no idea what "save" does — just renders
function UserCard({ name, email, isSaving, onSave }) {
  return (
    <article className="card">
      <h3>{name}</h3><p>{email}</p>
      <Button disabled={isSaving} onClick={onSave}>
        {isSaving ? "Saving…" : "Save"}
      </Button>
    </article>
  );
}
```

Testing this is trivial: pass props, assert on output, click the button, assert
`onSave` fired. No store to set up, no network to mock.

## The container half wires it to the world

The container holds the messy part — reading the store, dispatching, fetching —
and translates it into the simple props the presentational component wants:

```jsx
// container: all the coupling lives here, and it renders no markup of its own
function UserCardContainer({ id }) {
  const user = useSelector((s) => s.users.byId[id]);
  const isSaving = useSelector((s) => s.users.savingId === id);
  const dispatch = useDispatch();
  return (
    <UserCard {...user} isSaving={isSaving}
      onSave={() => dispatch(saveUser(id))} />
  );
}
```

Now the coupling is concentrated in one small, markup-free file, and it is the
only thing you mock the store for.

## The boundary is what buys reuse and Storybook

This split is why a component library can exist at all: presentational components
have no app-specific dependencies, so they render in isolation in Storybook, work
in a second app, and are safe to reuse. It is also the practical form of the
UI/State boundary — the container *is* the seam where state meets UI. You do not
need a container for every presentational component (many are composed directly by
a parent that already has the data), but every fetch, every `useSelector`, every
dispatch should live *at or above* a container line, never inside a dumb renderer.
Keep the decision of "where does data enter?" separate from "how does it look?"
and both questions get simpler. The presentational-vs-container exercise makes you
perform exactly this refactor — pull the fetch out of a component and into a
container — which is the clearest way to feel why the boundary pays off.
