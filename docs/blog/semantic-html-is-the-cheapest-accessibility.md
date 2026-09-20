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
reading_minutes: 5
related_practice: [form-field-molecule, accessible-combobox, loading-button-atom]
---

The cheapest accessibility you will ever ship is choosing the right HTML element.
Before a single ARIA attribute, before any JavaScript, the browser gives native
elements a pile of behaviour for free: a `<button>` is focusable, fires on Enter
and Space, announces itself as a button to a screen reader, and participates in
forms. A `<div>` styled to look like a button has *none* of that, and getting it
back means reimplementing the browser by hand — and getting every detail right.
The first rule of ARIA is literally "don't use ARIA if a native element already
does the job." Semantic HTML is that native element.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 200" role="img" aria-labelledby="sh-t sh-d" class="blog-figure__svg">
  <title id="sh-t">A native button ships behaviour for free; a div button must reimplement all of it</title>
  <desc id="sh-d">On the left a button element with focusable, keyboard, role and form-participation ticks. On the right a div with role button requiring tabindex, keydown handlers and aria all added by hand.</desc>
  <text x="150" y="26" text-anchor="middle" fill="#157878" font-size="12" font-weight="700">&lt;button&gt;</text>
  <g fill="#157878" font-size="10"><text x="60" y="60">✓ focusable</text><text x="60" y="82">✓ Enter / Space</text><text x="60" y="104">✓ announced as button</text><text x="60" y="126">✓ submits forms</text></g>
  <text x="200" y="150" text-anchor="middle" fill="#157878" font-size="9">free from the browser</text>
  <line x1="320" y1="20" x2="320" y2="180" stroke="#dce6f0"/>
  <text x="480" y="26" text-anchor="middle" fill="#c2571a" font-size="12" font-weight="700">&lt;div role="button"&gt;</text>
  <g fill="#c2571a" font-size="10"><text x="380" y="60">＋ tabindex="0"</text><text x="380" y="82">＋ onKeyDown Enter/Space</text><text x="380" y="104">＋ role="button"</text><text x="380" y="126">＋ can't submit a form</text></g>
  <text x="490" y="150" text-anchor="middle" fill="#c2571a" font-size="9">all by hand, easy to get wrong</text>
</svg>
<figcaption>Every tick on the left is behaviour the browser gives a real button. On the right you re-add each one manually — and still cannot fully match it.</figcaption>
</figure>

## The div button re-implements the browser, badly

Here is what a clickable `<div>` actually costs once you make it accessible. Every
line is behaviour a real button already had:

```jsx
// a div pretending to be a button — and still not quite one
<div
  role="button"                              // tell AT it's a button
  tabIndex={0}                               // make it focusable
  onClick={handleClick}
  onKeyDown={(e) => {                         // re-implement Enter AND Space
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); }
  }}
>Save</div>
```

Compared to the thing it is imitating:

```jsx
<button onClick={handleClick}>Save</button>   // all of the above, for free
```

The `<button>` is fewer characters, cannot forget the Space key, and stays correct
when the platform changes its conventions.

## Structure is semantic too

Semantics is not only interactive elements. Using `<nav>`, `<main>`, `<header>`,
`<h1>`–`<h6>` in order, `<ul>` for lists, and `<table>` for tabular data gives
screen-reader users a *map* — they can jump between landmarks and headings instead
of reading linearly. A page built from `<div>`s is one undifferentiated wall to
assistive tech:

```html
<header>…</header>
<nav aria-label="Primary">…</nav>
<main>
  <h1>Page title</h1>
  <section><h2>Section</h2> …</section>   <!-- headings a reader can jump between -->
</main>
```

## ARIA is the patch, not the plan

None of this means ARIA is bad — it is essential for the widgets HTML has no
element for (a combobox, a tab set, a tree). But ARIA *adds* semantics on top of
HTML; it does not add *behaviour*. `role="button"` tells a screen reader "this is a
button" and does nothing to make Enter work — you still write that yourself. So the
order is: reach for the semantic element first, and use ARIA only to fill the gaps
it genuinely cannot cover, on custom widgets, with the keyboard behaviour
hand-built to match. Every native element you use is behaviour you did not have to
write, test, and maintain. The loading-button-atom and accessible-combobox
exercises sit on opposite ends of this: the button should just *be* a `<button>`,
while the combobox is the real case where ARIA and hand-built keyboard support are
unavoidable.
