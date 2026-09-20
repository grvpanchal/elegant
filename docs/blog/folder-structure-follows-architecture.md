---
title: "Folder structure should follow architecture, not file type"
layout: post
slug: folder-structure-follows-architecture
date: 2026-07-27
author: The Elegant team
category: architecture
tags: [architecture, organization, atomic-design, maintainability]
description: 'Grouping every component in one folder, every style in another, every test in a third feels tidy and ages badly. Structure that mirrors your architecture — atoms, molecules, containers, state — tells a new reader how the app is built.'
cover: /assets/img/atomic-design.png
reading_minutes: 4
related_practice: [atom-boundaries, presentational-vs-container]
---

Open an unfamiliar frontend and its folder structure is the first thing that
either teaches you the architecture or hides it. The common "group by file type"
layout — all components here, all styles there, all tests somewhere else — looks
organized and tells you nothing about how the app is actually built. Structure that
mirrors the architecture does the opposite: the folders *are* the design, legible
at a glance.

## Group by type and you scatter every feature

When you group by file type, a single feature is smeared across the tree: its
component in `/components`, its styles in `/styles`, its test in `/tests`, its
slice in `/reducers`. To understand or change that feature you open four distant
folders and reassemble it in your head. Worse, nothing in the structure tells you
what *kind* of component something is — an atom and a page-level organism sit in
the same flat `/components` bin, so the layering that your architecture depends on
is invisible in the place people look first.

## Structure that names the layers

The layout this site's templates use makes the architecture the structure:
`ui/atoms`, `ui/molecules`, `ui/organisms`, `ui/templates`, `ui/skeletons` for the
UI layer; `containers` for the components that fetch and decide; `state` for the
store; `pages` or `views` for routes. A reader who knows atomic design can navigate
it immediately, and the folder a file lives in tells you its role and its rules —
an organism does not fetch, a container does. The structure carries the
conventions, so it is documentation that cannot go stale.

## Colocate what changes together

Within the layers, keep the pieces of one thing together. A component's markup,
styles, stories, and test in one folder means changing that component touches one
place, and deleting it is a clean `rm -rf` of a directory rather than a hunt across
four trees. This is the practical form of "colocation": the things that change
together live together, so the blast radius of a change matches the change. The
file-type layout optimizes for "show me all the tests," which almost nobody
actually needs; the colocated layout optimizes for "let me work on this feature,"
which is the daily task.

## Consistency is the real win

Whatever scheme you choose, the deepest value is that it is *consistent and
predictable*, because then a developer (or an AI) can find and place files without
guessing, and a new file has an obvious home. An inconsistent structure taxes
every single change with a "where does this go?" decision, and those decisions
drift, and the drift compounds. Let the folders mirror the architecture, colocate
what belongs together, and hold the convention — and the structure will keep
teaching the design long after the original authors are gone. The atom-boundaries
exercise is exactly the "what layer does this belong to" judgement that a good
structure encodes.
