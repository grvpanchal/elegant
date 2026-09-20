---
title: "Colocate state until you can't"
layout: post
slug: colocate-state-until-you-cant
date: 2026-08-25
author: The Elegant team
category: terminology
tags: [state, architecture, react, components]
description: The right home for a piece of state is the smallest scope that needs it. Lifting everything to a global store by default is how a simple app grows a state-management problem it never needed.
cover: /assets/img/state-system-diagram.png
reading_minutes: 3
related_practice: [counter-component, query-string-state]
---

Where should a piece of state live? The reflex, after learning Redux, is "in the
store." The better default is the opposite: state lives in the smallest scope
that needs it, and only moves outward when something outside that scope genuinely
needs it too. Colocation keeps simple things simple and stops your global store
from becoming a junk drawer.

## Start local

A toggle for one component's dropdown belongs in that component. A form's draft
values belong in the form. A hover state belongs on the element. None of this is
anyone else's business, so putting it in a global store adds indirection,
boilerplate, and a re-render surface for no benefit. Local state is the cheapest,
most obvious home: it is created and destroyed with the component, it cannot be
accidentally coupled to unrelated features, and reading it needs no selector. The
question is not "could this go in the store?" but "does anything outside this
component need it?"

## Lift only when sharing demands it

State moves up when two siblings need to agree on it — then it lifts to their
common parent. It goes global when it is genuinely app-wide: the current user,
the theme, a cart that several routes read and write. The trigger for each move is
a concrete sharing need, not a style rule. "Lift when shared, globalize when
app-wide" gives you a reason for every placement, where "everything in the store"
gives you a store full of state only one component ever touches.

## The cost of premature globalization

Over-lifting has real costs beyond boilerplate. Global state is a wider
re-render surface — more components subscribe, more re-render on change unless
you carefully select. It is a coupling risk — unrelated features now share a
namespace and can step on each other. And it is a testing tax — a component that
could have been tested with a prop now needs the whole store stood up. Every
piece of state you globalize before you need to is a small tax you pay forever;
every piece you keep local is friction you never incur.

There is a real "can't" that forces state outward, and that is fine — shared
carts, cross-route filters, the signed-in user. The point is to let the need pull
state up rather than pushing it up by default. Colocate first, lift on a sharing
need, globalize on an app-wide one, and your store stays small enough to reason
about. The counter-component exercise is deliberately local; query-string-state
is the case where the URL, not the store, is the right shared home.
