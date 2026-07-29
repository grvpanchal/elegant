---
name: ui-rwd
description: Responsive Web Design — mobile-first `min-width` media queries, fluid grids and `max-width` containers, flexible images, the viewport meta tag, content-driven breakpoints, relative units and `clamp()` fluid typography, flexbox vs grid vs container queries, and keeping breakpoint decisions at the organism layer. Use when writing component CSS, adding breakpoints, fixing horizontal scroll on small screens, or making a component adapt to its container.
when_to_use: Writing or reviewing component stylesheets and layout CSS; converting desktop-first `max-width` queries to mobile-first; choosing where to put a breakpoint; replacing fixed pixel widths that cause horizontal scrolling; adding fluid typography with `clamp()`; deciding between media queries and container queries for a reusable component; verifying the viewport meta tag and image flexibility.
paths:
  - "**/ui/**/*.style.{css,scss}"
  - "**/ui/theme.css"
  - "**/{index,App}.{css,html}"
---

# Responsive Web Design

## What is Responsive Web Design?

RWD is building *one* flexible site that adapts to any viewport rather than separate mobile and desktop builds. Its three classic pillars are fluid grids (percentage/fraction widths, not fixed pixels), flexible media (`max-width: 100%`), and media queries that layer on styles at chosen widths. Mobile-first inverts the old order: the smallest layout is the default, and `min-width` queries add complexity as space appears — which ships less baseline CSS and forces a real content hierarchy.

## Key Principles

1. **Mobile-First, `min-width` Only**: Write the single-column, small-screen layout as unqualified CSS, then enhance upward. Desktop-first `max-width` chains mean mobile devices parse and override styles they will never use.

2. **Content-Driven Breakpoints**: Add a breakpoint at the width where *this* layout starts to break, not at an iPhone or iPad dimension. Device widths churn every year; "the headline wraps badly below 640px" stays true.

3. **Think in Relative Units**: `rem`/`em` for type and spacing, `%`/`fr`/`minmax()` for tracks, `vw`/`vh` sparingly, `clamp()` when you want smooth interpolation with accessible bounds. Fixed pixel widths are the single most common cause of horizontal scroll.

## Best Practices

✅ **DO**:
- Ship `<meta name="viewport" content="width=device-width, initial-scale=1" />`
- Prefer `max-width` + `width: 100%` over a hard `width`
- Give images `max-width: 100%; height: auto` (plus intrinsic `width`/`height`)
- Use `clamp()` for fluid type and spacing instead of per-breakpoint overrides
- Drive breakpoint values from design tokens/custom properties
- Reach for container queries when a component must adapt to its slot, not the viewport

❌ **DON'T**:
- Write a breakpoint per device model
- Start desktop-first and strip back with `max-width`
- Set fixed pixel widths on layout containers
- Hide content on mobile that mobile users still need
- Let atoms or molecules own breakpoint logic (that belongs to organisms/templates)
- Use `100vh` for full-height mobile layouts without a `dvh` fallback

## Code Patterns

### Mobile-First Media Queries

```css
/* Default = smallest screen */
.grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
.sidebar { display: none; }

@media (min-width: 40em) {          /* content needs two columns */
  .grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 64em) {          /* room for the sidebar */
  .grid { grid-template-columns: repeat(3, 1fr); gap: 2rem; }
  .sidebar { display: block; }
}
```

Using `em` in the query makes breakpoints respect the user's font size. Note the comments name the *reason*, not the device.

### Fluid Containers and Typography

```css
.container {
  width: 100%;
  max-width: var(--grid-maxWidth);   /* cap, don't fix */
  margin-inline: auto;
  padding-inline: 1rem;
}

h1 { font-size: clamp(1.5rem, 1rem + 2vw, 2.5rem); }
.section { padding-block: clamp(1rem, 4vw, 4rem); }
```

`clamp(min, preferred, max)` interpolates as the viewport grows while guaranteeing the text never becomes unreadably small or absurdly large — one declaration replaces three breakpoint overrides.

### Auto-Responsive Grid Without Breakpoints

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: var(--grid-gutter);
}
```

`auto-fit` + `minmax()` reflows from one column to many with zero media queries — prefer it whenever the layout is "as many equal cards as fit".

### Container Queries for Reusable Components

```css
.card-slot { container-type: inline-size; container-name: card; }

.card { display: grid; grid-template-columns: 1fr; }

@container card (min-width: 25rem) {
  .card { grid-template-columns: 8rem 1fr; }   /* image beside text */
}
```

A media query knows only the viewport, so the same card can't be narrow in a sidebar and wide in a hero. Container queries give atomic-design components genuine component-level responsiveness.

### In the elegant templates

The templates are fluid rather than breakpoint-driven, and it is worth knowing exactly how far that goes before you add CSS:

- `index.html` ships `<meta name="viewport" content="width=device-width, initial-scale=1" />`.
- `src/App.jsx` imports `chota/dist/chota.css`, so the base reset, the `.container` wrapper and chota's flexbox grid/utility classes come from the framework.
- `src/ui/theme.css` defines the design tokens on `:root` in relative units — `--grid-maxWidth: 120rem`, `--grid-gutter: 2rem`, `--font-size: 1.6rem` — plus colour tokens overridden under `body.dark` and an `.sr-only` utility.
- Per-component `*.style.css` files are tiny and use flexbox, e.g. `ui/organisms/SiteHeader/SiteHeader.style.css` is just `.header { padding: 5rem 0 1rem 0; }` and `.header-block { display: flex; justify-content: space-between; }`.

There are **no `@media` or `@container` rules anywhere in the template `src/`** — the todo app is a single narrow column (`ui/templates/Layout/Layout.style.css` caps it with `.layout.container { max-width: 370px; }`), so it never needs a breakpoint. Treat the breakpoint guidance above as the pattern to follow when you add a layout that does. Two rules to keep: put the media/container query in the **organism or template** stylesheet that owns the layout (atoms and molecules stay layout-agnostic per the Organism skill), and express new sizes as tokens in `theme.css` rather than hard-coded pixels.

## Related Terminologies

- **Organism** (UI) - Owns responsive layout decisions for a feature
- **Template** (UI) - Defines the page-level responsive grid
- **Theme** (UI) - Tokens/custom properties hold the responsive scale
- **Images** (Server) - `srcset`/`sizes`/`<picture>` are RWD for bitmaps
- **DOM** (UI) - Viewport meta and root font size set the sizing baseline
- **Accessibility** (UI) - Relative units and reflow at 320px are WCAG requirements

## Quality Gates

- [ ] Viewport meta tag present
- [ ] All media queries are mobile-first (`min-width`)
- [ ] No fixed pixel widths on layout containers; no horizontal scroll at 320px
- [ ] Images constrained with `max-width: 100%`
- [ ] Breakpoints justified by content, and their values come from tokens
- [ ] Breakpoint logic lives in organism/template styles, not atoms or molecules

**Source**: `/docs/ui/rwd.md`
