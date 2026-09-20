---
title: "Design tokens are the API of a design system"
layout: post
slug: design-tokens-are-the-api-of-a-design-system
date: 2026-07-25
author: The Elegant team
category: architecture
tags: [ui, design-system, theming, tokens]
description: 'A design token is a named value — a color, a space, a radius — used everywhere instead of a raw number. Treating tokens as the design system''s public API is what makes theming, dark mode, and rebrands a config change instead of a find-and-replace.'
cover: /assets/img/atomic-design.png
reading_minutes: 4
related_practice: [theme-toggle, loading-button-atom]
---

A design token is a named value standing in for a raw one: `--color-primary`
instead of `#157878`, `--space-4` instead of `1rem`, `--radius-md` instead of
`6px`. It sounds like a naming convention, and treated shallowly it is one.
Treated as the *public API* of your design system, it is the thing that turns
theming, dark mode, and rebrands from a codebase-wide find-and-replace into a
config change.

## Names, not literals, everywhere

The rule is that components never use raw values — no `#157878`, no `1rem`, no
`6px` in a component's styles. They use tokens. A button's background is
`var(--color-primary)`, its padding is `var(--space-3)`, its corners are
`var(--radius-md)`. The raw values exist in exactly one place, the token
definitions, and everything else references them by name. This is the same
principle as not scattering magic numbers through code: the literal lives once, and
the meaning ("primary color," "medium radius") is what the rest of the system
speaks.

## Theming becomes redefining tokens

Once components speak in tokens, a theme is just a different set of token values.
Dark mode redefines `--color-bg` and `--color-text` inside a media query or a
`[data-theme]` scope, and every component follows because they all reference the
tokens, not the literals. A rebrand changes `--color-primary` in one place and the
whole product updates. A white-label deployment ships a token file per client. None
of this touches component code, because the components were never coupled to
values — only to names. This is why serious theming is built on tokens plus CSS
custom properties, which make those names live at runtime.

## Tokens have tiers

Mature token systems have layers, and the layering is what keeps them flexible.
*Primitive* tokens are the raw palette: `--blue-500`, `--gray-100`. *Semantic*
tokens give those meaning: `--color-primary: var(--blue-500)`,
`--color-danger: var(--red-500)`. Components use the *semantic* tokens, never the
primitives. So "make primary green instead of blue" is one edit to the semantic
layer, and "adjust our blue" is one edit to the primitive — and components, which
only ever said `--color-primary`, are untouched either way. Skipping the semantic
tier and using primitives directly in components is the common mistake that makes
rebrands painful again.

## The token file is a contract

Because tokens are the API, the token file is a contract between design and
engineering, and between the design system and its consumers. Renaming or removing
a token is a breaking change, exactly like changing a function signature, and
should be treated with the same care. Adding one is safe; changing what one means
ripples everywhere it is used, which is the point — that ripple is the leverage.
Treat tokens as a versioned, deliberate interface and your design system scales;
treat them as loose variables and they drift back into magic numbers with extra
steps. The theme-toggle exercise is tokens-plus-custom-properties made concrete,
and the loading-button atom is a component that should speak only in tokens.
