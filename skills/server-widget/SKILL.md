---
name: server-widget
description: Embeddable widgets — a tiny async loader snippet, Shadow DOM vs iframe isolation, origin-validated `postMessage` protocols, iframe height negotiation with `ResizeObserver`, container-query responsiveness, bundle budgets with lazy features, and a versioned public API with deprecation shims. Use when packaging UI to run inside someone else's page, writing the embed snippet, or debugging style/global leakage between widget and host.
when_to_use: Packaging a component as a self-contained embed for third-party sites; choosing Shadow DOM vs iframe isolation; designing the loader snippet and its early-call queue; wiring bidirectional postMessage with origin checks; sizing an iframe to its content; keeping widget CSS and globals from leaking into the host; versioning a public embed API without breaking existing installs.
paths:
  - "**/widget/**/*.{js,ts,jsx,tsx}"
  - "**/*widget*.{js,ts,jsx,tsx}"
  - "**/embed/**/*.{js,ts,html}"
---

# Widget

## What is a Widget?

A widget is a self-contained UI unit that runs inside a page you don't control. The host may be jQuery, Angular, or hand-written PHP output; its CSS may be hostile; its globals may collide with yours. So a widget owns its own rendering context, loads asynchronously, communicates over a narrow declared protocol, and exposes a versioned public API — because you can never force 10,000 hosts to update their embed snippet.

## Key Principles

1. **Isolation Is the Product**: Style and script encapsulation is what makes an embed safe to install. Shadow DOM gives CSS/DOM encapsulation cheaply and stays in the host's document; an iframe gives a separate origin, global scope, and CSS cascade at the cost of height negotiation and SEO invisibility.

2. **Never Block the Host**: The loader is a few KB, `async`, and appends the real bundle itself. A widget that delays the host's first paint gets uninstalled.

3. **Every Message Has an Origin Check**: `postMessage` is a public mailbox. Validate `event.origin` against an allowlist before touching `event.data`, and post to an explicit target origin rather than `"*"` when the target is known.

4. **A Narrow, Versioned Contract**: Config in (data attributes or an `init` object), events out (callbacks or `postMessage`). That surface is your API — semver it, keep old major versions serving, and shim deprecated entry points.

5. **Nothing Leaks Either Way**: No globals beyond one namespace, no bare selectors on `document`, no `!important` sprays into the host — and no assumption that the host's reset, font size, or box-sizing matches yours.

## Best Practices

✅ **DO**:
- Ship a <5KB `async` loader that bootstraps the real bundle and supports multiple instances
- Queue early API calls (`window.MyWidget = window.MyWidget || []`) and drain them on load
- Render into a shadow root (or iframe) and inline critical styles inside it
- Validate `event.origin` on every `message` listener, on both sides
- Size layout with container queries or `ResizeObserver`, never viewport media queries
- Pin an explicit major version in the embed URL (`/v1/widget.js`) with immutable, hashed assets

❌ **DON'T**:
- Assign anything to the global scope beyond one namespaced object
- Assume the host is on your framework version — or that it has your framework at all
- Post messages to `"*"` when carrying tokens or user data
- Let the initial bundle grow past its budget; lazy-load secondary features
- Rely on host page CSS (or fight it with `!important`)
- Break old embeds; deprecate with warnings and a compatibility shim instead

## Code Patterns

### Loader Snippet with an Early-Call Queue

```html
<div data-my-widget="widget-123" data-theme="dark" data-locale="en"></div>
<script src="https://cdn.example.com/v1/loader.js" async></script>
```

```javascript
(function () {
  "use strict";
  window.MyWidget = window.MyWidget || [];          // calls made before load are queued
  document.querySelectorAll("[data-my-widget]").forEach((host) => {
    const root = host.attachShadow({ mode: "open" }); // styles cannot leak either way
    const s = document.createElement("script");
    s.src = "https://cdn.example.com/v1/widget.js";
    s.async = true;                                   // never block host render
    s.onload = () => window.MyWidgetApp.init({
      root,
      widgetId: host.dataset.myWidget,
      theme: host.dataset.theme || "light",
      locale: host.dataset.locale || "en",
    });
    document.head.appendChild(s);
  });
})();
```

### Origin-Validated `postMessage` Protocol

```javascript
const WIDGET_ORIGIN = "https://widget.example.com";

// Host side
window.addEventListener("message", (event) => {
  if (event.origin !== WIDGET_ORIGIN) return;             // CRITICAL — do this first
  const { type, payload } = event.data ?? {};
  if (type === "resize") iframe.style.height = `${payload.height}px`;
  if (type === "event") onWidgetEvent?.(payload);
});

// Widget side, inside the iframe
const send = (type, payload) => window.parent.postMessage({ type, payload }, hostOrigin);
new ResizeObserver(() => send("resize", { height: document.body.scrollHeight }))
  .observe(document.body);
```

An iframe cannot size itself to its content — height is always negotiated over the channel.

### Container-Relative Responsiveness

```css
.widget-host { container-type: inline-size; container-name: widget; }

@container widget (max-width: 400px) { .widget { flex-direction: column; } }
@container widget (min-width: 700px) { .widget { flex-direction: row; gap: 1.5rem; } }
```

The widget may land in a 250px sidebar or 1200px main column; viewport media queries tell you nothing about that. Fall back to `ResizeObserver` setting `data-breakpoint` where container queries aren't available.

### Versioned Public API with a Shim

```javascript
window.MyWidget = {
  init(config) { /* v2 */ },
  initialize(options) {                       // v1 entry point, kept alive
    console.warn("MyWidget.initialize() is deprecated; use init()");
    return this.init({ widgetId: options.id, theme: options.color === "blue" ? "light" : "dark" });
  },
  destroy(id) { /* tear down listeners, timers, observers, sockets */ },
};
```

`/v1/widget.js` keeps serving the latest 1.x forever; breaking changes ship as `/v2/`.

### In the elegant templates

**No template ships an embeddable widget build** — these are Vite SPAs that mount into their own `index.html`, with no loader script, no iframe embed, and no shadow-root entry point. Two facts are still directly relevant.

First, `chota-react-saga` already has the extension seam a host-injectable UI needs. `src/utils/providers/AtomicProvider.jsx` accepts `components` and `modules` props and exposes them (plus `theme`) via context:

```jsx
const AtomicProvider = ({ children, components, modules }) => {
  const theme = useSelector((state) => state.config.theme);
  return <atomicContext.Provider value={{ components, modules, children, theme }}>{children}</atomicContext.Provider>;
};
export const useAtomicContext = () => { /* returns { theme, components, modules } */ };
```

`App.jsx` passes `components={{}} modules={{}}` today, and `IconButton.component.jsx` consumes only `theme` — so the injection points exist but are unused. That is the hook for swapping in host-supplied UI without touching `src/ui/**`, which stays purely presentational (props in, events out).

Second, `chota-wc-saga` is built on Lit custom elements (`customElements.define("app-site-header", component(SiteHeader))`, with styles applied through `useComputedStyles`/constructable stylesheets). Custom elements plus shadow DOM are the natural packaging technology for a widget, which makes that template the shortest path from this repo to a real embed. For the multi-team, independently-deployable variant of the same problem — shell plus remotes, shared runtimes, versioned contracts — see the **server-mfe** skill.

## Related Terminologies

- **MFE** (Server) - Same isolation problem, scoped to internal teams and independent deploys
- **Element** (UI) - Custom elements + shadow DOM are the widget encapsulation primitive
- **Theme** (UI) - Hosts theme widgets via data attributes or CSS custom properties
- **Protocol** (Server) - The `postMessage` message schema is a versioned protocol
- **Authentication** (Server) - Short-lived embed tokens exchanged for a widget session
- **Localization** (Server) - `data-locale` selects the widget's catalogue and direction

## Quality Gates

- [ ] Loader is async, tiny, and supports multiple instances on one page
- [ ] Rendering happens in a shadow root or iframe; no styles leak either direction
- [ ] Exactly one global namespace is introduced
- [ ] Every `message` handler validates `event.origin` before reading `event.data`
- [ ] Layout responds to container width, not viewport width
- [ ] Public API is versioned, and `destroy()` removes listeners, timers, and observers

**Source**: `/docs/server/widget.md`
