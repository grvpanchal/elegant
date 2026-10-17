---
title: "Skeleton: designing the loading state"
layout: lesson
course: ui-layer
slug: skeleton
term: ui/skeleton
skill: ui-skeleton
practice: skeleton-list
description: "Agents build the loaded screen and leave a spinner for the rest. Specify a skeleton that reserves the real layout and nothing jumps when data arrives."
insight: "A skeleton shows the shape of the content that is coming instead of a generic spinner, so waiting reads as loading rather than broken. Its real test is measurable: when data replaces the placeholder, nothing on the page should move."
---

## The state nobody asks for

Ask an agent for a user list and you get the list, rendered from data that is
already there. The loading state is whatever was quickest, usually a centred
spinner, and the first time the request is slow the spinner disappears, the
rows appear, and everything below them jumps down the page. The term doc
describes a skeleton as placeholder shapes that mimic the final layout,
standing in for text, images and components until the real data arrives.

The templates ship one. `templates/chota-react-redux/src/ui/skeletons/Skeleton/Skeleton.component.jsx`
is an atom-sized block with `variant`, `height` and `width` props, styled by
`Skeleton.style.css` with a `skeleton-loading` animation between two greys and
`text` and `circle` variants. The `TodoList` organism renders three
`<Skeleton height="24px" />` blocks while `todoData.isContentLoading` is true,
and the real `TodoItems` otherwise. The organism decides which state to show.
The container only reports which one applies.

## What makes a skeleton correct

The doc's Common Mistakes are three ways to get it wrong:

1. **A generic spinner where a content-aware skeleton fits.** The spinner
   occupies a different box from the content it stands in for, so a layout
   shift is guaranteed.
2. **A skeleton that does not match the content.** An `ArticleSkeleton` laid
   out differently from `Article` still makes the content jump.
3. **A skeleton for content that loads instantly.** A cached profile that
   arrives in 50ms makes the skeleton flash, which the doc calls more jarring
   than no skeleton at all. Its fix is a 200ms delay before the skeleton shows.

The practice question adds two requirements a reviewer can check in markup.
The placeholder rows carry `aria-hidden="true"` while the region announces
loading once through `aria-busy` and a polite live region. Without that, a
screen reader reads six empty list items. The shimmer is also gated behind
`prefers-reduced-motion`, because a repeating animation in peripheral vision is
a migraine trigger for some people. The template's
`Skeleton.style.css` animates unconditionally, so it is a fair first thing to
point an agent at.

The question's best trick is cheap to put in a prompt: let the skeleton reuse
the real row's class, so its height comes from the same CSS. A skeleton with
hand-tuned pixel heights drifts the first time someone changes the row's
padding.

## Brief the loading state

```text
While loading, render 6 UserCardSkeleton rows, the page size.
Reuse the .user-card class so each placeholder is the real row's height.
Placeholders are aria-hidden; the list has aria-busy and a polite status.
Shimmer only under prefers-reduced-motion: no-preference.
Show nothing for the first 200ms; no layout shift when data arrives.
```

Review against the `ui-skeleton` quality gates: the shape matches the final
content, the animation is subtle, nothing shifts on load, it appears only for
loads over 200ms, and it is specific to the component rather than a generic
grey box.
