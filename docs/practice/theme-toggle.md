---
title: Build a theme toggle with no flash
layout: question
slug: theme-toggle
format: ui-coding
difficulty: easy
layer: ui
topics: [theme, attributes, dom]
skill: ui-theme
minutes: 25
frameworks: [react, wc]
summary: Respect the system theme, remember an override, and never show the wrong colours before hydration.
---

Build a theme toggle that cycles system → light → dark.

- With no stored preference, follow `prefers-color-scheme` and keep following it
  when the OS setting changes.
- An explicit choice is remembered and stops tracking the system.
- The page must **never paint the wrong theme first**, even for one frame.
- The control announces its current state to a screen reader.
- Blocked or unavailable storage must degrade, not throw.

Starter files are in `practice/workspace/theme-toggle/<framework>/`.

## Solution

### Approach 1: a blocking inline script, then a component

The flash is not a component problem. By the time your framework mounts, the
browser has already painted, so the fix has to run before first paint:

```html
<!-- in <head>, inline, not deferred -->
<script>
  (function () {
    try {
      var stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") {
        document.documentElement.dataset.theme = stored;
      }
    } catch (e) { /* blocked storage: fall through to the media query */ }
  })();
</script>
```

CSS then defines dark under `@media (prefers-color-scheme: dark)` guarded so an
explicit light choice wins, and again under `[data-theme="dark"]`. The component
only writes `documentElement.dataset.theme` and the stored value; it is never
the thing that decides the first paint.

This is a handful of bytes that must be inline and synchronous. Moving it to an
external file or adding `defer` puts the paint back in front of it and the flash
returns.

### Approach 2: `color-scheme` plus a CSS-only default

```css
:root { color-scheme: light dark; }
:root[data-theme="light"] { color-scheme: light; }
:root[data-theme="dark"]  { color-scheme: dark; }
```

With `light-dark()` for colour values, the system case needs no JavaScript at
all — the browser picks, form controls and scrollbars follow, and the inline
script shrinks to handling only the explicit override. Less code and a hard
floor on browser support, which is the trade.

## Trade-offs

**Three states, not two.** A boolean toggle cannot express "follow the system",
so the first time the user's OS switches to dark at sunset, your app does not.
Cycling through three is one extra branch and it is what users expect from
every OS-level setting.

**Announcing the state.** A button labelled with an icon tells a screen reader
nothing. Either give it `aria-label="Theme: dark"` updated on change, or use
`aria-pressed` on a two-state control — but not both, and not a `role="switch"`
for a three-state cycle, which cannot represent "system".

**`matchMedia` listener lifetime.** While following the system you must listen
for changes and stop listening once the user chooses explicitly, or a later OS
switch will fight the stored preference. This is the bug that shows up as
"the theme changed by itself at 6pm".

**Storage is optional.** Private mode, blocked site data and quota errors all
throw on `localStorage`. Wrap every read and write; the toggle should still work
for the session when persistence does not.

## Related

- Reading: [Theme](../ui/theme.html) · [Attributes](../ui/attributes.html) · [DOM](../ui/dom.html)
- Agent Skill: `ui-theme`
