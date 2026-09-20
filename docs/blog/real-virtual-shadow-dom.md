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
reading_minutes: 5
related_practice: [event-delegation, counter-component, theme-toggle]
---

Real DOM, Virtual DOM, and Shadow DOM share three letters and almost nothing else,
and conflating them is a reliable way to fail an interview question and to reason
badly about performance. They are answers to three unrelated questions. The **real
DOM** is what the browser actually renders and what you manipulate. The **virtual
DOM** is a performance *technique* some frameworks use to figure out the minimal set
of real-DOM changes. The **shadow DOM** is an *encapsulation* boundary for web
components. One is the thing; one is a strategy for updating the thing; one is a way
to seal a piece of the thing off. Keep those three roles straight and the whole area
stops being a soup of "DOM" words.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 190" role="img" aria-labelledby="rd-t rd-d" class="blog-figure__svg">
  <title id="rd-t">Three DOM concepts answering three different questions</title>
  <desc id="rd-d">Real DOM: what the browser renders. Virtual DOM: an in-memory copy diffed to compute minimal updates. Shadow DOM: an encapsulated subtree with its own scope.</desc>
  <g font-size="9" text-anchor="middle">
    <rect x="20" y="45" width="180" height="100" rx="8" fill="#f3f6fa" stroke="#155799" stroke-width="2.5"/><text x="110" y="40" fill="#155799" font-weight="700">real DOM</text><text x="110" y="90" fill="#155799">what the browser</text><text x="110" y="106" fill="#155799">renders</text><text x="110" y="128" fill="#819198">the thing itself</text>
    <rect x="230" y="45" width="180" height="100" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="320" y="40" fill="#157878" font-weight="700">virtual DOM</text><text x="320" y="90" fill="#157878">in-memory copy,</text><text x="320" y="106" fill="#157878">diffed → min updates</text><text x="320" y="128" fill="#819198">a strategy</text>
    <rect x="440" y="45" width="180" height="100" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="530" y="40" fill="#c2571a" font-weight="700">shadow DOM</text><text x="530" y="90" fill="#c2571a">encapsulated subtree,</text><text x="530" y="106" fill="#c2571a">scoped styles</text><text x="530" y="128" fill="#819198">a boundary</text>
  </g>
</svg>
<figcaption>Three roles, not three flavours of one thing: the real DOM is the thing, the virtual DOM is a strategy for updating it, and the shadow DOM is a boundary within it.</figcaption>
</figure>

## Real DOM: the thing itself

The real DOM is the live tree of nodes the browser renders and you can touch. Reading
and writing it is real work — a write can trigger reflow, a read can force one — which
is why manipulating it carelessly is slow:

```js
// the real DOM: direct manipulation, and every write can cost layout
const el = document.querySelector("#count");
el.textContent = String(next);   // this changes what the browser actually paints
```

There is only one real DOM; the other two exist to help you work *with* it.

## Virtual DOM: a strategy for updating the real one

The virtual DOM is a framework technique, not a browser feature. The framework keeps a
lightweight in-memory representation, and when state changes it builds a *new* one,
**diffs** it against the old one, and applies only the minimal real-DOM changes that
result. The point is to avoid touching the expensive real DOM more than necessary:

```jsx
// you describe the whole UI as if re-rendering it all…
function Counter({ n }) { return <span>{n}</span>; }
// …the framework diffs old vs new virtual tree and updates ONLY the changed text node
```

It is a *means* to fast real-DOM updates — and notably, newer frameworks (Svelte,
Solid) skip it entirely by compiling precise updates ahead of time, which proves it is
one strategy among several, not a law.

## Shadow DOM: a boundary, not a strategy

The shadow DOM is unrelated to both. It is an **encapsulation** feature for web
components: a subtree attached to an element whose styles and markup are scoped, so the
page's CSS does not leak in and the component's does not leak out:

```js
// shadow DOM: a sealed subtree with its own style scope
const shadow = el.attachShadow({ mode: "open" });
shadow.innerHTML = `<style>p { color: teal; }</style><p>scoped — won't affect the page</p>`;
```

That `p` rule styles only inside the shadow tree; the page's paragraphs are untouched.
So the clean summary is: the **real DOM** is what gets rendered, the **virtual DOM** is
one way frameworks compute efficient updates to it, and the **shadow DOM** is a way to
encapsulate a piece of it — three answers to *rendering*, *updating*, and *isolating*
respectively. An interviewer asking you to compare them is checking exactly this: that
you know they are not three versions of one idea. The event-delegation and
counter-component exercises live in the real DOM's update cost, and theme-toggle
touches shadow-DOM-style scoping — feeling each in practice is what cements the
distinction.
