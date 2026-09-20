---
title: "Atoms, molecules, organisms: the vocabulary of a component system"
layout: post
slug: atoms-molecules-organisms
date: 2026-09-20
author: The Elegant team
category: terminology
tags: [ui, atomic-design, components, vocabulary]
description: Atomic design is not a folder-naming fad — it is a shared vocabulary for arguing about where a component belongs before you write it.
cover: /assets/img/atomic-design.png
reading_minutes: 4
related_practice: [atom-boundaries, loading-button-atom, form-field-molecule, tabs-molecule]
---

Every team that has argued about whether a thing is "a component or just markup"
has felt the absence of a shared vocabulary. Atomic design gives you one. It is
not a rule about folders; it is a way to name the *level of composition* a piece
of UI sits at, so two people can disagree productively instead of pushing the
same box around a diagram.

## The five levels, and what actually separates them

The names come from chemistry, but the useful distinction is dependency, not
metaphor.

### Atoms

An atom owns no layout decisions about anything but itself. A button, an input,
an icon. It takes props, it emits events, and it has no opinion about what sits
next to it. The test that matters: could you drop this into any screen in the
app without dragging context along? If yes, it is an atom. If it only makes
sense inside one feature, it is not — it is a molecule wearing an atom's name.

### Molecules

A molecule is the smallest thing that is *useful* rather than merely reusable. A
labelled input with its error message. A search field with its button. The
molecule's job is to bind a few atoms into one accessible unit — the label's
`for`, the input's `aria-describedby`, the error's `role` — so the binding lives
in one place instead of being re-derived on every screen.

### Organisms

An organism is a section of a page a user would name: a header, a product card,
a comment thread. Organisms are where composition gets opinionated — they decide
arrangement, spacing, and which molecules appear. The recurring mistake is
letting an organism fetch its own data. The moment it does, it stops being
reusable and becomes a feature. Keep the fetch in a container above it and pass
data down.

### Templates and skeletons

Templates arrange organisms into a page's structure without real content;
skeletons are the loading-state stand-ins that hold that structure while data
arrives. Both exist so that "the page's shape" is a thing you can point at
separately from "the page's data".

## Why the vocabulary earns its keep

The value is not tidiness. It is that "where does this belong?" becomes a
question with a defensible answer. When someone proposes a 300-line component,
you can ask which level it claims to be, and the answer usually reveals that it
is three levels fused together. Splitting it is then obvious rather than a matter
of taste.

It also makes review faster. A reviewer who sees a data fetch inside a file named
as an organism knows to push back without reading the logic — the *level* already
told them the boundary is wrong. That is the whole point of a vocabulary: it lets
you catch a class of mistakes by name.

## Where teams get it wrong

The most common failure is treating the levels as a strict tree — insisting an
organism may only contain molecules, never atoms. Real UIs are messier: a header
organism will hold a bare logo atom directly. The levels describe *composition
depth*, not a rigid containment law. Use them to reason, not to litigate.

The second failure is naming by size. A big file is not automatically an
organism, and a small one is not automatically an atom. Reusability and data
-independence decide the level, not line count.

Get the vocabulary right and the folder structure falls out of it for free — not
the other way round.
