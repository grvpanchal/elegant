---
title: "The accessibility tree is what screen readers actually read"
layout: post
slug: the-accessibility-tree-is-what-screen-readers-read
date: 2026-09-07
author: The Elegant team
category: terminology
tags: [ui, accessibility, aria, semantics]
description: Screen readers do not read your DOM. They read a parallel structure the browser builds from it — the accessibility tree — and knowing that explains why a styled div announces nothing.
cover: /assets/img/ui-system-diagram.png
reading_minutes: 5
related_practice: [accessible-combobox, form-field-molecule]
---

A screen reader does not read your DOM. The browser builds a *second* structure
from the DOM — the **accessibility tree** — and that is what assistive technology
consumes. Each node in it carries a **role** (button, link, heading, checkbox), an
**accessible name** (the text that gets announced), and a set of **states**
(checked, expanded, disabled). Once you know this tree exists, the most common
accessibility mystery dissolves: a beautifully styled `<div>` announces nothing not
because the reader is broken, but because that div became an accessibility node
with role "generic" and no name — there is simply nothing there to say.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 210" role="img" aria-labelledby="at2-t at2-d" class="blog-figure__svg">
  <title id="at2-t">The DOM is projected into an accessibility tree of roles, names and states</title>
  <desc id="at2-d">The DOM on the left maps to an accessibility tree on the right: a button element becomes role button with its text as the name; a styled div becomes role generic with no name, announcing nothing.</desc>
  <text x="120" y="26" text-anchor="middle" fill="#155799" font-size="12" font-weight="700">DOM</text>
  <g fill="#f3f6fa" stroke="#155799" stroke-width="2" font-size="9" text-anchor="middle"><rect x="40" y="45" width="170" height="30" rx="5"/><text x="125" y="64" fill="#155799">&lt;button&gt;Save&lt;/button&gt;</text><rect x="40" y="90" width="170" height="30" rx="5"/><text x="125" y="109" fill="#155799">&lt;div class="btn"&gt;Save&lt;/div&gt;</text></g>
  <path d="M210 60 L300 60" stroke="#157878" stroke-width="2" marker-end="url(#at2-a)"/><path d="M210 105 L300 105" stroke="#c2571a" stroke-width="2" marker-end="url(#at2-a)"/>
  <text x="255" y="42" text-anchor="middle" fill="#606c71" font-size="9">browser projects</text>
  <text x="470" y="26" text-anchor="middle" fill="#157878" font-size="12" font-weight="700">accessibility tree</text>
  <rect x="300" y="45" width="300" height="30" rx="5" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="450" y="64" text-anchor="middle" fill="#157878" font-size="9">role: button · name: "Save" → announced</text>
  <rect x="300" y="90" width="300" height="30" rx="5" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="450" y="109" text-anchor="middle" fill="#c2571a" font-size="9">role: generic · name: (none) → silent</text>
  <defs><marker id="at2-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Same visible text, two tree nodes. The button carries a role and a name and is announced; the styled div is generic and nameless, so the reader has nothing to say.</figcaption>
</figure>

## Role, name, state — the three things a node carries

Everything a screen reader announces comes from these three properties. A native
element fills them in automatically; a `<div>` leaves them empty. That is why the
same visible text is spoken in one case and skipped in the other:

```html
<!-- role=button, name="Delete" — announced as "Delete, button" -->
<button>Delete</button>

<!-- role=generic, name=none — the reader says nothing useful -->
<div class="button" onclick="del()">Delete</div>
```

The fix is either the native element (best) or explicitly supplying what the tree
needs: `role="button"`, a name, and — separately — the keyboard behaviour, because
the tree carries semantics, not behaviour.

## Naming: where the accessible name comes from

The accessible name is computed by a specific algorithm, and knowing its order
saves a lot of guessing. It prefers `aria-labelledby`, then `aria-label`, then the
element's own text content, then things like a `<label>` or `alt`. So an icon-only
button — no text content — is *nameless* unless you give it one:

```html
<!-- an icon button with no text: silent until you name it -->
<button aria-label="Close dialog"><svg aria-hidden="true">…</svg></button>
```

Note `aria-hidden` on the icon: it removes the decorative SVG from the tree so it
does not clutter the name with "graphic."

## Inspect the tree, don't guess

The practical upgrade is to stop imagining what a screen reader hears and *look*.
Every browser's dev tools expose the accessibility tree, showing each element's
computed role, name, and states — so you can see that your custom checkbox has no
"checked" state, or that your icon button is nameless, without launching a screen
reader:

```text
DevTools → Elements → Accessibility pane
  <button>  role: button   name: "Close dialog"   states: focusable
  <div.card> role: generic  name: ""               ← the tell: nothing to announce
```

The accessibility tree is the model that makes ARIA make sense: `aria-*` attributes
are precisely the knobs for setting a node's role, name, and states when the DOM
element does not set them for you. Build with semantic elements so the tree is
populated for free, name your icon-only controls, hide decorative graphics, and
verify by reading the tree rather than hoping. The accessible-combobox exercise is
where this becomes unavoidable — a custom widget has no native role or state, so
you compose its accessibility-tree node by hand and check it in the pane.
