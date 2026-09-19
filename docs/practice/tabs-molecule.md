---
title: Build a tabs molecule the arrow keys drive
layout: question
slug: tabs-molecule
format: ui-coding
difficulty: medium
layer: ui
topics: [molecule, events, accessibility]
skill: ui-molecule
minutes: 35
frameworks: [vue, angular]
summary: Roving tabindex, arrow-key navigation and one tab stop — the pattern that separates a tab list from a row of buttons.
---

Build a tabs molecule.

- `Tab` moves into the tab list once, onto the **selected** tab, and out again —
  the whole list is one tab stop.
- `ArrowLeft` / `ArrowRight` move between tabs and wrap.
- `Home` / `End` jump to the first and last.
- The selected tab's panel is shown; the others are hidden from everyone,
  including screen readers.
- Each panel is labelled by its tab.

Starter files are in `practice/workspace/tabs-molecule/<framework>/`.

## Solution

### Approach 1: roving tabindex

Exactly one tab has `tabindex="0"` at any moment — the selected one. Every other
tab has `tabindex="-1"`, which keeps it focusable programmatically and invisible
to Tab.

```html
<div role="tablist" aria-label="Account settings">
  <button role="tab" id="tab-profile" aria-controls="panel-profile"
          aria-selected="true"  tabindex="0">Profile</button>
  <button role="tab" id="tab-billing" aria-controls="panel-billing"
          aria-selected="false" tabindex="-1">Billing</button>
</div>
<div role="tabpanel" id="panel-profile" aria-labelledby="tab-profile" tabindex="0">…</div>
<div role="tabpanel" id="panel-billing" aria-labelledby="tab-billing" hidden>…</div>
```

Arrow keys move selection and call `.focus()` on the new tab. This is the whole
pattern: the arrow keys own movement *inside* the widget, Tab owns movement
*between* widgets.

### Approach 2: manual activation

Above, arrowing selects. The alternative moves focus without selecting, and
`Enter` or `Space` activates:

```
ArrowRight -> focus moves, aria-selected unchanged
Enter/Space -> the focused tab becomes selected
```

Automatic activation is fewer keystrokes and is right when panels are cheap.
Manual activation is right when switching a panel costs a fetch or a heavy
render — otherwise a keyboard user arrowing from the first tab to the fourth
triggers three loads they did not want. Pick one deliberately and say which in
the component's docs; the ARIA authoring practices describe both.

## Trade-offs

**`hidden` vs unmounting the panel.** `hidden` preserves scroll position, form
state and focus history, and keeps the DOM large. Unmounting frees memory and
throws away everything the user had typed. For a settings dialog, `hidden`;
for a tab holding a 5,000-row table, unmount and accept the state loss — or
lift the state out.

**Never use `display: none` in CSS to hide a panel while leaving it in the
accessibility tree.** The `hidden` attribute does both; a class that only sets
`display` on some browsers has left screen-reader users reading three panels at
once.

**The panel needs `tabindex="0"`** when it has no focusable content, or Tab from
the tab list lands past the panel entirely and the user never reaches the
content they just selected.

**Arrow keys and RTL.** In a right-to-left document `ArrowRight` should move to
the *previous* tab. Reading direction from the computed style is three lines and
is the kind of thing that never gets added later.

## Related

- Reading: [Molecule](../ui/molecule.html) · [Events](../ui/events.html) · [Accessibility](../ui/accessibility.html)
- Agent Skill: `ui-molecule`
