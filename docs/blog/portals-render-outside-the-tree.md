---
title: "Portals render outside the tree so overlays escape their parents"
slug: portals-render-outside-the-tree
layout: post
date: 2026-07-06
author: The Elegant team
category: terminology
tags: [ui, react, portals, overlays]
description: 'A portal renders a component''s output somewhere else in the DOM while keeping it in the component tree. It is how modals and dropdowns escape the overflow and stacking traps of their parents without losing their props and state.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 5
related_practice: [accessible-combobox, tabs-molecule]
---

A portal renders a component's DOM output *somewhere else* in the document — usually
a node at the end of `<body>` — while keeping the component exactly where it is in
the React tree. That split is the whole trick, and it exists to solve one stubborn
problem: overlays. A modal, a dropdown, a tooltip logically belongs to the
component that opened it (it needs that component's props and state), but it must
escape that component's DOM box to avoid being clipped by `overflow: hidden` or
buried by a `z-index` it cannot win. A portal lets an overlay keep its logical
parent and its React state while breaking out of its physical container.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 210" role="img" aria-labelledby="pt-t pt-d" class="blog-figure__svg">
  <title id="pt-t">A portal keeps a component in the React tree but renders its DOM at the body</title>
  <desc id="pt-d">In the React tree the Modal is a child of Card. In the DOM its output is rendered into a portal root at the end of body, escaping the card's overflow and stacking context.</desc>
  <text x="150" y="26" text-anchor="middle" fill="#157878" font-size="11" font-weight="700">React tree</text>
  <rect x="70" y="45" width="160" height="40" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="150" y="70" text-anchor="middle" fill="#157878" font-size="10">Card</text>
  <path d="M150 85 L150 110" stroke="#819198" stroke-width="2" marker-end="url(#pt-a)"/>
  <rect x="85" y="112" width="130" height="36" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="150" y="135" text-anchor="middle" fill="#c2571a" font-size="10">Modal (child)</text>
  <text x="150" y="175" text-anchor="middle" fill="#819198" font-size="9">props + state stay here</text>
  <line x1="330" y1="20" x2="330" y2="195" stroke="#dce6f0"/>
  <text x="480" y="26" text-anchor="middle" fill="#155799" font-size="11" font-weight="700">DOM</text>
  <rect x="380" y="45" width="120" height="70" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="440" y="75" text-anchor="middle" fill="#155799" font-size="9">card (overflow:hidden)</text>
  <rect x="380" y="140" width="200" height="44" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="480" y="160" text-anchor="middle" fill="#c2571a" font-size="9">#portal-root (end of body)</text><text x="480" y="176" text-anchor="middle" fill="#c2571a" font-size="9">modal DOM lives here</text>
  <path d="M150 148 C 250 210, 380 210, 480 186" fill="none" stroke="#fe854c" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#pt-a)"/>
  <defs><marker id="pt-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Logically the Modal is Card's child (props and state flow normally); physically its DOM is rendered into a root at the end of body, clear of the card's clipping.</figcaption>
</figure>

## The overflow and z-index trap

Without a portal, an overlay renders inside its parent's DOM, and it inherits the
parent's constraints. If any ancestor has `overflow: hidden` (extremely common on
cards, scroll areas, and tables), the overlay is clipped at the box edge. If an
ancestor establishes a stacking context with a lower `z-index` than a sibling
elsewhere, no `z-index` you set on the overlay can lift it above that sibling —
stacking contexts are not global. These are not bugs in your CSS; they are the
overlay being trapped in the wrong part of the tree:

```css
/* extremely common — and it silently clips any overlay rendered inside */
.card {
  overflow: hidden;      /* rounds the corners… and crops the dropdown */
  transform: translateZ(0);  /* creates a stacking context: z-index is now local */
}
.card .dropdown { z-index: 9999; }  /* still can't beat a sibling outside .card */
```

## Render into a node outside the trap

`createPortal` takes the JSX and a target DOM node, and renders there instead of
in place. The component stays a normal child in React — it receives props, holds
state, and dispatches events up the React tree as usual:

```jsx
import { createPortal } from "react-dom";

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return createPortal(
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true">{children}</div>
    </div>,
    document.getElementById("portal-root")   // renders at the end of <body>
  );
}
```

The `#portal-root` sits at the top level of the DOM, free of any ancestor's
`overflow` or stacking context, so the modal is never clipped and its `z-index`
behaves globally.

## Events still follow the React tree, and a11y still needs care

The detail that surprises people: because the component stays in the React tree,
events **bubble through the React parent**, not the DOM parent. A click inside the
portal reaches an `onClick` on the logical parent component even though the DOM node
lives elsewhere — which is usually what you want, and occasionally a gotcha if you
relied on DOM-based bubbling. The portal solves *placement*, not accessibility: a
portalled modal still needs focus moved into it, focus trapped, Escape to close, and
focus restored on close — the DOM location does not do any of that for you. Use
portals for exactly the things that must escape their container — modals,
dropdowns, tooltips, toasts — and pair them with the focus choreography an overlay
requires. The accessible-combobox exercise combines both: a listbox that must
escape its input's overflow *and* manage focus correctly, which is the portal
pattern at full strength.
