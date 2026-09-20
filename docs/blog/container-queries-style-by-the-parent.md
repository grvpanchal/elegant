---
title: "Container queries: size a component by its parent, not the viewport"
layout: post
slug: container-queries-style-by-the-parent
date: 2026-09-22
author: The Elegant team
category: terminology
tags: [css, layout, responsive, ui]
description: 'A media query asks "how wide is the viewport?" A container query asks "how wide is my parent?" — and that is the question a reusable component actually needs answered before it can lay itself out.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 5
related_practice: [responsive-image-set, data-table-sort]
---

You build a card component. In the sidebar it should stack its image above its
copy; in the main column it should put them side by side. With media queries you
write the breakpoint against the *viewport* — but the viewport did not change.
The card moved into a narrower parent, and nothing about the screen told you
that. Container queries fix the mismatch: instead of asking how wide the
*browser window* is, they ask how wide the *container* is. That is the question
a reusable component actually needs answered before it can lay itself out.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 260" role="img" aria-labelledby="cq-t cq-d" class="blog-figure__svg">
  <title id="cq-t">Container queries size a component by its parent</title>
  <desc id="cq-d">The same card component adapts to the width of its container: media stacked above the copy in a narrow column, side by side in a wide one, while the viewport stays unchanged.</desc>
  <text x="160" y="28" text-anchor="middle" fill="#c2571a" font-size="14" font-weight="700">narrow container</text>
  <rect x="40" y="45" width="240" height="170" rx="8" fill="#e8eefb" stroke="#155799" stroke-width="2"/>
  <rect x="60" y="65" width="200" height="30" rx="4" fill="#819198"/>
  <rect x="60" y="105" width="200" height="80" rx="4" fill="#157878"/>
  <rect x="60" y="195" width="200" height="14" rx="4" fill="#fe854c"/>
  <text x="160" y="245" text-anchor="middle" fill="#606c71" font-size="12">media stacks above the copy</text>
  <line x1="320" y1="40" x2="320" y2="230" stroke="#dce6f0" stroke-width="1"/>
  <text x="490" y="28" text-anchor="middle" fill="#c2571a" font-size="14" font-weight="700">wide container</text>
  <rect x="360" y="45" width="260" height="170" rx="8" fill="#e8eefb" stroke="#155799" stroke-width="2"/>
  <rect x="380" y="65" width="110" height="130" rx="4" fill="#157878"/>
  <rect x="500" y="65" width="100" height="30" rx="4" fill="#819198"/>
  <rect x="500" y="105" width="100" height="60" rx="4" fill="#fe854c"/>
  <rect x="500" y="175" width="100" height="14" rx="4" fill="#819198"/>
  <text x="490" y="245" text-anchor="middle" fill="#606c71" font-size="12">media sits beside the copy</text>
</svg>
<figcaption>The viewport never changes — only the container's width does, and the card reflows.</figcaption>
</figure>

## The container is the unit of reuse

A media query is the right tool when the *page* is the thing that changes — a
phone, a tablet, a desktop. But the moment you build a component and drop it
into several parents, the viewport is the wrong ruler. A card in a sidebar and
the same card in a hero are the same component under different parents, and the
layout decision belongs to the parent's width, not the window's. Container
queries make the component self-describing: it declares the widths it needs and
reflows itself wherever it lands. That is the difference between a component
that is *reusable* and one that is merely *copy-pasteable*.

## Declaring a query container

Any element can become a query container by giving it a `container-type`. The
`inline-size` value queries the horizontal axis only, which is what most layouts
care about and what avoids the expensive full-size variant. A `container-name`
lets you target a specific ancestor when several are query containers:

```css
.product-card {
  container-type: inline-size;   /* this element is now a query container */
  container-name: card;          /* name it so queries are unambiguous */
}

@container card (min-width: 480px) {
  .product-card__media {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

The `@container` rule reads almost like a media query, but the condition is the
container's width, not the viewport's. The card now carries its own responsive
behaviour with it, and the sidebar and the hero both get the right layout with
zero page-level breakpoints.

## The JavaScript you no longer need

Before container queries, the same effect meant a `ResizeObserver` and a
class toggle — JavaScript doing what CSS can now do declaratively:

```js
const card = document.querySelector('.product-card');
const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const wide = entry.contentBoxSize[0].inlineSize >= 480;
    card.classList.toggle('is-wide', wide);
  }
});
observer.observe(card);
```

That works, but it is imperative, per-component, and easy to forget on the
eleventh card you add. Container queries move the decision into the stylesheet
where it belongs, and the browser handles the observation for you. ResizeObserver
still earns its keep for things CSS cannot express — reacting to a height, or
running arbitrary logic on resize — but for "reflow when my parent gets wider",
the `@container` rule is the simpler, more robust answer.

## Where the trade-off bites

Container queries are not a free upgrade. A query container creates a new
containment context, so `position: fixed` children and some sizing behaviour
resolve against the container rather than the viewport — the same surprise
`contain` and `transform` already teach you. And because the browser must track
each container's size, a page with hundreds of query containers pays a real
cost; reach for them on the components that genuinely move between parents, not
on every element. The rule of thumb: if the component's layout depends on its
own parent's width, use a container query; if it depends on the device, keep the
media query. Most reusable components are the former, which is why this is the
tool that finally makes "responsive component" mean something.