---
title: "Atom: one job, no data"
layout: lesson
course: ui-layer
slug: atom
term: ui/atom
skill: ui-atom
practice: atom-boundaries
description: "Use the atom boundary as the first line of review: one responsibility, primitive props, design tokens, and no idea which application it lives in."
insight: "An atom does one thing, such as present a click target, capture text or show an icon, and is reused hundreds of times unchanged. Because every flaw in an atom repeats across every screen, it is where a review pays off most, and where an agent's extra cleverness costs most."
---

## The smallest unit with a contract

The term doc calls atoms the LEGO bricks of the interface. Each one is a single
piece of functionality or presentation, whether a button, an input, a label or
an icon, and nothing more. Building one establishes a contract: it does one
thing, takes specific props and behaves predictably. That predictability is what
lets the same atom work in the React, Angular, Vue and Web Components templates.

Look at `templates/chota-react-redux/src/ui/atoms/Button/Button.component.jsx`.
It copies its props, deletes `isLoading`, and if loading is true renders a
`Loader` inside the button instead of the children. Otherwise it renders
`<button {...transformedProps}>`. It does not know what the click means.

## Responsibility is the test, not composition

The `ui-atom` skill's DON'T list includes "create atoms that render other atoms
(that's a molecule)". Read literally, that would move this Button into
`molecules/`, because it renders `Loader`. The practice quiz settles it the
other way: composition is not the test, responsibility is. A Button that swaps
its label for a spinner still has one visual job in a different state. A
molecule is a Button *plus a second concern*, such as a field label and its
error text.

This matters because agents follow rules literally. If the boundary is not
clear in your prompt, expect an agent to "fix" correct code to satisfy a rule
of thumb. The quiz gives you the disqualifiers to state instead:

- **It reads from the store.** Store access ties a component to one
  application; an atom gets data as props and reports through events.
- **It fetches or holds business logic.** The doc's first Common Mistake is a
  `Button` that takes a `userId` and calls `fetch` on click. The fix keeps
  `loading` as a prop and moves the request to a
  [container]({{ '/server/container.html' | relative_url }}).
- **It branches on a `theme` prop.** Two teams wanting different hover colours
  change the design tokens the atom's stylesheet reads. They do not fork the
  atom or add a switch inside it.

## Brief an atom

```text
Create an atom in src/ui/atoms/IconButton.
Single responsibility: an icon-only click target.
Props: icon, ariaLabel (required), onClick, isDisabled = false.
No store, no fetch, no business logic. Colours and spacing from theme tokens.
Render a native <button type="button">; the icon is aria-hidden.
```

Then hold the output to the skill's quality gates: single responsibility, props
that are primitives or callbacks, no data fetching, accessibility attributes
present, and tokens rather than hard-coded colours. The doc's third mistake,
an `IconButton` built from a `<div onClick>`, fails the accessibility gate on
every screen that uses it. A `div` cannot be reached with Tab and is not
announced as a button, and the atom repeats that bug in every instance.

The [Atomic Design]({{ '/ui/atomic-design.html' | relative_url }}) page shows
where atoms sit in the hierarchy. The next lesson is the first level up.
