---
title: "Composition beats configuration when a component grows props"
slug: composition-over-configuration
layout: post
date: 2026-07-04
author: The Elegant team
category: architecture
tags: [ui, components, api-design, composition]
description: 'When a component sprouts a dozen boolean props to cover every variation, the fix is usually not another prop — it is letting the caller compose the pieces. Configuration scales to a point; composition scales past it.'
cover: /assets/img/atomic-design.png
reading_minutes: 6
related_practice: [tabs-molecule, form-field-molecule]
---

Watch a component age and you will see the same pattern: it starts with two props,
then grows `showIcon`, `iconPosition`, `hideFooter`, `variant`, `dense`,
`withDivider` — a boolean for every variation anyone ever needed. Each addition is
individually reasonable and the sum is a component nobody can use without reading
its source. This is the configuration trap, and the way out is almost never
another prop. It is **composition**: instead of a flag that toggles a piece,
expose the pieces and let the caller assemble them. Configuration scales to a
handful of variations; composition scales to variations you never anticipated.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 200" role="img" aria-labelledby="co-t co-d" class="blog-figure__svg">
  <title id="co-t">A configuration component grows props; a composition component exposes slots</title>
  <desc id="co-d">Left: one Card component with a growing list of boolean props. Right: a Card exposing Header, Body and Footer slots the caller composes freely.</desc>
  <text x="150" y="26" text-anchor="middle" fill="#c2571a" font-size="11" font-weight="700">configuration</text>
  <rect x="70" y="40" width="160" height="120" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="150" y="62" text-anchor="middle" fill="#c2571a" font-size="10">&lt;Card</text>
  <g fill="#819198" font-size="9" text-anchor="middle"><text x="150" y="80">showIcon</text><text x="150" y="95">hideFooter</text><text x="150" y="110">dense</text><text x="150" y="125">withDivider</text><text x="150" y="140">variant…</text></g>
  <line x1="320" y1="26" x2="320" y2="185" stroke="#dce6f0"/>
  <text x="480" y="26" text-anchor="middle" fill="#157878" font-size="11" font-weight="700">composition</text>
  <rect x="400" y="40" width="160" height="120" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/>
  <g fill="#fff" stroke="#157878" stroke-width="1.5" font-size="9" text-anchor="middle"><rect x="415" y="52" width="130" height="26" rx="4" fill="#f3f6fa"/><text x="480" y="69" fill="#157878">Card.Header</text><rect x="415" y="84" width="130" height="34" rx="4" fill="#f3f6fa"/><text x="480" y="105" fill="#157878">Card.Body</text><rect x="415" y="124" width="130" height="26" rx="4" fill="#f3f6fa"/><text x="480" y="141" fill="#157878">Card.Footer</text></g>
</svg>
<figcaption>Configuration answers every variation with a flag inside the component; composition hands the caller the pieces and gets out of the way.</figcaption>
</figure>

## The configuration version collapses under its own props

Here is the component two years in. Every branch is a variation someone needed, and
the caller has to know all of them to predict what renders:

```jsx
// the caller can't tell what this renders without reading Card's source
function Card({ title, body, showIcon, icon, hideFooter, footerText, dense, variant }) {
  return (
    <div className={`card card--${variant} ${dense ? "card--dense" : ""}`}>
      <h3>{showIcon && <Icon name={icon} />}{title}</h3>
      <p>{body}</p>
      {!hideFooter && <footer>{footerText}</footer>}
    </div>
  );
}
```

Adding one more variation means one more prop and one more branch — forever.

## The composition version hands over the pieces

Expose the structure as sub-components (or `children`) and let the caller decide
what goes where. The `Card` stops deciding and starts *containing*:

```jsx
// Card provides structure; the caller composes the content it wants
function Card({ children }) { return <div className="card">{children}</div>; }
Card.Header = ({ children }) => <h3 className="card__header">{children}</h3>;
Card.Body   = ({ children }) => <div className="card__body">{children}</div>;
Card.Footer = ({ children }) => <footer className="card__footer">{children}</footer>;

// the caller assembles exactly what THIS card needs — no flags, no source-diving
<Card>
  <Card.Header><Icon name="star" /> Featured</Card.Header>
  <Card.Body>{body}</Card.Body>
  {/* no footer? just don't include one — no `hideFooter` prop needed */}
</Card>
```

"No footer" is expressed by *not writing one*, not by a `hideFooter={true}`. A new
variation is a new arrangement of existing pieces, requiring no change to `Card` at
all.

## Configuration still wins for the constrained cases

This is a bias, not an absolute. Configuration is right when the set of variations
is small, closed, and you *want* to constrain callers — a `Button` with
`variant="primary" | "secondary"` should not let callers compose arbitrary
internals, because the whole point is consistency. Composition is right when the
variations are open-ended and callers legitimately need to arrange the parts:
layouts, cards, lists, tables, anything "container-like." The tell that you have
picked wrong is a boolean prop that only exists to hide or show a chunk of markup —
that is composition asking to be let out. The tabs-molecule and form-field-molecule
exercises are good places to feel the line: a tab set is naturally composed
(arbitrary panels), while a form field is naturally configured (a fixed
label/input/error shape). Choosing correctly per component is the API-design skill
the whole atomic-design vocabulary is in service of.
