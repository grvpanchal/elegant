---
title: Build an accessible combobox
layout: question
slug: accessible-combobox
format: ui-coding
difficulty: hard
layer: ui
topics: [accessibility, events, component, molecule]
skill: ui-accessibility
minutes: 45
frameworks: [react, vue]
summary: A typeahead that works with a keyboard and a screen reader, not just a mouse.
---

Build a combobox: a text input that filters a list of options and lets the user
pick one. It must work identically in React and Vue, and it must be usable
without a mouse.

- Typing filters the options and opens the listbox.
- `ArrowDown` / `ArrowUp` move the active option and wrap at the ends.
- `Enter` selects the active option; `Escape` closes without selecting.
- `Tab` closes the listbox and moves on, keeping whatever was typed.
- The input announces the active option to a screen reader.
- Clicking outside closes the listbox.

Starter files are in `practice/workspace/accessible-combobox/<framework>/`.

## Solution

### Approach 1: `aria-activedescendant` (roving virtual focus)

DOM focus stays on the input for the whole interaction. The input carries
`role="combobox"`, `aria-expanded`, `aria-controls` pointing at the listbox, and
`aria-activedescendant` pointing at the id of the highlighted option. Options
carry `role="option"` and `aria-selected`.

```jsx
<input
  role="combobox"
  aria-expanded={open}
  aria-controls={`${id}-listbox`}
  aria-activedescendant={open && active >= 0 ? `${id}-opt-${active}` : undefined}
  aria-autocomplete="list"
  value={query}
  onChange={onType}
  onKeyDown={onKey}
/>
<ul role="listbox" id={`${id}-listbox`} hidden={!open}>
  {matches.map((opt, i) => (
    <li key={opt.id} id={`${id}-opt-${i}`} role="option" aria-selected={i === active}>
      {opt.label}
    </li>
  ))}
</ul>
```

Because focus never leaves the input, typing keeps working while the user
arrows through the list — which is the behaviour people expect from a
typeahead, and the reason this is the pattern the ARIA authoring practices
recommend for this widget.

### Approach 2: real focus moved into the list

Arrow keys move DOM focus onto the option elements themselves, each with
`tabindex="-1"`. This is simpler to reason about — focus is where it looks like
it is — and it is what a menu wants.

It is the wrong choice here. Once focus is on an option, keystrokes no longer
reach the input, so the user cannot refine the query without arrowing back. You
end up re-implementing typing on the list, and the thing you rebuilt is the
input you already had.

## Trade-offs

Virtual focus costs you the id bookkeeping — every option needs a stable,
unique id, and `aria-activedescendant` is a string that silently does nothing
when it points at an element that is not there. That failure is invisible
without a screen reader, which is why this component needs a test that asserts
the attribute matches a rendered id.

The wrapping decision is worth making deliberately. Wrapping from the last
option to the first is friendlier for short lists and disorienting for long
ones; the common compromise is to wrap but not to scroll past the viewport.

The detail most submissions miss is `Escape`: it must close the listbox and
leave the typed text alone. Clearing the input on `Escape` destroys work the
user did on purpose and there is no undo.

## Related

- Reading: [Accessibility](../ui/accessibility.html) · [Events](../ui/events.html) · [Molecule](../ui/molecule.html)
- Agent Skill: `ui-accessibility`
