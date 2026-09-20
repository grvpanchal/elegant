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
reading_minutes: 5
related_practice: [theme-toggle, loading-button-atom]
---

A design token is a named value — `color.brand`, `space.md`, `radius.card` — used
everywhere in place of a raw `#fe854c` or `16px`. That sounds like a naming
convention, but the useful way to see it is as an **API**: tokens are the design
system's public interface, and components are consumers that only ever reference
the names, never the underlying values. Draw that line and a rebrand, a dark mode,
or a density change becomes editing the *implementation* behind the API — a config
change in one place — instead of a find-and-replace across a thousand components
that will always miss some.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 200" role="img" aria-labelledby="dt2-t dt2-d" class="blog-figure__svg">
  <title id="dt2-t">Components consume token names; the token layer maps names to values</title>
  <desc id="dt2-d">Components reference token names like color.brand and space.md. A token layer maps those names to concrete values, and a theme swaps the values without touching components.</desc>
  <rect x="30" y="70" width="120" height="60" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="90" y="95" text-anchor="middle" fill="#c2571a" font-size="10">components</text><text x="90" y="113" text-anchor="middle" fill="#819198" font-size="9">use names only</text>
  <path d="M150 100 L250 100" stroke="#819198" stroke-width="2" marker-end="url(#dt2-a)"/><text x="200" y="90" text-anchor="middle" fill="#819198" font-size="9">color.brand</text>
  <rect x="250" y="60" width="150" height="80" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="325" y="88" text-anchor="middle" fill="#157878" font-size="10">token layer (API)</text><text x="325" y="108" text-anchor="middle" fill="#819198" font-size="9">name → value</text>
  <path d="M400 100 L500 100" stroke="#819198" stroke-width="2" marker-end="url(#dt2-a)"/>
  <rect x="500" y="55" width="110" height="40" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="555" y="80" text-anchor="middle" fill="#155799" font-size="9">light: #fe854c</text>
  <rect x="500" y="105" width="110" height="40" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="555" y="130" text-anchor="middle" fill="#155799" font-size="9">dark: #ff9a63</text>
  <text x="325" y="165" text-anchor="middle" fill="#819198" font-size="9">swap values here — components never change</text>
  <defs><marker id="dt2-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Components depend on the token names; the token layer resolves names to values. Change the values (a theme) and the consumers are untouched.</figcaption>
</figure>

## Components consume names, never raw values

The discipline is that no component contains a literal colour, spacing, or radius —
it references a token. In CSS the natural carrier is a custom property, because it
is a live, inheritable name:

```css
:root {
  --color-brand: #fe854c;
  --space-md: 16px;
  --radius-card: 8px;
}
.card {
  padding: var(--space-md);        /* the NAME, not 16px */
  border-radius: var(--radius-card);
  border-color: var(--color-brand);
}
```

A reviewer (or a lint rule) can now enforce a simple invariant: a raw hex or px
value in a component is a bug, because it bypasses the API.

## Tiered tokens: primitives, semantics, components

Mature systems layer the API so intent is expressed, not just values. **Primitive**
tokens are the raw palette (`--blue-500`); **semantic** tokens name a role
(`--color-action` → `--blue-500`); **component** tokens name a specific use
(`--button-bg` → `--color-action`). Components consume the semantic or component
tier, so you can change what "action" means without touching the palette or the
components:

```css
:root {
  --blue-500: #1e6bb8;             /* primitive: a raw colour */
  --color-action: var(--blue-500); /* semantic: the ROLE */
  --button-bg: var(--color-action);/* component: this specific use */
}
.button { background: var(--button-bg); }
```

## The payoff: theming and rebrands become config

Because components only touch the API, changing the *implementation* reprices the
whole system at once. Dark mode redefines the semantic tier; a rebrand redefines
the primitives; a density change redefines the spacing scale — each is one block of
overrides, and every component inherits the change with zero edits:

```css
[data-theme="dark"] {
  --color-action: #4c9be8;   /* re-point one semantic token; every button follows */
}
```

That is the whole argument for treating tokens as an API rather than as shared
constants: an API has a stable surface (the names) and a swappable
implementation (the values), which is exactly the property that turns "rebrand the
app" from a multi-week grep into a config edit. Tokens are also what let design and
engineering share one vocabulary — the designer's "action colour" and the
developer's `--color-action` are the same token. The theme-toggle exercise builds
the theme-swap-behind-the-API move directly, which is the clearest demonstration
of why the indirection pays for itself.
