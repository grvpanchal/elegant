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
reading_minutes: 5
related_practice: [atom-boundaries, presentational-vs-container]
---

The instinct to group files by *type* — all components in `/components`, all styles in
`/styles`, all tests in `/tests` — feels tidy and ages badly. It optimises for a
question nobody asks ("show me every component") and pessimises the one everyone asks
("show me everything about the checkout feature"), which is now scattered across four
folders. A folder structure that instead mirrors your **architecture** — atoms,
molecules, organisms, containers, state — turns the directory tree into documentation:
a new reader can infer how the app is built just by expanding folders. Structure is a
message to the next person, and type-grouping sends the wrong one.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 190" role="img" aria-labelledby="fs-t fs-d" class="blog-figure__svg">
  <title id="fs-t">Group by type scatters a feature; group by architecture colocates it</title>
  <desc id="fs-d">Left: folders by type (components, styles, tests) with one feature's files scattered across all three. Right: folders by architecture layer (ui/atoms, containers, state) with related files together.</desc>
  <text x="150" y="24" text-anchor="middle" fill="#c2571a" font-size="11" font-weight="700">by type</text>
  <g fill="#fff4ec" stroke="#fe854c" stroke-width="1.5" font-size="8" text-anchor="middle"><rect x="40" y="40" width="220" height="24" rx="4"/><text x="150" y="56" fill="#c2571a">components/ … Cart.jsx</text><rect x="40" y="70" width="220" height="24" rx="4"/><text x="150" y="86" fill="#c2571a">styles/ … Cart.css</text><rect x="40" y="100" width="220" height="24" rx="4"/><text x="150" y="116" fill="#c2571a">tests/ … Cart.test.js</text></g>
  <text x="150" y="150" text-anchor="middle" fill="#819198" font-size="8">one feature, three folders</text>
  <line x1="330" y1="18" x2="330" y2="175" stroke="#dce6f0"/>
  <text x="480" y="24" text-anchor="middle" fill="#157878" font-size="11" font-weight="700">by architecture</text>
  <g fill="#e8f0f8" stroke="#157878" stroke-width="1.5" font-size="8" text-anchor="middle"><rect x="380" y="40" width="220" height="24" rx="4"/><text x="490" y="56" fill="#157878">ui/atoms/Button.jsx</text><rect x="380" y="70" width="220" height="24" rx="4"/><text x="490" y="86" fill="#157878">containers/CartContainer.jsx</text><rect x="380" y="100" width="220" height="24" rx="4"/><text x="490" y="116" fill="#157878">state/cart.js</text></g>
  <text x="490" y="150" text-anchor="middle" fill="#819198" font-size="8">layers legible at a glance</text>
</svg>
<figcaption>By type, one feature's files are spread across three folders. By architecture, the tree itself shows the layers — atoms, containers, state — and where each thing belongs.</figcaption>
</figure>

## By-type folders hide the architecture

When files are grouped by extension, the directory tree tells you the language, not
the design. You cannot see from `/components` which components are atoms and which are
feature organisms, which are pure and which fetch — the very distinctions that matter
are invisible:

```text
src/
  components/   Button, Cart, UserCard, Header, ProductGrid…  (atoms? organisms? who fetches?)
  styles/       Button.css, Cart.css, …
  tests/        Button.test.js, …
# to understand Cart, open three folders; to know if Cart may fetch, open the file
```

## By-architecture folders are documentation

Group by the architecture instead and the tree answers design questions on sight. The
layer a file lives in *tells you its rules* — an `ui/atoms/` file is pure and takes
props; a `containers/` file is where data enters; `state/` holds reducers and
selectors:

```text
src/
  ui/
    atoms/       Button.jsx      (pure, props only — the folder implies the rule)
    molecules/   FormField.jsx
    organisms/   ProductGrid.jsx (still no fetch — it's under ui/)
  containers/    CartContainer.jsx (the only place allowed to touch the store)
  state/         cart.js, selectors.js
  lib/           formatMoney.js  (pure helpers)
```

A new engineer reads this tree and knows, before opening a file, that an organism does
not fetch and a container does — because the structure *is* the architecture.

## Colocate what changes together

The deeper principle is colocation: things that change together should live together.
A component's markup, its styles, its stories, and its test are one unit of change, so
they belong in one folder, not scattered by type across the tree:

```text
ui/molecules/FormField/
  FormField.jsx
  FormField.style.css
  FormField.stories.jsx
  FormField.test.jsx      # everything about FormField, in one place
```

Now editing `FormField` is opening one folder, and the by-type sprawl is gone.
Structure by architecture and colocate by feature and your tree becomes a map a
newcomer can navigate without a guide — and the map stays honest, because the folder a
file sits in declares the rules it must follow. The atom-boundaries and
presentational-vs-container exercises are exactly about placing a component on this
map and honouring the rule its location implies.
