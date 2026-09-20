---
title: "Semantic HTML is the cheapest accessibility you will ever ship"
layout: post
slug: semantic-html-is-the-cheapest-accessibility
date: 2026-09-14
author: The Elegant team
category: terminology
tags: [ui, accessibility, html, semantics]
description: Before you reach for a single ARIA attribute, use the element that already means what you want. A button is a button; a div pretending to be one is a bug waiting to happen.
cover: /assets/img/ui-system-diagram.png
reading_minutes: 3
related_practice: [form-field-molecule, accessible-combobox, loading-button-atom]
---

The fastest accessibility win on any frontend is also the one teams skip most
often: use the right element. A `<button>`, a `<nav>`, a `<label>`, a `<main>` —
each carries a role, keyboard behaviour, and screen-reader semantics that you
would otherwise have to rebuild by hand, badly. Semantic HTML is not a nicety.
It is the foundation the rest of accessibility stands on.

## What the element gives you for free

A native `<button>` is focusable, fires on Enter and Space, exposes the role
"button" to assistive tech, and sits in the tab order automatically. A `<div>`
with an `onClick` gives you none of that. To make the div equivalent you would
add `role="button"`, `tabindex="0"`, and keydown handlers for Enter and Space —
and you would still miss edge cases the browser handles for you. Every attribute
you add to fake a native element is a line that can rot; the native element
never rots.

The same holds up the tree. A `<form>` gives you submit-on-Enter and native
validation hooks. A `<label>` tied to an input by `for`/`id` makes the whole
label a click target and announces the field's name. Landmark elements —
`<header>`, `<nav>`, `<main>`, `<footer>` — let a screen-reader user jump
straight to the content instead of tabbing through everything.

## When you actually need ARIA

ARIA exists for the gaps native HTML cannot fill: a custom combobox, a tab
panel, a live region announcing an async result. But the first rule of ARIA is
"don't use ARIA" — if a native element does the job, reach for it first. ARIA
adds semantics; it does not add behaviour. `role="button"` tells a screen reader
"this is a button," but you still have to wire the keyboard yourself. That is
the trap: ARIA looks like it makes a div into a button, and it only makes it
*sound* like one.

## It compounds across the whole app

The reason this is the *cheapest* accessibility is that it pays off everywhere at
once, for free, forever. A native control keeps working when the browser ships a
new assistive feature, when a user brings their own stylesheet, when the page is
read by a voice assistant you have never tested against. You did not write code
for any of that; the platform did, and semantic markup opts you into it. Fake
controls opt you out — every div-button is a promise to keep reimplementing
platform behaviour by hand as the platform evolves. Multiply that by a component
library used on a hundred screens and the maintenance cost of getting the element
wrong is enormous, while the cost of getting it right is zero. That asymmetry is
why this belongs at the top of any accessibility checklist, above ARIA, above
audits, above automated scanners.

## The rule worth keeping

Reach for the semantic element first, ARIA second, and a `div` with handlers
only when nothing else fits — and when it doesn't, you have signed up to
reimplement a browser feature. Most "accessibility work" on a mature codebase is
really just replacing divs that should have been buttons. Get the elements right
at authoring time and the accessibility audit gets a lot shorter.
