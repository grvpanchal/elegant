---
title: "Event bubbling and capturing: the two trips every click takes"
layout: post
slug: event-bubbling-and-capturing
date: 2026-09-09
author: The Elegant team
category: terminology
tags: [ui, events, dom, delegation]
description: 'Every DOM event travels down to the target and back up again. Knowing which phase your listener runs in is what makes event delegation, and stopping propagation, predictable instead of magic.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 5
related_practice: [event-delegation, quiz-event-propagation]
---

When you click a button inside a card inside a list, the browser does not fire one
listener. The event makes **two trips**: a *capturing* phase down from the document
to the target, then a *bubbling* phase back up from the target to the document.
Almost every listener you write runs on the way up — which is why bubbling feels
like "the default" — but both phases are always happening, and knowing which one
your handler runs in is what makes delegation and `stopPropagation` behave instead
of feeling like magic.

## The journey of one click

Here is the path a click on the innermost element takes through three nested nodes.
Watch the dot: it travels **down** through the capture phase, hits the target, then
travels **back up** through the bubble phase.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 300" role="img" aria-labelledby="evt-title evt-desc" class="blog-figure__svg">
  <title id="evt-title">DOM event propagation phases</title>
  <desc id="evt-desc">A click event travels down from document to the target during the capture phase, then back up to document during the bubble phase.</desc>
  <defs>
    <marker id="evt-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="#819198"/>
    </marker>
  </defs>
  <!-- nested boxes -->
  <rect x="40" y="20" width="560" height="260" rx="10" fill="none" stroke="#155799" stroke-width="2"/>
  <text x="52" y="40" fill="#155799" font-size="13" font-weight="700">document</text>
  <rect x="90" y="60" width="460" height="180" rx="9" fill="none" stroke="#1e6bb8" stroke-width="2"/>
  <text x="102" y="80" fill="#1e6bb8" font-size="13" font-weight="700">&lt;ul&gt; list</text>
  <rect x="150" y="100" width="340" height="100" rx="8" fill="#f3f6fa" stroke="#fe854c" stroke-width="2.5"/>
  <text x="162" y="122" fill="#c2571a" font-size="13" font-weight="700">&lt;li&gt; → &lt;button&gt; (target)</text>
  <!-- capture path (down, left) -->
  <path d="M70 46 L70 150 L150 150" fill="none" stroke="#819198" stroke-width="2" stroke-dasharray="5 5" marker-end="url(#evt-arrow)"/>
  <text x="8" y="150" fill="#157878" font-size="12" font-weight="700" transform="rotate(-90 14 150)">capture ↓</text>
  <!-- bubble path (up, right) -->
  <path d="M490 150 L570 150 L570 46" fill="none" stroke="#fe854c" stroke-width="2" stroke-dasharray="5 5" marker-end="url(#evt-arrow)"/>
  <text x="624" y="150" fill="#c2571a" font-size="12" font-weight="700" transform="rotate(90 624 150)">bubble ↑</text>
  <!-- animated event dot: down the capture path, then up the bubble path -->
  <circle r="7" fill="#157878">
    <animateMotion dur="4s" repeatCount="indefinite"
      path="M70 46 L70 150 L150 150 L320 150 L490 150 L570 150 L570 46 L70 46"/>
  </circle>
</svg>
<figcaption>One click, two trips: down through capture, then up through bubble. Most listeners fire on the up-trip.</figcaption>
</figure>

## The two phases in code

`addEventListener` registers on the **bubbling** phase by default. Pass
`{ capture: true }` and the same handler runs on the way *down* instead:

```js
const list = document.querySelector("ul");

// Bubbling (default): fires on the way UP, innermost first.
list.addEventListener("click", () => console.log("ul: bubble"));

// Capturing: fires on the way DOWN, outermost first.
list.addEventListener("click", () => console.log("ul: capture"), { capture: true });
```

For a click on a `<button>` deep inside that `<ul>`, the capture listeners fire
outermost-first, then the target's own listeners, then the bubble listeners fire
innermost-first back up to the root. So the order above is `ul: capture` first
(going down) and `ul: bubble` last (coming back up), even though both are on the
same element. You almost always want bubbling; capturing is for the rare case where
an ancestor must see the event *before* the target does.

## Delegation rides the bubble

The reason bubbling matters day to day is **event delegation**: one listener on a
container instead of one per child. It works precisely *because* events bubble up to
the container, so a single handler can serve thousands of rows — and keep working
when you add or remove children, because the listener lives on the parent:

```js
// One listener for the whole list — not one per <li>.
list.addEventListener("click", (event) => {
  const item = event.target.closest("li");
  if (!item || !list.contains(item)) return;      // ignore clicks in the gaps
  console.log("clicked item", item.dataset.id);   // event.target is what was clicked
});
```

`event.target` is the element that was actually clicked (the deep one), while
`event.currentTarget` is the element the listener is attached to (the list). That
distinction is the whole trick of delegation: the listener is on the parent, but you
read the target to find which child. For a dynamic list this is not an optimization,
it is the correct default.

## stopPropagation and its real cost

`event.stopPropagation()` halts the trip — the event stops travelling, so ancestors
never see it. It is tempting for "this click shouldn't close the menu," but it is a
blunt instrument that breaks things far away:

```js
// Tempting, and a footgun:
menuButton.addEventListener("click", (event) => {
  event.stopPropagation();   // now a delegated handler on document never fires —
  toggleMenu();              // analytics, "click outside to close", all silently break
});

// Usually better: let it bubble, and have the ancestor check the target.
document.addEventListener("click", (event) => {
  if (!menu.contains(event.target)) closeMenu();   // "click outside" without stopping anything
});
```

Prefer checking `event.target` in the ancestor over stopping the event at the child.
Reserve `stopPropagation` for genuinely isolated widgets, and know that
`stopImmediatePropagation` also blocks other listeners on the *same* element.

## Not every event bubbles

A subtlety that trips people up: some events do not bubble at all. `focus` and `blur`
fire only on the target, which is why the bubbling cousins `focusin` and `focusout`
exist for catching focus changes on a container. `mouseenter`/`mouseleave` do not
bubble (their `mouseover`/`mouseout` counterparts do). If a delegated handler
mysteriously never fires, the first thing to check is whether the event you are
listening for bubbles — because delegation depends entirely on the bubble phase, a
non-bubbling event never reaches the container listener. The capture phase is your
escape hatch here: registering with `{ capture: true }` catches even non-bubbling
events on the way down, since capturing visits every ancestor regardless.

The model to keep is the diagram above: down (capture), hit the target, back up
(bubble). Delegation lives on the bubble; `stopPropagation` cuts the trip short and
can break things far away; and a handful of events skip the bubble entirely. The
delegation exercise and the propagation quiz drill exactly these phases.
