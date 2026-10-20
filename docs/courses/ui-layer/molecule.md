---
title: "Molecule: atoms with one purpose"
layout: lesson
course: ui-layer
slug: molecule
term: ui/molecule
skill: ui-molecule
practice: form-field-molecule
description: "A molecule composes atoms into one pattern, such as a form field or search bar, and orchestrates them without fetching, storing or deciding anything."
insight: "Molecules compose atoms into a functional pattern with a single purpose. A form field is a label, an input and an error message. A search bar is an input, a button and an icon. They orchestrate and never originate: data arrives as props and intent leaves as callbacks, so the same molecule works on any page that needs the pattern."
---

## The first level of composition

The term doc places molecules at the point where atoms stop being parts and
become something a user recognises. A Button atom is useful. A search bar that
combines an Input, a Button and an Icon is a complete, reusable interface. A
well-designed molecule "doesn't know about the broader application state or
business logic". It accepts props, lays out its atoms, and reports
interactions back through callbacks.

The templates' example is
`templates/chota-react-redux/src/ui/molecules/AddTodoForm/AddTodoForm.component.jsx`.
It imports the `Input` and `Button` atoms, keeps the text being typed in local
state, ignores a blank submission, and calls either `onTodoAdd` or
`onTodoUpdate` depending on whether it was given a `todoValue`. It never
dispatches. The `TodoList` organism above it passes those callbacks down from
the container.

## Orchestrate, don't originate

The `ui-molecule` skill states the three principles agents most often break.
**Composition over creation**: import the atoms instead of rebuilding a styled
`<input>` inside the molecule. **Single cohesive purpose**: if it does two
distinct things, it is probably an [organism]({{ '/ui/organism.html' | relative_url }}).
**Props passthrough**: the molecule hands its atoms the props they need.

The doc's Common Mistakes are the review list:

1. **Too complex.** A `UserProfileCard` that takes a `userId`, fetches the user
   and computes a score and a badge. The fix passes `user`, `score` and `badge`
   in as props and lets a `UserProfileContainer` do the work.
2. **Not reusable.** A `ProductSearchBar` that hardcodes "Search Products" and
   sets `window.location.href` itself. The reusable `SearchBar` takes `value`,
   `onChange`, `onSearch`, and a `placeholder` with a default.
3. **Inconsistent composition.** One form field built from a plain `<span>`
   and a native `<input>`, another from the Label and Input atoms, so the same
   pattern looks and behaves differently on two pages.

## Wiring is the job

What a molecule adds over its atoms is the relationship between them, and for a
form field that relationship is accessibility. Look at the Input atom that
`AddTodoForm` uses. It renders a screen-reader-only `<label>` reading
`props.name || "Some Label"`, and when no `id` is passed it generates one with
`Math.random()`, which produces a new id on every render. `AddTodoForm` passes
a `placeholder` but no `name`, so the field is announced as "Some Label". A
check that only asks "does every input have a label?" passes it.

The practice question asks for what the wiring should be. Its `FormField`
molecule generates ids that cannot collide, associates the label with the
control, lists both the hint and the error in `aria-describedby` (a
space-separated list, so neither replaces the other), and marks an invalid
control with `aria-invalid` rather than only colouring it red.

## Brief a molecule

```text
Create a FormField molecule from our library's Label and Input atoms.
Props: label, hint, error, required = false, children (the control).
No store, no fetch. Generate stable ids; hint and error both go in
aria-describedby; required is stated in text, not only with an asterisk.
```

Then check that it imports atoms rather than recreating them, has one purpose,
has no state-management imports, and that every relationship between its atoms
can be seen in the rendered markup.
