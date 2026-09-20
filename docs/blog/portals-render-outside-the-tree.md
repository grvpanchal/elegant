---
title: "Portals render outside the tree so overlays escape their parents"
slug: portals-render-outside-the-tree
layout: post
date: 2026-07-06
author: The Elegant team
category: terminology
tags: [ui, react, portals, overlays]
description: 'A portal renders a component''s output somewhere else in the DOM while keeping it in the component tree. It is how modals and dropdowns escape the overflow and stacking traps of their parents without losing their props and state.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 4
related_practice: [accessible-combobox, tabs-molecule]
---

A portal lets a component render its DOM output into a different part of the page —
typically the end of `<body>` — while staying exactly where it is in the component
tree. That split sounds odd until you have fought a modal trapped inside a parent
with `overflow: hidden` or a stacking context: the portal is how an overlay escapes
its parent's box in the DOM without losing its place in your component logic.

## The problem portals solve

Overlays — modals, dropdowns, tooltips, toasts — need to visually break out of their
parent. But a parent with `overflow: hidden` clips them, and a parent that created a
stacking context caps their z-index, so a dropdown rendered inline gets cut off or
buried no matter what CSS you throw at it. You cannot win this by styling the child;
the parent's box and context are the ceiling. A portal sidesteps it entirely by
putting the overlay's DOM at the top level, as a sibling of the app root, where no
ancestor's overflow or stacking traps it.

## DOM position moves, tree position doesn't

The elegant part is that a portal only relocates the *DOM output*. In the component
tree, the portalled component is still a child of wherever you wrote it — so it still
receives props from its parent, still reads context, still sits in your state flow,
and events still bubble up through the *component* tree (not the DOM tree) to its
logical parent. So a modal rendered via a portal can be driven by the component that
"contains" it — passed its open state, its content, its callbacks — while its pixels
live at the top of the page. You get the visual freedom without giving up the logical
relationship.

## Accessibility does not come free with a portal

Moving the DOM node has an accessibility consequence people forget: the overlay is
now physically far from the control that opened it and from the content it relates
to. So you must manage focus explicitly — move focus into the modal when it opens,
trap it there, and return it to the trigger on close — because the DOM order no
longer does this for you. You also need the right roles (`role="dialog"`,
`aria-modal`) and often `aria-labelledby` pointing at the title, so screen readers
announce it correctly despite its detached position. A portal without focus
management is a modal a keyboard user cannot use.

## When you need one and when you don't

Reach for a portal when a component must visually escape its parent: modals,
dropdowns that would be clipped, tooltips, toasts, popovers. You do not need one for
in-flow UI that stays within its container. The rule of thumb: if you are fighting
`overflow` or `z-index` to make something appear above or outside its parent, that is
the signal to portal it instead of escalating CSS. The combobox and tabs exercises
both involve floating or layered UI where a portal (with proper focus management) is
often the clean answer.
