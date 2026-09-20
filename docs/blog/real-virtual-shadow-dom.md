---
title: "Real DOM, Virtual DOM, Shadow DOM: three different things with one word"
layout: post
slug: real-virtual-shadow-dom
date: 2026-09-16
author: The Elegant team
category: terminology
tags: [dom, browser, web-components, rendering]
description: They share three letters and nothing else. One is what the browser renders, one is a diffing trick, and one is an encapsulation boundary — confusing them is how DOM questions get failed.
cover: /assets/img/ui-system-diagram.png
reading_minutes: 4
related_practice: [event-delegation, counter-component, theme-toggle]
---

"DOM" appears in three phrases that describe genuinely different mechanisms, and
an interview answer that blurs them lands badly. The Real DOM is what the browser
actually renders. The Virtual DOM is a library's optimisation. The Shadow DOM is
a browser feature for encapsulation. They are not three flavours of one thing;
they operate at three different layers.

## The Real DOM

The Document Object Model is the browser's live, tree-shaped representation of
the page — every element a node, addressable and mutable from JavaScript. When
people say "the DOM," this is what they mean: the actual thing the rendering
engine (Blink, WebKit, Gecko) paints. Mutating it is comparatively expensive,
because a change can trigger style recalculation, layout, and paint. That cost is
the reason the other two ideas exist.

## The Virtual DOM

The Virtual DOM is not a browser concept at all — it is a pattern a library like
React uses. It keeps a lightweight JavaScript copy of the tree in memory. When
state changes, it builds a new copy, diffs it against the old one, and computes
the minimal set of real-DOM operations needed to reconcile the difference. You
never touch the real tree directly; you describe what the UI *should* be, and the
library works out the smallest set of mutations to get there.

### What it buys, and what it does not

It buys a programming model: you write "render the list from this array" and stop
worrying about which node to insert where. What it does not buy is magic speed —
a hand-written, surgical DOM update can beat a diff. The Virtual DOM trades a
little peak performance for a lot of developer sanity, and that trade is usually
worth it. Knowing it is a trade, not a free win, is the mark of understanding it.

## The Shadow DOM

The Shadow DOM is a real browser feature, and it solves a different problem:
encapsulation. It lets an element carry its own isolated subtree — a "shadow
tree" — with styles and markup that the main document cannot accidentally reach
into, and that cannot leak out. This is what makes web components composable
without CSS collisions: a component's internals are genuinely scoped.

### Open and closed modes

A shadow root is attached in one of two modes. **Open** means script in the page
can reach the shadow tree via `element.shadowRoot`. **Closed** means it returns
`null` — the internals are sealed even from the page's own JavaScript. Native
controls like `<input type="range">` use a closed shadow tree, which is why you
cannot style their guts directly.

## Why the distinction matters

Put plainly: the Real DOM is *what renders*, the Virtual DOM is *a strategy for
updating it efficiently from a framework*, and the Shadow DOM is *a boundary that
scopes a component's markup and styles*. One is the substrate, one is an
optimisation over it, one is an encapsulation feature within it. An answer that
treats "Virtual DOM" and "Shadow DOM" as synonyms — a common slip — signals that
the mental model is missing. Keep them in separate boxes and the whole rendering
picture, from a framework's reconciler down to a scoped web component, snaps into
focus.
