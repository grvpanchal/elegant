---
title: "Component: the unit you ask an agent for"
layout: lesson
course: ui-layer
slug: component
term: ui/component
skill: ui-component
practice: counter-component
description: "Brief an agent in components, not screens: one job, a declared interface, nothing reaching past the boundary, and a review you can run against it."
insight: "A component encapsulates structure, styling and behaviour behind one name and talks to the outside world only through props in and events out. Brief an agent in components rather than pages and every piece it returns can be tested, and rejected, on its own."
---

## What the word buys you

The term doc defines a component as an interactive unit of UI that binds HTML,
CSS and JavaScript behind a single name, with a clean interface to the outside
world through props or attributes. That last clause is the part that matters
once something else writes the code. "Build the dashboard" invites one file
that fetches, decides and renders. "Build a `UserProfile` component that
receives `user` and emits `onEdit`" invites something you can test without the
rest of the app.

The templates show the shape. `templates/chota-react-redux/src/containers/TodoListContainer.jsx`
reads the store with `useSelector`, wraps five `dispatch` calls in an `events`
object, and renders `<TodoList todoData={todoData} events={events} />`. The
`TodoList` organism imports no store at all: data arrives as a prop, intent
leaves as a callback. Every `chota-*` template has the same `src/containers`
folder doing the same job, which is why the doc can show one `Alert` component
written four ways.

## The three ways agents get it wrong

The doc's Common Mistakes double as a review checklist, because they are what a
fast generator produces when the prompt describes a screen instead of a part:

1. **The god component.** A `UserDashboard` whose `useEffect` handles auth,
   fetching and settings above hundreds of lines of JSX.
2. **Prop drilling.** `user` and `theme` passed through `Layout`, `Sidebar` and
   `Menu`, none of which read them. The doc's fix is Context, the
   [Container]({{ '/server/container.html' | relative_url }}) pattern or a
   store, not more props.
3. **Mixed concerns.** A `ProductList` that calls `fetch('/api/products')`,
   filters by `inStock` and sorts by priority inside its effect. The fix is a
   `ProductListContainer` that computes and a `ProductList` that only maps
   `products` to cards.

## Brief and review with the term

The `ui-component` skill turns this into rules an agent can follow: keep each
component to one purpose, accept configuration through props, emit events for
parent communication, colocate styles, and never reach outside the component
boundary for data. Put that vocabulary in the prompt:

```text
Build a presentational component named Counter.
Props in: start, step, min, max, each with a default.
No store imports, no fetch, styles colocated.
Testable in isolation: two Counters on one page keep separate state.
```

Then review what comes back against the skill's quality gates:

- Does it do one thing, or did a second concern sneak in?
- Is the props interface written down, defaults included?
- Does anything leave the component except through an event?
- Are the styles scoped, and does it work from a keyboard?
- Could you render it in a test with no store and no network?

The last line of that brief is the practice question below. Its tests render
your `Counter` into a live DOM, so "isolated" stops being an opinion and becomes
a check that passes or fails. The next two lessons take the interface apart:
[props]({{ '/ui/props.html' | relative_url }}) going in, and
[events]({{ '/ui/events.html' | relative_url }}) coming out.
