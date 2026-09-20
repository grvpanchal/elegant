---
title: "The cost of premature abstraction: wrong is more expensive than repeated"
slug: the-cost-of-premature-abstraction
layout: post
date: 2026-06-16
author: The Elegant team
category: architecture
tags: [architecture, abstraction, maintainability, craft]
description: 'Pulling two similar bits of code into a shared abstraction feels responsible. Do it too early, before you know how they will actually diverge, and you build the wrong abstraction — which costs more than the duplication ever would.'
cover: /assets/img/atomic-design.png
reading_minutes: 5
related_practice: [presentational-vs-container, combine-reducers]
---

Seeing two similar pieces of code and pulling them into a shared abstraction feels
like the responsible, DRY thing to do. Done too early — before you actually know how
the two cases will diverge — it is a trap. You build an abstraction around the
*coincidental* similarities you can see now, and then reality reveals the differences
you could not, so you bolt on flags and special cases until the shared thing is more
tangled than the duplication would ever have been. The uncomfortable truth is that
**a wrong abstraction is more expensive than repeated code**, because duplication is
easy to see and delete, while a bad abstraction is load-bearing and everyone is
afraid to touch it.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 180" role="img" aria-labelledby="pa-t pa-d" class="blog-figure__svg">
  <title id="pa-t">Duplication is cheap to fix later; a wrong abstraction accretes flags</title>
  <desc id="pa-d">Left: two similar copies, easy to merge or delete later. Right: an early abstraction that grows boolean flags and special cases as the cases diverge, becoming tangled.</desc>
  <text x="150" y="24" text-anchor="middle" fill="#157878" font-size="11" font-weight="700">duplication</text>
  <rect x="70" y="45" width="70" height="34" rx="5" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="105" y="66" text-anchor="middle" fill="#157878" font-size="9">copy A</text>
  <rect x="160" y="45" width="70" height="34" rx="5" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="195" y="66" text-anchor="middle" fill="#157878" font-size="9">copy B</text>
  <text x="150" y="110" text-anchor="middle" fill="#819198" font-size="9">visible, easy to merge or delete</text>
  <line x1="330" y1="18" x2="330" y2="165" stroke="#dce6f0"/>
  <text x="480" y="24" text-anchor="middle" fill="#c2571a" font-size="11" font-weight="700">early abstraction</text>
  <rect x="410" y="45" width="140" height="80" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="480" y="66" text-anchor="middle" fill="#c2571a" font-size="9">shared()</text>
  <g fill="#c2571a" font-size="8" text-anchor="middle"><text x="480" y="84">if (isA) …</text><text x="480" y="98">if (variant) …</text><text x="480" y="112">if (legacy) …</text></g>
  <text x="480" y="150" text-anchor="middle" fill="#819198" font-size="9">tangled, nobody dares touch it</text>
</svg>
<figcaption>Two copies are legible and cheap to reconcile once you see the real shape. An abstraction built too early grows a flag per divergence until it is the scary part of the code.</figcaption>
</figure>

## The wrong abstraction grows flags

Watch what happens when you abstract two things that are only superficially alike.
Every way they turn out to differ becomes a parameter, and the "shared" function
becomes a switchboard nobody understands:

```js
// abstracted after seeing two similar cards — then reality added flags
function renderCard(item, { showAvatar, isCompact, hasFooter, variant, legacyMode }) {
  // 60 lines of `if (isCompact) … else if (legacyMode) …`
  // each flag was a real divergence the original abstraction didn't foresee
}
```

Each flag was a moment where the cases diverged and you patched the abstraction
instead of admitting it was wrong. The result is harder to change than two honest
copies would have been.

## Duplication is cheaper than the wrong shape

The counter-move is to *tolerate duplication until the real abstraction reveals
itself*. Two or three similar copies are fine — they are easy to read, easy to change
independently, and easy to merge *once you can see what they truly share*. "Write
Everything Twice" before you extract is a real heuristic: the third occurrence is
usually when the genuine common shape becomes visible, and only then is the
abstraction likely to be right:

```jsx
// two honest, separate cards — each simple, each free to diverge
function UserCard({ user })   { return <article className="card">…</article>; }
function ProductCard({ item }) { return <article className="card">…</article>; }
// merge them ONLY when a third case shows what's actually shared — not before
```

## Prefer the abstraction that is easy to unwind

When you do abstract, favour shapes that are cheap to back out of — composition over
configuration, small focused helpers over god-functions, duplication over a flag that
encodes a guess. The deep signal is that *the cost asymmetry runs the other way from
intuition*: undoing duplication is a mechanical merge; undoing a wrong abstraction
means untangling everything that came to depend on it. So when unsure, wait. Let the
divergence show itself, extract on the third occurrence, and pick abstractions you
could delete without a rescue mission. The presentational-vs-container exercise is a
good example of an abstraction that *is* worth it (a stable, real boundary), and
combine-reducers shows abstracting by clean slices rather than by premature flags —
both cases where the shape was known before the extraction, which is exactly the
condition that makes an abstraction pay.
