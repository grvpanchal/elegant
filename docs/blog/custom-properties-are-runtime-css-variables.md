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
reading_minutes: 3
related_practice: [theme-toggle, loading-button-atom]
---

Preprocessor variables and CSS custom properties look similar and behave nothing
alike. A Sass `$brand` is resolved at build time and compiled away — the browser
never sees it. A CSS `--brand` is a real value in the cascade, present at
runtime, inheriting down the tree and overridable per element. That single
difference is why every serious theming system is built on custom properties,
not preprocessor variables.

## Live, cascading, inheritable

Declare `--brand: #157878` on `:root` and every descendant can read it with
`var(--brand)`. Override it inside a `.dark` block or a `[data-theme="dark"]`
scope, and everything downstream re-resolves — no recompile, no class swap on
every element. Because custom properties cascade and inherit like any other
property, you can scope a theme to a subtree: a single widget can carry its own
`--brand` without touching the rest of the page.

## Why dark mode lives here

Dark mode is the canonical example. You define your colors as custom properties
once, then redefine them inside a `@media (prefers-color-scheme: dark)` block (or
a `[data-theme]` override for a manual toggle). The components never change; only
the values do. Compare that to the preprocessor approach, where "dark mode" means
compiling a second stylesheet and swapping it — twice the CSS, and a flash when
you switch. With custom properties the switch is instant because the values were
always live.

## They are readable and writable from JavaScript

Because custom properties are live in the cascade, JavaScript can read and set
them: `getComputedStyle(el).getPropertyValue('--gap')` reads one, and
`el.style.setProperty('--gap', '2rem')` writes one that cascades to every
descendant. That bridge is how you drive CSS from state without inline-styling
every element — set one property on a container and the whole subtree responds.
It powers things like a user-adjustable font size, a drag handle that writes its
position into a `--x`/`--y` pair the CSS consumes, or a chart that hands its
computed color scale to CSS. Preprocessor variables cannot do any of this,
because they no longer exist at runtime. The custom property is a genuine,
two-way channel between your JavaScript state and your styles — which is a
different category of tool from a build-time constant, not just a nicer syntax.

## The fallback and the gotcha

`var()` takes a fallback: `var(--gap, 1rem)` uses `1rem` if `--gap` is unset.
Useful, but do not lean on it to paper over a missing token — a fallback that
silently kicks in hides a theming bug. The real gotcha is that custom properties
inherit, so a value set high in the tree leaks into places you did not intend
unless you reset it. Treat your `:root` tokens as a deliberate public API and
scope the rest.

The mental model to keep: preprocessor variables are a authoring convenience
that vanish; custom properties are a runtime capability that ships. Theming,
dark mode, and per-component overrides all depend on the runtime half. The theme
toggle exercise puts this to work end to end.
