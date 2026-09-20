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
reading_minutes: 5
related_practice: [atom-boundaries, loading-button-atom, form-field-molecule, tabs-molecule]
---

Atomic design gets dismissed as a folder-naming fad — "why do I have to call it an
atom?" — but that misses the point. The value is not the folders; it is a **shared
vocabulary** that lets a team argue about *where a component belongs* before
anyone writes it. When "is this an atom or a molecule?" has an answer, so does
"should this hold state?" and "may this fetch?" — because each layer carries
rules. The names are a compression scheme for a whole set of decisions, and a team
that shares them stops re-litigating the same structural questions on every PR.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 210" role="img" aria-labelledby="at-t at-d" class="blog-figure__svg">
  <title id="at-t">Atoms compose into molecules, molecules into organisms</title>
  <desc id="at-d">An atom (input) and an atom (label) compose into a molecule (form field), and several molecules compose into an organism (a form). Complexity and responsibility grow left to right.</desc>
  <text x="90" y="28" text-anchor="middle" fill="#155799" font-size="11" font-weight="700">atoms</text>
  <g fill="#e8eefb" stroke="#155799" stroke-width="2" font-size="9" text-anchor="middle"><rect x="40" y="45" width="100" height="30" rx="5"/><text x="90" y="64" fill="#155799">input</text><rect x="40" y="85" width="100" height="30" rx="5"/><text x="90" y="104" fill="#155799">label</text></g>
  <path d="M140 80 L190 90" stroke="#819198" stroke-width="2" marker-end="url(#at-a)"/><path d="M140 60 L190 82" stroke="#819198" stroke-width="2" marker-end="url(#at-a)"/>
  <text x="270" y="28" text-anchor="middle" fill="#157878" font-size="11" font-weight="700">molecule</text>
  <rect x="190" y="70" width="150" height="44" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="265" y="96" text-anchor="middle" fill="#157878" font-size="10">form field</text>
  <path d="M340 92 L400 92" stroke="#819198" stroke-width="2" marker-end="url(#at-a)"/>
  <text x="500" y="28" text-anchor="middle" fill="#c2571a" font-size="11" font-weight="700">organism</text>
  <rect x="400" y="55" width="180" height="90" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="490" y="95" text-anchor="middle" fill="#c2571a" font-size="10">sign-up form</text><text x="490" y="113" text-anchor="middle" fill="#819198" font-size="9">many fields + button</text>
  <text x="320" y="190" text-anchor="middle" fill="#819198" font-size="10">complexity and responsibility grow →</text>
  <defs><marker id="at-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>The layers are a composition ladder: atoms are indivisible, molecules combine a few atoms, organisms assemble molecules into a meaningful section.</figcaption>
</figure>

## Atoms are indivisible and dumb

An atom is the smallest useful UI piece — a button, an input, a label, an icon. It
takes props, renders, and emits events, and it holds no business logic and no
knowledge of your data. The test for an atom is: could it live in any app? A
button that knows about your cart is not an atom:

```jsx
// atom: pure, reusable anywhere, knows nothing about your domain
export function Button({ variant = "primary", children, onClick }) {
  return <button className={`btn btn--${variant}`} onClick={onClick}>{children}</button>;
}
```

## Molecules combine a few atoms into a unit

A molecule groups a small number of atoms into something with a single, clear job
— a labelled input, a search field (input + button), a card header. It coordinates
its atoms but still takes its data as props and stays free of business logic:

```jsx
// molecule: composes atoms into one reusable unit, still prop-driven
export function FormField({ label, id, error, ...inputProps }) {
  return (
    <div className="field">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} aria-invalid={!!error} {...inputProps} />
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}
```

## Organisms are a meaningful section, still without a fetch

An organism assembles molecules and atoms into a distinct part of an interface —
a sign-up form, a site header, a product card grid. It is the level where a
"feature" starts to be visible, and it is exactly where discipline matters most:
an organism still takes its data and callbacks as props. It does *not* fetch, and
it does *not* reach into the store — that is a container's job, one level up.
Keeping the organism prop-driven is what lets you reuse the same sign-up form on
the marketing site and inside the app, and render it in Storybook with fake data.
The payoff of the whole vocabulary is this predictability: the layer name tells
you the rules, so "where does this belong?" and "may it fetch?" stop being
debates. The atom-boundaries exercise makes you place components on this ladder
and defend the placement, which is the skill the names exist to support.
