---
title: "The box model, and why box-sizing: border-box exists"
layout: post
slug: the-box-model
date: 2026-07-10
author: The Elegant team
category: terminology
tags: [ui, css, layout, box-model]
description: 'Every element is a box of content, padding, border, and margin. The one setting that changes how width is measured — box-sizing — is why your 50% columns overflow, and why every reset sets it to border-box.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 5
related_practice: [responsive-image-set]
---

Every element the browser paints is a rectangular box, and that box has four
concentric parts: the **content** in the middle, the **padding** around it, the
**border** around that, and the **margin** outside the border. Layout bugs that
look mysterious — a two-column grid that overflows its container, a card that is
suddenly wider than its siblings — are almost always a disagreement about which
of those parts the word `width` refers to. There is a single property that
settles it, and knowing what it does is most of what "understanding the box
model" means in practice.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 260" role="img" aria-labelledby="bm-t bm-d" class="blog-figure__svg">
  <title id="bm-t">The four boxes, and what each box-sizing value counts as width</title>
  <desc id="bm-d">Concentric boxes for margin, border, padding and content. With content-box, width measures the content only; with border-box, width measures content plus padding plus border.</desc>
  <rect x="30" y="30" width="270" height="200" rx="6" fill="none" stroke="#dce6f0" stroke-width="2" stroke-dasharray="5 4"/>
  <text x="40" y="24" fill="#819198" font-size="11">margin</text>
  <rect x="60" y="60" width="210" height="140" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/>
  <text x="70" y="54" fill="#c2571a" font-size="11">border</text>
  <rect x="88" y="86" width="154" height="88" rx="4" fill="#f3f6fa" stroke="#155799" stroke-width="2" stroke-dasharray="3 3"/>
  <text x="98" y="80" fill="#155799" font-size="11">padding</text>
  <rect x="120" y="112" width="90" height="36" rx="3" fill="#e8f0f8" stroke="#157878" stroke-width="2"/>
  <text x="165" y="135" text-anchor="middle" fill="#157878" font-size="12" font-weight="700">content</text>
  <line x1="360" y1="45" x2="360" y2="215" stroke="#dce6f0" stroke-width="1"/>
  <text x="500" y="60" text-anchor="middle" fill="#155799" font-size="13" font-weight="700">content-box</text>
  <text x="500" y="80" text-anchor="middle" fill="#606c71" font-size="11">width = content only</text>
  <text x="500" y="98" text-anchor="middle" fill="#819198" font-size="11">padding + border ADD to it</text>
  <text x="500" y="150" text-anchor="middle" fill="#c2571a" font-size="13" font-weight="700">border-box</text>
  <text x="500" y="170" text-anchor="middle" fill="#606c71" font-size="11">width = content + padding + border</text>
  <text x="500" y="188" text-anchor="middle" fill="#819198" font-size="11">padding + border eat INTO it</text>
</svg>
<figcaption>The same four boxes; the only question is whether <code>width</code> counts the content alone (content-box) or the whole painted box (border-box).</figcaption>
</figure>

## The default counts the wrong thing

CSS ships with `box-sizing: content-box`. Under that rule, `width` sets the size
of the **content box only** — padding and border are then added on top. So this
card, which you asked to be half its container, is not half its container:

```css
.col {
  width: 50%;          /* content is 50% ... */
  padding: 1rem;       /* ... plus 16px each side ... */
  border: 1px solid;   /* ... plus 1px each side */
}
/* two .col side by side = 100% + 4rem + 4px  →  they overflow and wrap */
```

Two of these will not fit in one row, because each is `50%` *plus* 34px. The
numbers you wrote and the numbers the browser lays out are different numbers,
and nothing in the CSS tells you that unless you already know the default.

## border-box makes width mean what you meant

Switch the measurement and `width` becomes the size of the **whole painted box**
— padding and border are absorbed inward instead of pushed outward. Now `50%`
is genuinely 50% of the container, whatever padding you add later:

```css
.col {
  box-sizing: border-box;
  width: 50%;
  padding: 1rem;       /* eats into the 50%, doesn't add to it */
  border: 1px solid;
}
/* two .col side by side = exactly 100%  →  they fit */
```

This is why nearly every stylesheet opens with a reset that flips the default
for everything at once. Apply it to `*` and to the pseudo-elements, and inherit
it so component authors can opt a subtree back out if they ever need to:

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

## Margin is outside the box, and it collapses

One part sits apart from the rest: `margin` is space *between* boxes, not part of
the box, so no `box-sizing` value touches it — a margin always adds to the
footprint. And vertical margins between block siblings **collapse**: a `24px`
bottom margin meeting a `16px` top margin produces `24px` of gap, not `40px`.
That surprises people who expect the two to sum, and it is why a gap looks
smaller than the arithmetic. When you need a gap that never collapses and never
surprises, reach for `gap` on a flex or grid container instead — it is defined
between items and does not participate in collapsing at all.

The whole model reduces to one habit: set `border-box` globally, then read
`width` and `height` as the size of the visible box, and treat `margin` as the
space around it. Once measurement is predictable, the overflow bugs stop, and
sizing a responsive layout becomes arithmetic you can trust. The responsive
image exercise is a good place to feel a box whose dimensions have to stay
honest as the viewport changes.
