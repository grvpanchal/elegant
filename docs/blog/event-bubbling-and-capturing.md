---
title: "Event bubbling and capturing: the two trips every click takes"
layout: post
slug: event-bubbling-and-capturing
date: 2026-09-09
author: The Elegant team
category: terminology
tags: [ui, events, dom, delegation]
description: Every DOM event travels down to the target and back up again. Knowing which phase your listener runs in is what makes event delegation, and stopping propagation, predictable instead of magic.
cover: /assets/img/ui-system-diagram.png
reading_minutes: 3
related_practice: [event-delegation, quiz-event-propagation]
---

When you click a button inside a card inside a list, the browser does not just
fire one listener. The event makes two trips: **capturing** down from the
document to the target, then **bubbling** back up from the target to the
document. Almost every listener you write runs on the way up, which is why
bubbling feels like "the default" — but understanding both phases is what makes
delegation and `stopPropagation` behave.

## The two phases

`addEventListener(type, handler)` registers on the bubbling phase by default.
Pass `{ capture: true }` and it runs on the way down instead. So for a click on a
nested element, capturing listeners fire outermost-first, then the target's own
listeners, then bubbling listeners fire innermost-first back up to the root. Most
of the time you want bubbling; capturing is for the rare case where an ancestor
must see the event before the target does.

## Delegation rides the bubble

Event delegation — one listener on a container instead of one per child — works
*because* events bubble. You attach a single click handler to the list, read
`event.target` to find which item was clicked, and act. This scales to thousands
of rows with one listener, and it keeps working when you add or remove children,
because the listener lives on the parent, not the items. For a dynamic list, this
is not an optimization; it is the correct default.

## Not every event bubbles

A subtlety that trips people up: some events do not bubble at all. `focus` and
`blur` fire only on the target, which is why their bubbling cousins `focusin` and
`focusout` exist for when you need to catch focus changes on a container. Media
events like `play` and `pause`, and `mouseenter`/`mouseleave`, also do not bubble
(their `mouseover`/`mouseout` counterparts do). If a delegated handler
mysteriously never fires, the first thing to check is whether the event you are
listening for bubbles — because delegation depends entirely on the bubble phase,
a non-bubbling event never reaches the container listener. The capture phase is
your escape hatch here: registering with `{ capture: true }` catches even
non-bubbling events on the way down, since capturing visits every ancestor
regardless. Knowing which events bubble turns "why doesn't my listener fire" from
a mystery into a lookup.

## stopPropagation and its cost

`event.stopPropagation()` halts the trip — the event stops travelling, so
ancestors never see it. It is tempting for "this click shouldn't close the menu,"
but it is a blunt instrument: a delegated handler higher up, or an analytics
listener on the document, silently stops working. Prefer checking `event.target`
in the ancestor over stopping the event at the child. Reserve `stopPropagation`
for genuinely isolated widgets, and know that `stopImmediatePropagation` also
blocks other listeners on the *same* element.

The model to keep: down (capture), hit the target, back up (bubble). Delegation
lives on the bubble; `stopPropagation` cuts the trip short and can break things
far away. The delegation exercise and the propagation quiz drill exactly these
phases.
