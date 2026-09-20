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
reading_minutes: 4
related_practice: [theme-toggle, loading-button-atom]
---

Web components are the browser's built-in way to define your own reusable elements —
`<my-widget>` that works in any page, framework or not, because the platform itself
understands it. They are not a framework and will not replace React or Vue for app
building, but they occupy a real niche: UI that must outlive framework churn or work
across teams using different frameworks. Knowing what they are and are not saves you
from both over- and under-using them.

## Three technologies, one idea

Web components are three browser features working together. **Custom elements** let
you register a tag name backed by a class with lifecycle callbacks (connected,
disconnected, attribute-changed), so `<my-widget>` becomes a real element. **Shadow
DOM** gives that element an encapsulated internal tree with scoped styles — the
component's CSS cannot leak out and the page's cannot leak in, which solves the
style-collision problem that plagues shared components. **HTML templates**
(`<template>`) provide inert markup you clone to build the shadow tree. Together they
let you ship a self-contained element the browser renders natively.

## The killer feature: framework independence

The reason to reach for web components is that they are framework-agnostic. A design
system built as web components can be dropped into a React app, a Vue app, a plain
HTML page, or next year's framework, unchanged — because the consumer is just using
an HTML element. For a large organization with multiple frameworks, or a component
library meant to outlive any single framework choice, that portability is genuinely
valuable and hard to get any other way. The encapsulation is a real bonus:
shadow-DOM styles will not be broken by the host page.

## Where they fall short

Web components are not a great fit for building a whole application. Their
ergonomics for complex state, data flow, and composition are weaker than a mature
framework's; server-side rendering and hydration are more awkward; and passing rich
data (objects, not just string attributes) and wiring events across the boundary
takes care. So the honest positioning is: web components for *distributable,
long-lived, cross-framework components* (a design system, an embeddable widget), and
your framework of choice for *application logic and composition*. Trying to build an
app entirely from hand-written web components usually reinvents a framework, badly.

## The interop reality

In practice the two coexist: many teams author a design system as web components and
consume it from framework apps, or use a light library that gives web components
better ergonomics. Frameworks have improved at interoperating with custom elements
(passing properties, handling events), though it still requires attention. The
mental model to keep: web components are a *platform primitive for reusable
elements*, strongest at the distribution boundary and weakest as an app framework.
The theme-toggle and loading-button exercises are the kind of small, self-contained,
reusable component that maps naturally onto a web component — and the shadow DOM that
scopes their styles is the same one covered in the DOM terminology post.
