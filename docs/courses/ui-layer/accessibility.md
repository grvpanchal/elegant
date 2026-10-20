---
title: "Accessibility: the requirement agents skip"
layout: lesson
course: ui-layer
slug: accessibility
term: ui/accessibility
skill: ui-accessibility
practice: accessible-combobox
description: "Semantic HTML first, ARIA only where HTML runs out, and a keyboard path through every control. Specify it up front, because the demo works without it."
insight: "Accessibility is architecture, not an add-on. A real button gives you keyboard support, focus and a screen-reader role for free. ARIA adds meaning but no behaviour, and most bugs come from three habits: a div where an element belongs, a missing label, and forgetting keyboard users exist."
---

## Why the demo always passes

A generated component is usually judged by clicking it. Every accessibility
failure survives that test. A `<div onClick>` responds to a mouse exactly like
a `<button>`, and an unlabelled input looks the same as a labelled one. The
term doc's framing is the one to give an agent: use semantic HTML first. A
`<button>` brings keyboard navigation, focus management and a screen-reader
role with no extra code. ARIA supplements HTML rather than replacing it.
`role="button"` tells assistive technology what a `div` claims to be, but you
still have to write the keyboard handlers yourself.

The doc's three Common Mistakes are the habits to check for in every diff:
`<div>` or `<span>` used as interactive elements, images with no alt text or
meaningless alt text, and custom controls with no accessible name. The POUR
principles, Perceivable, Operable, Understandable and Robust, are the full
list. Those three mistakes are most of what you will actually find.

## Presence is not meaning

The templates follow the doc's two baseline patterns: native `<button>`
elements for controls, and a screen-reader-only `<label>` paired with every
input. The React version is
`templates/chota-react-redux/src/ui/atoms/Input/Input.component.jsx`, and the
Angular one is `templates/chota-angular-ngrx/src/ui/atoms/Input/Input.component.html`.
But the label's text is `props.name || "Some Label"`, and the todo form passes
no `name`, so a screen reader announces the field as "Some Label". An automated
rule that asks "does this input have a label?" passes it. That is the general
lesson for reviewing agent output: a check for an attribute's presence is not a
check of what it says.

## The widget that tests everything

The practice question, an accessible combobox, is where these rules combine.
DOM focus stays on the input the whole time. The input carries
`role="combobox"`, `aria-expanded`, `aria-controls` and `aria-activedescendant`
pointing at the highlighted option's id, and the options carry `role="option"`
and `aria-selected`. Arrow keys move and wrap, Enter selects, Tab closes and
keeps the typed text, and Escape closes without clearing it. The question
calls out two traps. An `aria-activedescendant` that points at an id that is
not rendered silently does nothing. Clearing the input on Escape destroys work
the user did on purpose.

## Brief and review

```text
Use native elements for every control; ARIA only where no element exists.
Every control is reachable and operable by keyboard (Tab, Enter, Space, arrows)
and has a visible focus indicator. Every input has a label whose text describes
it. Icon-only buttons get aria-label. Colour never carries meaning alone.
```

Then go through the `ui-accessibility` quality gates by hand, once, without a
mouse:

- No div or span soup in interactive positions.
- Every image has an appropriate alt, empty for decorative ones.
- The whole flow works from the keyboard, with focus always visible.
- Text contrast meets WCAG AA at 4.5:1.
- ARIA appears only where semantic HTML could not do the job, and every id it
  references exists.

This closes the course's argument: [atoms]({{ '/ui/atom.html' | relative_url }})
repeat their accessibility bugs in every instance, so this is the review that
pays off most.
