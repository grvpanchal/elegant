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
reading_minutes: 3
related_practice: [accessible-combobox, form-field-molecule]
---

A screen reader never sees your beautiful DOM. The browser builds a second
structure from the DOM — the **accessibility tree** — and that is what assistive
technology navigates. Each node in it has a role ("button"), a name ("Submit"), a
state ("pressed"), and a value. If your element does not contribute a useful node
to that tree, it does not exist to a screen-reader user, no matter how it looks.

## Role, name, state

Every interactive element needs three things in the tree. A **role** says what it
is: button, link, checkbox, tab. A **name** says which one: the accessible name
comes from the visible text, a `<label>`, `aria-label`, or `aria-labelledby`. A
**state** says its condition: checked, expanded, disabled, selected. A native
`<button>Save</button>` supplies all three automatically. A `<div class="btn">`
supplies none — it lands in the tree as a generic, nameless node the user cannot
identify or operate.

## Where the tree comes from

Native semantics populate the tree for free; that is the whole argument for
semantic HTML. ARIA attributes *edit* the tree: `role="tab"` sets the role,
`aria-selected="true"` sets the state, `aria-label` sets the name. But ARIA only
changes what the tree reports — it never changes behaviour, and it never adds a
node the DOM did not already have. This is why "add `role="button"`" makes a div
*sound* like a button without making it *act* like one; you still owe the
keyboard handlers.

## Hiding and exposing nodes on purpose

The tree is also where you decide what *not* to announce. A decorative icon next
to a text label should not be read twice, so you hide it from the tree with
`aria-hidden="true"` — it still shows visually, it just stops contributing a
node. Conversely, an icon-only button needs a name the tree can report, supplied
by `aria-label` since there is no visible text. And a region that updates
asynchronously — a search result count, a toast, a form error — needs
`aria-live` so the tree announces the change without the user having to go find
it. Each of these is an edit to the tree, not to the pixels: you are curating
what the screen reader perceives. The failure mode is a screen full of
meaningful updates that the tree never announces, because the developer styled
the change but never told the accessibility layer it happened.

## Debugging what the user hears

You do not have to guess. Every browser's dev tools has an accessibility panel
that shows the computed node for a selected element — its role, its computed
name, its states. When a control "does nothing" for a screen reader, open that
panel: usually the name is empty (no label) or the role is generic (a div that
should be a button). Fixing the tree, not the styling, is the fix.

The habit worth building: for every interactive thing you ship, ask what its
node in the accessibility tree looks like — role, name, state — and verify it in
the panel rather than assuming. The combobox exercise is a masterclass in getting
that tree right, because a combobox has a lot of state to report.
