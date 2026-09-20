---
title: "Custom properties are runtime variables, and that changes theming"
layout: post
slug: custom-properties-are-runtime-css-variables
date: 2026-09-11
author: The Elegant team
category: terminology
tags: [ui, css, theming, custom-properties]
description: A Sass variable is gone by the time the browser runs. A CSS custom property is live — it cascades, inherits, and can be changed at runtime, which is why theming and dark mode are built on it.
cover: /assets/img/ui-system-diagram.png
reading_minutes: 5
related_practice: [theme-toggle, loading-button-atom]
---

There are two kinds of "CSS variable" and the difference is when they exist. A
**Sass variable** (`$brand`) is a *build-time* value: the preprocessor substitutes
it and it is gone before the browser ever sees the CSS. A **CSS custom property**
(`--brand`) is a *runtime* value: it lives in the cascade, it inherits down the
tree, and — the crucial part — you can change it while the page is running and
every rule that reads it updates instantly. That single property, being alive at
runtime, is why modern theming, dark mode, and per-component overrides are built on
custom properties and not on preprocessor variables.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 200" role="img" aria-labelledby="cp-t cp-d" class="blog-figure__svg">
  <title id="cp-t">Sass variables vanish at build; custom properties live in the running page</title>
  <desc id="cp-d">Top: a Sass variable is substituted at build time and does not exist at runtime. Bottom: a custom property exists at runtime, inherits down the tree, and can be reassigned to retheme live.</desc>
  <text x="30" y="42" fill="#c2571a" font-size="11" font-weight="700">Sass $var</text>
  <rect x="150" y="28" width="90" height="28" rx="5" fill="#f3f6fa" stroke="#819198"/><text x="195" y="47" text-anchor="middle" fill="#819198" font-size="9">build</text>
  <path d="M240 42 L300 42" stroke="#819198" stroke-width="2" marker-end="url(#cp-a)"/>
  <rect x="300" y="28" width="120" height="28" rx="5" fill="#f3f6fa" stroke="#819198" stroke-dasharray="3 3"/><text x="360" y="47" text-anchor="middle" fill="#819198" font-size="9">gone at runtime</text>
  <line x1="30" y1="80" x2="610" y2="80" stroke="#dce6f0"/>
  <text x="30" y="115" fill="#157878" font-size="11" font-weight="700">--var</text>
  <rect x="150" y="100" width="100" height="28" rx="5" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="200" y="119" text-anchor="middle" fill="#157878" font-size="9">:root --brand</text>
  <path d="M250 114 L310 114" stroke="#157878" stroke-width="2" marker-end="url(#cp-a)"/><text x="280" y="106" fill="#157878" font-size="8">inherits</text>
  <rect x="310" y="100" width="110" height="28" rx="5" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="365" y="119" text-anchor="middle" fill="#c2571a" font-size="9">every consumer</text>
  <path d="M365 128 C 365 165, 200 165, 200 130" fill="none" stroke="#fe854c" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#cp-a)"/><text x="280" y="162" text-anchor="middle" fill="#c2571a" font-size="9">reassign --brand → all update live</text>
  <defs><marker id="cp-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Sass values are compiled away; custom properties persist in the page, inherit through the tree, and re-flow every consumer when you change one.</figcaption>
</figure>

## Define once, read everywhere, change at runtime

Declare custom properties on `:root` so they inherit to the whole document, then
read them with `var()`. Because they are live, reassigning one on any element
updates every rule that reads it under that element:

```css
:root {
  --brand: #fe854c;
  --text: #1a1a1a;
  --bg: #ffffff;
}
.button { background: var(--brand); }
.page    { color: var(--text); background: var(--bg); }
```

Nothing here is compiled away — `--brand` is sitting in the running page, and the
button's colour is a live reference to it.

## Theming is a one-selector override

Because custom properties cascade and inherit, a theme is just a *different set of
values* scoped to a selector. Dark mode does not touch a single component rule — it
redefines the tokens, and everything downstream re-resolves:

```css
[data-theme="dark"] {
  --text: #e6e6e6;
  --bg: #161b22;
  --brand: #ff9a63;
}
/* no component CSS changes — .button and .page just read the new values */
```

Flip the attribute in one line of JS and the whole page rethemes, with no
per-component logic:

```js
document.documentElement.dataset.theme = "dark";   // every var() re-resolves
```

## Read from JS, and scope per component

The runtime nature cuts both ways: JavaScript can *read* and *write* custom
properties too, which is how you bridge dynamic values into CSS (a drag position, a
computed accent) without inline-styling every rule. And because they inherit, you
can override a token for one subtree — a card that wants a denser spacing scale sets
`--space: 4px` on itself and its children pick it up, without new class names. Two
caveats keep it honest: custom properties are not known to the preprocessor, so you
cannot use them in Sass math at build time; and they resolve at *use* time, so a
typo'd `var(--brnad)` silently falls back rather than erroring. Used well, they turn
theming from a rebuild into a runtime toggle — which is exactly what the theme-toggle
exercise builds: one attribute flip, a whole palette redefined, zero component
edits.
