---
title: "Hydration is the handoff from server HTML to a live app"
layout: post
slug: hydration-is-the-handoff
date: 2026-08-18
author: The Elegant team
category: architecture
tags: [server, ssr, hydration, performance]
description: 'Hydration is the moment server-rendered HTML becomes interactive, when the client JavaScript attaches to the existing markup. It is also where a whole class of subtle SSR bugs and performance costs live.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 6
related_practice: [render-strategy-choice, counter-component]
---

Server-side rendering gives the user HTML they can see immediately, but that HTML
is inert — the buttons do nothing, because the event handlers live in JavaScript
that has not run yet. **Hydration** is the handoff that fixes that: the client
bundle downloads, re-runs your components, walks the server-rendered DOM, and
attaches the event listeners and state to the markup that is already there. It is
the bridge between "looks ready" and "is ready," and it is also where a specific,
frustrating class of SSR bugs and costs live — because the client's render has to
*agree* with the server's, exactly.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 200" role="img" aria-labelledby="hy-t hy-d" class="blog-figure__svg">
  <title id="hy-t">Server HTML is visible but inert until client JS hydrates it into a live app</title>
  <desc id="hy-d">Server-rendered HTML is shown as visible but with dead buttons. The client bundle arrives and attaches handlers and state, turning the same DOM interactive. A gap between visible and interactive is marked.</desc>
  <rect x="30" y="70" width="150" height="60" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="105" y="95" text-anchor="middle" fill="#c2571a" font-size="11">server HTML</text><text x="105" y="114" text-anchor="middle" fill="#819198" font-size="9">visible, inert</text>
  <path d="M180 100 L270 100" stroke="#157878" stroke-width="2.5" marker-end="url(#hy-a)"/><text x="225" y="88" text-anchor="middle" fill="#157878" font-size="10" font-weight="700">hydrate</text><text x="225" y="120" text-anchor="middle" fill="#819198" font-size="9">attach handlers</text>
  <rect x="270" y="70" width="150" height="60" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="345" y="95" text-anchor="middle" fill="#157878" font-size="11">live app</text><text x="345" y="114" text-anchor="middle" fill="#819198" font-size="9">interactive</text>
  <rect x="450" y="60" width="160" height="80" rx="8" fill="none" stroke="#c2571a" stroke-width="1.5" stroke-dasharray="4 3"/><text x="530" y="90" text-anchor="middle" fill="#c2571a" font-size="10" font-weight="700">the gap</text><text x="530" y="110" text-anchor="middle" fill="#819198" font-size="9">looks ready,</text><text x="530" y="124" text-anchor="middle" fill="#819198" font-size="9">clicks are dropped</text>
  <defs><marker id="hy-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#157878"/></marker></defs>
</svg>
<figcaption>Hydration adopts the existing DOM rather than rebuilding it. Between paint and hydration the page looks live but is not — the gap where clicks vanish.</figcaption>
</figure>

## Hydrate adopts the DOM; it does not rebuild it

The API difference is the whole idea. A pure client app *creates* the DOM; an SSR
app *hydrates* the DOM the server already sent. Use the wrong one and React throws
away the server HTML and re-renders from scratch, discarding the SSR benefit:

```jsx
// SSR client entry: attach to existing markup — do NOT recreate it
import { hydrateRoot } from "react-dom/client";
hydrateRoot(document.getElementById("root"), <App />);   // adopts server DOM

// this would discard the server HTML and rebuild — wrong for SSR
// createRoot(root).render(<App />);
```

## The mismatch bug: server and client must agree

Hydration assumes the client's first render produces the *same* markup the server
produced. If it does not — because you rendered the current time, a random value,
or something that reads `window` — React sees a mismatch, warns, and may discard
the server tree. The fix is to make the first client render deterministic and
defer the browser-only value to *after* hydration:

```jsx
function Clock() {
  const [now, setNow] = useState(null);          // same on server and first client render
  useEffect(() => { setNow(new Date()); }, []);  // browser-only value AFTER hydration
  return <span>{now ? now.toLocaleTimeString() : "—"}</span>;  // no mismatch
}
```

The rule of thumb: anything that differs between server and browser (time, random,
`localStorage`, viewport size) belongs in an effect, not in the render path.

## Hydration is not free, hence the newer strategies

Even when it works, hydration costs: the client re-runs the whole component tree
to attach handlers, so a large page pays a CPU bill right when the user wants to
interact — the visible-but-not-interactive gap. That cost is exactly what the
newer rendering strategies attack: **partial / progressive hydration** hydrates
only the interactive islands and leaves static content alone; **streaming SSR**
sends and hydrates the page in chunks so the top is live while the bottom is still
arriving; server components push work off the client entirely. All of them are
answers to the same question — how do we keep SSR's fast first paint without
paying to hydrate everything at once. Understanding plain hydration first is what
makes those optimisations legible rather than magic. The render-strategy-choice
exercise is where the trade between first paint and time-to-interactive becomes a
concrete decision.
