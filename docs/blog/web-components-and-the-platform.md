---
title: "Web components are the platform's answer to reusable UI"
slug: web-components-and-the-platform
layout: post
date: 2026-06-27
author: The Elegant team
category: terminology
tags: [ui, web-components, platform, shadow-dom]
description: 'Custom elements, shadow DOM, and templates let you build framework-agnostic components the browser understands natively. They will not replace your framework, but they are the right tool for cross-framework, long-lived UI.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 5
related_practice: [theme-toggle, loading-button-atom]
---

Web components are the browser's own answer to "reusable UI component," and they
predate needing a framework for it. Three platform features combine: **custom
elements** (define your own HTML tag with behaviour), **shadow DOM** (encapsulate its
markup and styles so nothing leaks in or out), and **templates** (declare reusable
markup). Together they let you ship a `<my-widget>` that any page — React, Vue,
Angular, or plain HTML — can use, because the browser understands it natively. They
will not replace your framework for building a whole app, but for **cross-framework,
long-lived UI** — a design system consumed by many teams on many stacks — they are
exactly the right tool, precisely because they belong to the platform and not to a
framework that will change.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 190" role="img" aria-labelledby="wc-t wc-d" class="blog-figure__svg">
  <title id="wc-t">One custom element with encapsulated shadow DOM works in any framework</title>
  <desc id="wc-d">A single custom element defined once, consumed unchanged by a React app, a Vue app, and a plain HTML page, with its shadow DOM encapsulating its internals.</desc>
  <rect x="240" y="30" width="160" height="50" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="320" y="52" text-anchor="middle" fill="#157878" font-size="10" font-weight="700">&lt;my-button&gt;</text><text x="320" y="68" text-anchor="middle" fill="#819198" font-size="8">custom element + shadow DOM</text>
  <g stroke="#819198" stroke-width="2" marker-end="url(#wc-a)"><path d="M280 80 L150 120"/><path d="M320 80 L320 120"/><path d="M360 80 L490 120"/></g>
  <g font-size="9" text-anchor="middle" fill="#155799">
    <rect x="80" y="122" width="140" height="40" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="150" y="146">React app</text>
    <rect x="250" y="122" width="140" height="40" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="320" y="146">Vue app</text>
    <rect x="420" y="122" width="140" height="40" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="490" y="146">plain HTML</text>
  </g>
  <defs><marker id="wc-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Define the element once; every framework consumes the same tag. Its shadow DOM seals the internals so no consumer's CSS leaks in and its styles don't leak out.</figcaption>
</figure>

## A custom element is a tag the browser understands

You extend `HTMLElement`, define lifecycle callbacks, and register a tag name. From
then on `<my-button>` works in any HTML, no import, no framework:

```js
class MyButton extends HTMLElement {
  connectedCallback() {                    // lifecycle: when it enters the DOM
    const shadow = this.attachShadow({ mode: "open" });   // encapsulation boundary
    shadow.innerHTML = `
      <style>button { background: var(--brand, #fe854c); }</style>
      <button><slot></slot></button>`;     // <slot> projects the consumer's content
  }
}
customElements.define("my-button", MyButton);   // now <my-button> is a real tag
```

The shadow DOM is the key move: styles inside it do not leak out, and the page's CSS
does not leak in, so the component looks the same wherever it is dropped.

## Style seams: parts and custom properties

Encapsulation would be a prison if consumers could not theme the component, so the
platform provides deliberate seams. `var(--brand)` above lets a consumer set a custom
property that pierces the shadow boundary; `::part()` lets them style specific
internals you expose:

```css
/* the consuming page themes the encapsulated component through the seams you allow */
my-button { --brand: #157878; }          /* custom property crosses the boundary */
my-button::part(label) { font-weight: 700; }   /* style a part the element exposed */
```

You choose exactly what is themeable — encapsulation by default, customization by
opt-in.

## Where web components fit, and where they don't

Be honest about the trade. Web components are the right tool for a **design system or
widget shared across frameworks and meant to outlive any one of them** — a component
library a big org's many stacks all consume, an embeddable widget, anything that must
work in a page you do not control. They are a *poor* fit for building a whole
application's view layer: they lack the ergonomics, state management, and rich
ecosystem a framework gives, and reinventing those on top of raw custom elements is a
lot of work (which is why Lit and similar exist to smooth it). So the pattern is
usually **web components for the shared, long-lived, cross-framework pieces; a
framework for the app that assembles them**. Their superpower is belonging to the
platform, which means they cannot be deprecated by a framework's next major version.
The theme-toggle and loading-button-atom exercises are natural web-component shapes —
small, reusable, themeable through the seams — and good places to feel where the
platform's own components shine.
