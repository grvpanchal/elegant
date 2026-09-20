---
title: "Focus management is the keyboard user's cursor"
layout: post
slug: focus-management-is-the-keyboard-users-cursor
date: 2026-09-08
author: The Elegant team
category: terminology
tags: [ui, accessibility, focus, keyboard]
description: For a keyboard or screen-reader user, focus is the cursor. A dialog that opens without moving focus, or a menu that traps it, is as broken as a mouse that stops moving.
cover: /assets/img/ui-system-diagram.png
reading_minutes: 5
related_practice: [accessible-combobox, tabs-molecule, form-field-molecule]
---

For someone using a mouse, the pointer is where their attention is. For someone
using a keyboard or a screen reader, **focus** is that pointer — it is where they
are on the page and where their next keystroke will land. Once you internalise
"focus is the cursor," a whole category of accessibility bugs becomes obvious: a
dialog that opens but does not move focus is a cursor that did not follow the
click; a menu you cannot Tab out of is a cursor stuck in a corner; a route change
that leaves focus on the old link is a cursor teleported to nowhere. Managing focus
deliberately is not a nicety — it is keeping the cursor where the user expects it.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 200" role="img" aria-labelledby="fm-t fm-d" class="blog-figure__svg">
  <title id="fm-t">Focus moves into a dialog on open and returns to the trigger on close</title>
  <desc id="fm-d">A trigger button, then focus moving into an opened dialog's first control, then on close focus returning to the trigger. A dot traces the round trip.</desc>
  <rect x="40" y="80" width="110" height="40" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="95" y="104" text-anchor="middle" fill="#155799" font-size="10">trigger</text>
  <path d="M150 90 L250 70" stroke="#157878" stroke-width="2" marker-end="url(#fm-a)"/><text x="200" y="62" text-anchor="middle" fill="#157878" font-size="9">open → focus in</text>
  <rect x="250" y="45" width="200" height="110" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="350" y="70" text-anchor="middle" fill="#c2571a" font-size="10" font-weight="700">dialog (focus trapped)</text>
  <rect x="275" y="85" width="150" height="26" rx="4" fill="#fff" stroke="#155799" stroke-width="2"/><text x="350" y="102" text-anchor="middle" fill="#155799" font-size="9">first control (focused)</text>
  <rect x="275" y="118" width="70" height="26" rx="4" fill="#f3f6fa" stroke="#819198"/><text x="310" y="135" text-anchor="middle" fill="#819198" font-size="9">cancel</text>
  <path d="M450 130 C 540 150, 200 170, 95 122" fill="none" stroke="#157878" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#fm-a)"/><text x="330" y="188" text-anchor="middle" fill="#157878" font-size="9">close → focus returns to trigger</text>
  <defs><marker id="fm-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#157878"/></marker></defs>
  <circle r="6" fill="#157878"><animateMotion dur="4s" repeatCount="indefinite" path="M95 100 L350 98 L95 100"/></circle>
</svg>
<figcaption>Open the dialog, focus moves in and is trapped; close it, focus returns to the trigger. The cursor makes a clean round trip and never gets lost.</figcaption>
</figure>

## Move focus when the context changes

When you open something new — a dialog, a drawer, a menu — move focus into it, or
the keyboard user is left "behind" it, tabbing through the page underneath. The
same applies to a single-page-app route change: the browser normally focuses the
new document, but a client-side navigation does not, so the user's cursor stays on
the link they clicked while the whole page changes around it. Move it deliberately:

```jsx
// on route change, move focus to the new page's heading so the cursor "arrives"
useEffect(() => {
  document.getElementById("page-heading")?.focus();
}, [pathname]);
```

## Trap focus while a modal is open — then release it

While a modal is open, Tab should cycle *within* it, not escape to the page behind
(which is inert to the eye but still reachable by keyboard). Trap focus on open,
and — the half people forget — restore it to the trigger on close:

```jsx
function useFocusTrap(ref, open) {
  const opener = useRef(null);
  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;      // remember the trigger
    const focusables = ref.current.querySelectorAll("button, [href], input, [tabindex]");
    focusables[0]?.focus();                        // focus in
    return () => opener.current?.focus();          // focus back on close
  }, [open]);
}
```

A trap without the restore is its own bug: the user closes the dialog and their
cursor is nowhere.

## Never destroy focus, and keep it visible

Two failure modes finish the picture. First, do not remove or hide the focused
element without moving focus somewhere sensible first — deleting the focused row of
a list should move focus to the next row, not drop it to `<body>`, which yanks the
cursor to the top of the page. Second, never do `outline: none` without a
replacement: the focus ring *is* the visible cursor, and hiding it blinds keyboard
users to their own position. Use `:focus-visible` so the ring shows for keyboard
users without cluttering mouse clicks. Treat focus as the cursor it is — move it on
context changes, trap and restore it in overlays, never destroy it, and always keep
it visible — and your app becomes operable for people who never touch a mouse. The
accessible-combobox and tabs-molecule exercises are built around exactly this
focus choreography, which is where the "focus is the cursor" idea stops being a
slogan and becomes code.
