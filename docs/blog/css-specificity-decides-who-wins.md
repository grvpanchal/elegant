---
title: "CSS specificity decides who wins, and it is not about order"
layout: post
slug: css-specificity-decides-who-wins
date: 2026-09-13
author: The Elegant team
category: terminology
tags: [ui, css, specificity, cascade]
description: When two rules target the same element, the more specific selector wins — regardless of which came last. Understanding the tiebreak is the difference between fixing a style and piling !important on it.
cover: /assets/img/ui-system-diagram.png
reading_minutes: 5
related_practice: [theme-toggle, loading-button-atom]
---

When two CSS rules set the same property on the same element, only one wins.
Most people assume the last one in the file wins — and sometimes it does, but
only as a *tiebreak of last resort*. The real decider is **specificity**: a
score the browser computes from the shape of each selector. A selector with a
higher score beats a lower one no matter where either sits in the stylesheet.
This is why a fix you add at the bottom of the file does nothing, and why the
frustrated next move — `!important` — is a symptom, not a solution.

## Specificity is a three-column score

The browser reads every selector as three numbers: how many **IDs** it uses,
how many **classes / attributes / pseudo-classes**, and how many **elements /
pseudo-elements**. Compare the columns left to right, like a version number: a
single ID beats any number of classes, and a single class beats any number of
element selectors. Order in the file is only consulted when the scores are
exactly equal.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 250" role="img" aria-labelledby="sp-t sp-d" class="blog-figure__svg">
  <title id="sp-t">Specificity as a three-column scoreboard</title>
  <desc id="sp-d">Three selectors scored in ID, class and element columns. The nav a rule scores 0-0-2, the .active rule 0-1-0, and #logo 1-0-0; the highest column that differs decides, so ID beats class beats element.</desc>
  <g font-size="12" text-anchor="middle" fill="#606c71">
    <text x="300" y="34" font-weight="700">ID</text><text x="400" y="34" font-weight="700">class</text><text x="500" y="34" font-weight="700">element</text>
  </g>
  <g font-family="monospace" font-size="13">
    <text x="30" y="80" fill="#155799">nav a</text>
    <rect x="270" y="66" width="60" height="24" rx="4" fill="#f3f6fa" stroke="#dce6f0"/><text x="300" y="83" text-anchor="middle" fill="#819198">0</text>
    <rect x="370" y="66" width="60" height="24" rx="4" fill="#f3f6fa" stroke="#dce6f0"/><text x="400" y="83" text-anchor="middle" fill="#819198">0</text>
    <rect x="470" y="66" width="60" height="24" rx="4" fill="#e8f0f8" stroke="#157878"/><text x="500" y="83" text-anchor="middle" fill="#157878" font-weight="700">2</text>
    <text x="30" y="130" fill="#c2571a">.active</text>
    <rect x="270" y="116" width="60" height="24" rx="4" fill="#f3f6fa" stroke="#dce6f0"/><text x="300" y="133" text-anchor="middle" fill="#819198">0</text>
    <rect x="370" y="116" width="60" height="24" rx="4" fill="#fff4ec" stroke="#fe854c"/><text x="400" y="133" text-anchor="middle" fill="#c2571a" font-weight="700">1</text>
    <rect x="470" y="116" width="60" height="24" rx="4" fill="#f3f6fa" stroke="#dce6f0"/><text x="500" y="133" text-anchor="middle" fill="#819198">0</text>
    <text x="30" y="180" fill="#155799">#logo</text>
    <rect x="270" y="166" width="60" height="24" rx="4" fill="#e8eefb" stroke="#155799"/><text x="300" y="183" text-anchor="middle" fill="#155799" font-weight="700">1</text>
    <rect x="370" y="166" width="60" height="24" rx="4" fill="#f3f6fa" stroke="#dce6f0"/><text x="400" y="183" text-anchor="middle" fill="#819198">0</text>
    <rect x="470" y="166" width="60" height="24" rx="4" fill="#f3f6fa" stroke="#dce6f0"/><text x="500" y="183" text-anchor="middle" fill="#819198">0</text>
  </g>
  <line x1="30" y1="205" x2="610" y2="205" stroke="#dce6f0"/>
  <text x="320" y="230" text-anchor="middle" fill="#606c71" font-size="12">compare left to right: #logo (1-0-0) beats .active (0-1-0) beats nav a (0-0-2)</text>
</svg>
<figcaption>Read the score like a version number: the first column that differs decides, and a lower column can never make up the gap.</figcaption>
</figure>

## Why your fix at the bottom does nothing

Say a link is styled by its ID, and you try to override the colour with a class
you add later:

```css
#logo { color: navy; }        /* score 1-0-0 */

/* added later, at the very bottom of the file: */
.brand-link { color: crimson; }   /* score 0-1-0 — loses, despite coming last */
```

The link stays navy. The class scores `0-1-0`; the ID scores `1-0-0`; the ID
column differs first and it is higher, so `#logo` wins and file order is never
even consulted. Adding more declarations below changes nothing, because the
problem is not position — it is that you brought a class to an ID fight.

## Match the specificity instead of escalating

The fix is to make your winning rule score *at least* as high, then let order
break the tie. Raise the new selector to the same tier — here, by scoping the
class under the same ID — and it now scores `1-1-0`, which beats `1-0-0`
cleanly:

```css
#logo { color: navy; }              /* 1-0-0 */
#logo.brand-link { color: crimson; } /* 1-1-0 — wins on the class column */
```

That is the whole discipline: **compute the score, then match or exceed it by
one tier**, rather than reaching for `!important`. `!important` wins by leaving
the specificity system entirely, and the moment a second `!important` appears
you are back to comparing specificity *among* the important declarations, with
no clean exit — the escalation just moved up a floor. The durable habit is to
keep selectors flat and class-based so almost everything scores `0-1-0` and file
order is a real, usable tiebreak. When you do need to win, win by one tier, on
purpose. The theme-toggle exercise is a good place to feel this: a theme
override has to beat the base rule without an arms race.
