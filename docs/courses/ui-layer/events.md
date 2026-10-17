---
title: "Events: the contract coming out"
layout: lesson
course: ui-layer
slug: events
term: ui/events
skill: ui-events
practice: event-delegation
description: "Name what a component reports, where its listener lives and what the browser does by default: the three event decisions agents leave implicit."
insight: "Events are how the browser, and your components, say that something happened, and they travel: capturing down, the target, bubbling up. Knowing propagation, delegation and preventDefault is what lets you tell an agent where a listener belongs instead of accepting one on every row."
---

## One idea, four spellings

Props are the half of the contract that goes in. Events are the half that comes
out. The term doc shows the same Button atom reporting a click in every
template. React passes `onClick` as a prop. Angular declares
`@Output() onClick = new EventEmitter<Event>()` in
`templates/chota-angular-ngrx/src/ui/atoms/Button/Button.component.ts`. Vue calls
`$emit('onClick')` in `templates/chota-vue-pinia/src/ui/atoms/Button/Button.component.vue`.
The Web Components template dispatches a `CustomEvent` with `bubbles: true` through
`templates/chota-wc-saga/src/utils/events/emit.js`. Four conduits, one model:
the component reports what happened, and the parent decides what it means.

The React `TodoList` organism makes the split visible. It destructures five
callbacks from its `events` prop (`onTodoCreate`, `onTodoEdit`, `onTodoUpdate`,
`onTodoToggleUpdate`, `onTodoDelete`) and never dispatches anything itself. Ask
an agent for the event names as part of the interface, or you will get a
component that reaches for the store to do the parent's job.

## Where the listener lives

An event moves in three phases: capturing from the window down to the target,
the target itself, then bubbling back up. Bubbling is what makes
**delegation** work. You attach one listener to a stable ancestor and resolve
the source with `event.target.closest(...)`, as the `ui-events` skill shows. The
doc's second Common Mistake is the alternative agents write by default: a
`querySelectorAll('.item')` loop adding a thousand listeners. Delegation also
covers rows added later, because the listener sits on the container rather than
on rows that did not exist yet.

The practice quiz makes the placement precise. For a list of a thousand rows,
the listener belongs on the `<ul>` or `<table>`, the nearest common ancestor,
not on `document` or `window`. Delegation does not cancel the browser's default
action; that is a separate call.

## Defaults and cleanup

`preventDefault()` stops what the browser would do (follow a link, submit a
form). `stopPropagation()` stops other listeners from hearing the event. They
are not interchangeable. The doc's third mistake is a submit handler with no
`preventDefault()`, which reloads the page and throws away the single-page app.
`AddTodoForm` calls `e.preventDefault()` on its first line for that reason. The
first mistake is a listener that is never removed, so every remount adds
another. The doc's fix is a returned cleanup function, or an `AbortController`
whose `signal` removes every listener at once.

## Review checklist

- Are the component's events named in its interface, with their payloads?
- Does a list use one delegated listener rather than one per row?
- Does every `addEventListener` have a matching cleanup on unmount?
- Does each submit handler call `preventDefault()`, and is every
  `stopPropagation()` justified?
- Are scroll and touch listeners `{ passive: true }`, and does every click
  target also work with Enter and Space?
