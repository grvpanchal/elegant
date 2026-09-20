---
title: "Error boundaries stop one broken component from blanking the page"
layout: post
slug: error-boundaries-catch-render-crashes
date: 2026-07-07
author: The Elegant team
category: terminology
tags: [ui, react, error-handling, resilience]
description: 'Without an error boundary, one component throwing during render takes the whole app down to a blank screen. A boundary catches the crash, shows a fallback for that subtree, and keeps the rest of the app alive.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 5
related_practice: [toast-notifications, retry-with-backoff]
---

In a component tree, an uncaught error thrown during render is fatal by default:
React unmounts the *entire* tree rather than show a half-broken UI, so one
component reading `user.name` when `user` is `null` blanks the whole page. An
**error boundary** is the seam that stops the blast radius at a subtree. It catches
a render-time crash below it, shows a fallback in place of the broken part, and
leaves the rest of the app — the nav, the sidebar, the other panels — alive and
interactive. Placing boundaries well is the difference between "one widget failed"
and "the app is down."

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 210" role="img" aria-labelledby="eb-t eb-d" class="blog-figure__svg">
  <title id="eb-t">Without a boundary a throw blanks the app; with one it is contained to a subtree</title>
  <desc id="eb-d">Left: a component throws and the whole app tree goes blank. Right: an error boundary around one panel catches the throw and shows a fallback while siblings stay alive.</desc>
  <text x="150" y="26" text-anchor="middle" fill="#c2571a" font-size="11" font-weight="700">no boundary</text>
  <rect x="60" y="40" width="180" height="120" rx="8" fill="#f3f6fa" stroke="#c2571a" stroke-width="2.5" stroke-dasharray="5 4"/><text x="150" y="95" text-anchor="middle" fill="#c2571a" font-size="10">whole app</text><text x="150" y="115" text-anchor="middle" fill="#c2571a" font-size="10">blank ✗</text>
  <line x1="330" y1="20" x2="330" y2="190" stroke="#dce6f0"/>
  <text x="480" y="26" text-anchor="middle" fill="#157878" font-size="11" font-weight="700">with a boundary</text>
  <rect x="390" y="40" width="200" height="140" rx="8" fill="none" stroke="#155799" stroke-width="2"/><text x="490" y="34" text-anchor="middle" fill="#155799" font-size="9">app (alive)</text>
  <rect x="405" y="55" width="80" height="50" rx="5" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="445" y="84" text-anchor="middle" fill="#157878" font-size="9">nav ✓</text>
  <rect x="495" y="55" width="80" height="50" rx="5" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="535" y="84" text-anchor="middle" fill="#157878" font-size="9">list ✓</text>
  <rect x="430" y="115" width="120" height="52" rx="5" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="490" y="138" text-anchor="middle" fill="#c2571a" font-size="9">boundary:</text><text x="490" y="153" text-anchor="middle" fill="#c2571a" font-size="9">fallback shown</text>
</svg>
<figcaption>An unhandled throw takes the whole tree down (left). A boundary around the risky panel contains it, and the siblings keep working (right).</figcaption>
</figure>

## A boundary is a component that catches its children's throws

Error boundaries are a class component (the one place React still needs one),
because they use two lifecycle hooks: one to render a fallback, one to report the
error. Below it, any render-time throw is caught:

```jsx
class ErrorBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };            // switch to the fallback UI
  }
  componentDidCatch(error, info) {
    reportToService(error, info);       // log it where you can see it
  }
  render() {
    return this.state.failed
      ? this.props.fallback
      : this.props.children;
  }
}
```

Wrap a risky subtree and its crash becomes a contained fallback:

```jsx
<ErrorBoundary fallback={<p>This panel failed to load.</p>}>
  <RevenueChart />     {/* if this throws, only this panel shows the fallback */}
</ErrorBoundary>
```

## Place boundaries at meaningful seams

Where you put boundaries is a design decision about blast radius. One boundary at
the very top turns a crash into a whole-app fallback — better than a blank page,
but coarse. Boundaries around each independent region — a dashboard's widgets, a
feed's items, a route — mean a failure in one leaves the others fully usable:

```jsx
<Dashboard>
  <ErrorBoundary fallback={<WidgetError />}><Revenue /></ErrorBoundary>
  <ErrorBoundary fallback={<WidgetError />}><Traffic /></ErrorBoundary>
</Dashboard>
{/* Revenue crashing does not touch Traffic */}
```

## Know what a boundary does not catch

The important limitation: boundaries catch errors during **rendering, lifecycle,
and constructors** of the components below them. They do *not* catch errors in
event handlers, in async code (`setTimeout`, promises, `fetch` callbacks), or in
the boundary's own render — because those do not happen during React's render pass.
An error in an `onClick` you handle with a plain `try/catch` and, say, a toast; a
failed fetch you handle with the request/success/fail state and an error UI. So the
full resilience story is two-layered: boundaries for the render-path crashes that
would otherwise blank the tree, and ordinary error handling for the async and
event-driven failures that a boundary never sees. The toast-notifications and
retry-with-backoff exercises cover that second layer — the errors boundaries leave
for you — which together with a well-placed boundary is what keeps an app standing
when something inevitably throws.
