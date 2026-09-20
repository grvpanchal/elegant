---
title: "The UI coding round rewards the parts that don't show in a screenshot"
layout: post
slug: the-ui-coding-round
date: 2026-07-19
author: The Elegant team
category: interview
tags: [interview, ui, accessibility, components]
description: 'Anyone can make a component look right in an interview. What separates a pass is the invisible half — keyboard operation, focus, correct roles, coherent state — done while the clock runs, not bolted on at the end.'
cover: /assets/img/ui-server-state.png
reading_minutes: 4
related_practice: [accessible-combobox, tabs-molecule, data-table-sort]
---

The UI coding round asks you to build something real in the browser — a combobox, a
set of tabs, a sortable table, a modal — usually in forty-five minutes. Almost
everyone can make it *look* right in that time. What separates a pass is the half
that does not show in a screenshot: keyboard operation, focus management, correct
roles and names, and a coherent state model. The interviewer is watching for those
specifically, because they are what distinguishes someone who builds real UI from
someone who builds demos.

## Accessibility as you go, not at the end

The strongest candidates build accessibility in from the first line, because
retrofitting it in the last five minutes never happens. When you make a custom
dropdown, you reach for the roles and the keyboard handlers as part of building it,
not as a cleanup pass. This matters because it is exactly what most candidates skip,
so doing it — and narrating it ("I'll make this a real button so it's keyboard-
operable and announced correctly") — is a cheap, strong differentiator. A component
you can only drive with a mouse is, to an experienced interviewer, unfinished, no
matter how polished it looks.

## Keep the state model coherent

The other thing under evaluation is where state lives and how it flows. A combobox
has real state — the query, the open/closed status, the highlighted option, the
selection — and a candidate who scatters that across ad-hoc variables produces
something that half-works and has bugs at the edges. Keep the state minimal and in
one place, derive what you can (the filtered options from the query, not a separate
list you sync), and the component behaves. Interviewers have seen a hundred of these
and can tell within minutes whether the state model is coherent or improvised.

## Narrate the decisions, ask the clarifying questions

Like any live round, thinking out loud is scored. Say why you are choosing a native
element, why you are lifting a piece of state, what edge case you are about to
handle. And ask the clarifying questions a real task would need: should this be
single or multi-select, does it need to handle a thousand options, is it controlled
by a parent? Asking shows you know the decisions that change the design, and it
turns an underspecified prompt into one you can build confidently. Silence while you
code, then a working-but-unexplained result, is a weaker signal than a slightly less
complete component whose decisions you narrated.

## Handle the states real components have

Finally, if time allows, handle the states a real component has and a demo skips:
empty (no options match), loading (options are async), error, and the long-content
case that breaks layout. Even acknowledging them out loud — "in production I'd add a
loading state here" — shows you think past the happy path. The combobox, tabs, and
data-table exercises are the exact components this round uses, and each is scored on
the invisible half: whether it is operable, announced, and coherent, not just
whether it looks like the mockup.
