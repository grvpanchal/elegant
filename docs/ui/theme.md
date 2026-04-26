---
title: Theme
layout: doc
slug: theme
---
# Theme

> - Provides the unique visual style of your site — colors, typography, spacing, motion
> - Codifies brand decisions as design tokens (CSS custom properties) so they live in one place
> - Enables consistent design across the entire application and instant theme switching (light/dark/brand) at runtime

## Key Insight

Themes are systematic design languages implemented through CSS—not just colors, but comprehensive design token systems covering typography, spacing, shadows, and interactions. Modern theming uses CSS custom properties (variables) for runtime flexibility, enabling features like dark mode switching without recompiling stylesheets, while design tokens ensure consistency between designers and developers by codifying design decisions into reusable values.

## Detailed Description

Theme provides the unique visual style of your site — the colors, typography, and spacing that visitors immediately associate with your brand. CSS frameworks offer various theming patterns to customize the look and feel of websites, each with different trade-offs between flexibility, performance, and ease of use.

A well-designed theme system goes beyond simple color swapping. Modern themes implement **design tokens**—named entities that store visual design attributes like colors, fonts, spacing, and animation durations. These tokens create a contract between designers and developers: designers specify `--color-primary: #3b82f6` in design tools, developers reference `var(--color-primary)` in code, and changes propagate consistently across the entire application.

The evolution from preprocessor variables (Sass/Less) to CSS custom properties represents a fundamental shift. Preprocessor variables compile to static values at build time, requiring recompilation for theme changes. CSS custom properties are live values that can change at runtime through JavaScript or media queries, enabling dynamic theming, user preferences, and responsive design systems that adapt to device capabilities.

In the Universal Frontend Architecture, theming intersects with component architecture through **scoped styling**. Web Components use Shadow DOM for style encapsulation, React uses CSS Modules or CSS-in-JS, Vue has scoped styles. Themes must work across these boundaries, typically through:
- Global CSS custom properties that pierce Shadow DOM
- Theme context providers in React/Vue
- Data attributes or class toggling for theme switching

Modern frameworks offer different theming philosophies:

### Theming Patterns

#### Utility-First Approach

Frameworks like Tailwind CSS use a utility-first approach for theming:

- Provides low-level utility classes to build custom designs
- Allows for highly customizable themes directly in HTML
- Enables rapid prototyping and unique designs
- Example: Tailwind CSS[2][10]

#### Component-Based Theming

Frameworks such as Bootstrap and Foundation use pre-designed components:

- Offers ready-to-use UI components with consistent styling
- Allows customization through variables and overrides
- Provides a cohesive look across the entire application
- Examples: Bootstrap, Foundation[1][4]

#### CSS Variables and Custom Properties

Modern frameworks leverage CSS variables for theming:

- Enables easy customization of colors, fonts, and other properties
- Allows for dynamic theme switching
- Supports creating multiple themes with minimal code
- Example: Open Props[10]

#### Preprocessor-Based Theming

Some frameworks use preprocessors like Sass for advanced theming:

- Utilizes variables, mixins, and functions for flexible theming
- Allows for nested rules and modular organization of styles
- Enables creation of complex theme variations
- Example: Bootstrap (with Sass)[1]

#### Classless Theming

Classless CSS themes provide styling without requiring specific classes:

- Applies styles directly to HTML elements
- Offers quick setup for simple projects or prototypes
- Provides a good starting point for custom designs
- Examples: Water.css, awsm.css[9]

#### Theme Switching

Many frameworks support easy theme switching:

- Allows toggling between light and dark modes
- Uses data attributes or CSS classes to apply different themes
- Enables dynamic theme changes based on user preferences
- Example: Primer CSS[8]

By understanding these theming patterns, developers can choose the most suitable CSS framework and theming approach for their projects, balancing customization needs with development speed and consistency.

## Code Examples

### Basic Example: Theme provider across frameworks

Every `chota-*` template ships the same `ui/theme.css` (CSS custom properties on `:root` plus a `body.dark` override). What differs is *how each framework reads the active theme out of state and propagates it to children*. Here are the four flavours, all from the templates.

The shared design tokens (same in every template):

```css
/* templates/chota-*/src/ui/theme.css — identical across all templates */
:root {
  --bg-color: #ffffff;
  --bg-secondary-color: #f3f3f6;
  --color-primary: #3b48a6;
  --color-darkGrey: #3f4144;
  --color-error: #d43939;
  --font-color: #333333;
  /* ...etc */
}

body.dark {
  --bg-color: #000;
  --bg-secondary-color: #131316;
  --font-color: #f5f5f5;
}
```

Each template then provides a thin "theme context" so atoms can react to a theme change without each subscribing to the store directly:

{::nomarkdown}<div class="code-tabs">{:/}

React
{% raw %}
```jsx
// templates/chota-react-redux/src/utils/providers/AtomicProvider.jsx
// React Context wraps the children and pulls `theme` out of the Redux
// store via useSelector. Atoms call useAtomicContext() to read it.
import React, { createContext, useContext } from "react";
import { useSelector } from "react-redux";

const atomicContext = createContext(null);

const AtomicProvider = ({ children, components, modules }) => {
  const theme = useSelector((state) => state.config.theme);
  return (
    <atomicContext.Provider value={{ components, modules, children, theme }}>
      {children}
    </atomicContext.Provider>
  );
};

export const useAtomicContext = () => {
  const ctx = useContext(atomicContext);
  return ctx || { theme: '', components: {}, modules: {} };
};

export default AtomicProvider;
```
{% endraw %}

Angular
```ts
// templates/chota-angular-ngrx/src/app/utils/providers/AtomicService.ts
// Angular wraps the same idea in an Injectable service. Components inject
// it and subscribe to theme$ via the async pipe in templates.
import { Injectable, Optional } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { AppState } from '../../state/index';
import { getTheme } from '../../state/config/config.selectors';

@Injectable({ providedIn: 'root' })
export class AtomicService {
  theme$: Observable<string>;

  constructor(@Optional() private store: Store<AppState>) {
    this.theme$ = this.store ? this.store.select(getTheme) : of('light');
  }
}

// Component usage:
// constructor(public atomic: AtomicService) {}
// <body [class.dark]="(atomic.theme$ | async) === 'dark'">
```

Vue
```ts
// templates/chota-vue-pinia/src/main.ts
// Vue exposes the theme as a global property on the app via
// app.config.globalProperties, backed by a reactive object.
// Components read it via this.$theme (Options API) or inject().
import { createApp, reactive } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './ui/theme.css'

const themeState = reactive({ theme: '' })

const app = createApp(App)

Object.defineProperty(app.config.globalProperties, '$theme', {
  get() { return themeState.theme },
  set(value: string) { themeState.theme = value },
})

app.use(createPinia()).mount('#app')
```

Web Components
```js
// templates/chota-wc-saga/src/utils/theme/hooks/useComputedStyles.js
// The WC template adopts theme tokens via Constructable Stylesheets:
// each component calls useComputedStyles(this, [style]) which adopts
// the shared sheet onto its shadow root (or document) so :root tokens
// resolve correctly inside encapsulated components.
import { useConstructableStylesheets } from "./useConstructableStylesheets";

export default function useComputedStyles(scope, styles, isGlobalAdoptedStyleSheetEnabled = true) {
  useConstructableStylesheets(scope, styles, isGlobalAdoptedStyleSheetEnabled);
}

// In every WC atom:
// import style from './Button.style';
// import useComputedStyles from "../../../utils/theme/hooks/useComputedStyles";
//
// export default function Button(props) {
//   useComputedStyles(this, [style]);
//   // ...
// }
```

{::nomarkdown}</div>{:/}

The CSS tokens are intentionally framework-agnostic — all four templates share the exact same `theme.css` because that's the whole point of CSS custom properties. The differences are purely about *how the active theme name reaches the components*:

- **React** — Context backed by a Redux selector, read via a hook.
- **Angular** — Injectable service backed by an NgRx selector, read via the async pipe.
- **Vue** — global property on the app instance, backed by a Pinia/reactive store, read via `this.$theme`.
- **Web Components** — no provider at all for the theme value (which lives on `body`); instead a hook adopts shared stylesheets so tokens work inside shadow DOM.

Switch the framework, the contract on the *DOM* (a class on `<body>` plus `:root` custom properties) stays the same.

### Practical Example: Dark Mode Toggle with JavaScript

Now zoom out from frameworks: here is the same idea in plain JavaScript so you can see the moving parts (system preference, stored preference, runtime toggle) without any library noise.

```javascript
// theme-switcher.js
class ThemeSwitcher {
  constructor() {
    this.theme = this.getStoredTheme() || this.getSystemTheme();
    this.applyTheme(this.theme);
  }
  
  getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  
  getStoredTheme() {
    return localStorage.getItem('theme');
  }
  
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.theme = theme;
  }
  
  toggle() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }
  
  // Listen for system theme changes
  watchSystemTheme() {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
  }
}

// Initialize
const themeSwitcher = new ThemeSwitcher();
themeSwitcher.watchSystemTheme();

// Toggle button
document.querySelector('#theme-toggle').addEventListener('click', () => {
  themeSwitcher.toggle();
});
```

```html
<!-- theme-toggle-button.html -->
<button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
  <svg class="sun-icon" width="20" height="20" viewBox="0 0 20 20">
    <path d="M10 3V2m0 16v-1m7-7h1M2 10h1m13.071-5.071l.707-.707M4.222 15.778l.707-.707m10.142 0l.707.707M4.222 4.222l.707.707"/>
  </svg>
  <svg class="moon-icon" width="20" height="20" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
  </svg>
</button>

<style>
.theme-toggle {
  background: var(--color-surface);
  border: 1px solid var(--color-text-muted);
  border-radius: var(--radius-md);
  padding: var(--space-sm);
  cursor: pointer;
}

[data-theme="light"] .moon-icon { display: none; }
[data-theme="dark"] .sun-icon { display: none; }
</style>
```

### Advanced Example: Design Token System with Multiple Themes

Once a single light/dark toggle works, the natural next step is *n* themes — light, dark, high-contrast, plus brand themes (Ocean, Forest). The same `var(--token)` consumers stay unchanged; only the root-level token block is swapped:

```css
/* design-tokens.css - Base tokens */
:root {
  /* Base color palette */
  --blue-50: #eff6ff;
  --blue-500: #3b82f6;
  --blue-900: #1e3a8a;
  --purple-50: #faf5ff;
  --purple-500: #8b5cf6;
  --purple-900: #581c87;
  
  /* Semantic tokens - map to palette */
  --color-primary-light: var(--blue-50);
  --color-primary: var(--blue-500);
  --color-primary-dark: var(--blue-900);
}

/* Light theme (default) */
[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
}

/* Dark theme */
[data-theme="dark"] {
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
  --border-color: #374151;
}

/* High contrast theme */
[data-theme="high-contrast"] {
  --bg-primary: #000000;
  --bg-secondary: #1a1a1a;
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --border-color: #ffffff;
  --color-primary: #00ff00;
}

/* Brand themes */
[data-theme="ocean"] {
  --color-primary: #0ea5e9;
  --color-secondary: #06b6d4;
  --bg-primary: #f0f9ff;
  --text-primary: #0c4a6e;
}

[data-theme="forest"] {
  --color-primary: #22c55e;
  --color-secondary: #84cc16;
  --bg-primary: #f0fdf4;
  --text-primary: #14532d;
}
```

React theme provider:

{% raw %}
```jsx
// ThemeProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export const ThemeProvider = ({ children, defaultTheme = 'light' }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || defaultTheme;
  });
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const setCustomTheme = (newTheme) => {
    setTheme(newTheme);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setCustomTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```
{% endraw %}

```jsx
// ThemeSelector.jsx
import React from 'react';
import { useTheme } from './ThemeProvider';

const ThemeSelector = () => {
  const { theme, setCustomTheme } = useTheme();
  
  const themes = [
    { id: 'light', name: 'Light', icon: '☀️' },
    { id: 'dark', name: 'Dark', icon: '🌙' },
    { id: 'ocean', name: 'Ocean', icon: '🌊' },
    { id: 'forest', name: 'Forest', icon: '🌲' },
    { id: 'high-contrast', name: 'High Contrast', icon: '👁️' }
  ];
  
  return (
    <div className="theme-selector">
      <h3>Choose Theme</h3>
      <div className="theme-grid">
        {themes.map(t => (
          <button
            key={t.id}
            onClick={() => setCustomTheme(t.id)}
            className={`theme-option ${theme === t.id ? 'active' : ''}`}
            aria-pressed={theme === t.id}
          >
            <span className="theme-icon">{t.icon}</span>
            <span className="theme-name">{t.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
```

## Common Mistakes

### 1. Hardcoding Colors Instead of Using Tokens
**Mistake:** Using raw color values instead of design tokens.

```css
/* ❌ BAD: Hardcoded colors */
.button {
  background: #3b82f6;  /* What if primary color changes? */
  color: #ffffff;
}

.card {
  background: #f3f4f6;  /* Duplicate color definition */
  border: 1px solid #e5e7eb;
}

/* Dark mode becomes nightmare */
@media (prefers-color-scheme: dark) {
  .button { background: #60a5fa; }  /* Must change everywhere */
  .card { background: #1f2937; border-color: #374151; }
}
```

```css
/* ✅ GOOD: Using design tokens */
:root {
  --color-primary: #3b82f6;
  --color-bg: #ffffff;
  --color-surface: #f3f4f6;
  --color-border: #e5e7eb;
}

[data-theme="dark"] {
  --color-primary: #60a5fa;
  --color-bg: #111827;
  --color-surface: #1f2937;
  --color-border: #374151;
}

.button {
  background: var(--color-primary);
  color: white;
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

/* Theme changes automatically everywhere! */
```

**Why it matters:** Design tokens create single source of truth. When colors change (rebranding, dark mode), update tokens once instead of hundreds of CSS rules.

### 2. Not Considering Accessibility in Themes
**Mistake:** Creating themes with poor contrast or missing accessibility features.

```css
/* ❌ BAD: Poor contrast */
[data-theme="trendy"] {
  --color-bg: #ffcc00;      /* Bright yellow */
  --color-text: #ffffff;    /* White on yellow - fails WCAG */
}

.link {
  color: var(--color-primary);  /* No underline, color-only indication */
}
```

```css
/* ✅ GOOD: Accessible themes */
[data-theme="accessible"] {
  --color-bg: #ffffff;
  --color-text: #000000;       /* 21:1 contrast ratio */
  --color-primary: #0066cc;    /* WCAG AAA compliant */
}

/* Check contrast ratios */
:root {
  --color-primary: #3b82f6;
  --color-text: #111827;
  /* Contrast ratio: 8.59:1 (WCAG AA compliant) */
}

.link {
  color: var(--color-primary);
  text-decoration: underline;  /* Not relying on color alone */
}

.link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

```javascript
// ✅ GOOD: Respect system preferences
const respectMotionPreference = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  document.documentElement.style.setProperty(
    '--transition-duration',
    prefersReducedMotion ? '0ms' : '200ms'
  );
};

respectMotionPreference();
```

**Why it matters:** Themes must be usable by everyone. Poor contrast causes eye strain, color-only indicators exclude colorblind users, and ignoring motion preferences can trigger vestibular disorders.

### 3. Theme Switching Without Transition Management
**Mistake:** Jarring theme switches with flash of unstyled content.

```javascript
// ❌ BAD: Instant switch causes flash
const toggleTheme = () => {
  document.documentElement.setAttribute('data-theme', 
    currentTheme === 'light' ? 'dark' : 'light'
  );
  // Instant switch - all colors change at once, jarring experience
};
```

```css
/* ✅ GOOD: Smooth transitions */
* {
  transition: background-color 0.3s ease, 
              color 0.3s ease, 
              border-color 0.3s ease;
}

/* Disable transitions during theme switch to prevent animation cascade */
.theme-transitioning * {
  transition: none !important;
}
```

```javascript
// ✅ GOOD: Managed theme switching
const toggleTheme = () => {
  // Add transitioning class
  document.documentElement.classList.add('theme-transitioning');
  
  // Switch theme
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  
  // Remove transitioning class after paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('theme-transitioning');
    });
  });
};

// Prevent FOUC (Flash of Unstyled Content) on page load
const initTheme = () => {
  const storedTheme = localStorage.getItem('theme');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? 'dark' 
    : 'light';
  
  // Apply theme before first paint
  document.documentElement.setAttribute('data-theme', storedTheme || systemTheme);
};

// Run immediately (inline script in <head>)
initTheme();
```

**Why it matters:** Good UX requires smooth transitions. Flash of content during theme switch is jarring. Loading with wrong theme then switching causes poor first impression.

## Quick Quiz

{% include quiz.html id="theme-1"
   question="What are design tokens and why are they preferable to hard-coded CSS values?"
   options="A|They are the same as CSS variables in every way;;B|Tokens are only for enterprise apps;;C|Tokens replace the CSS cascade;;D|Design tokens are named, platform-agnostic style primitives (color.brand.primary, space.md, type.heading.lg) defined once and shared across design tools and code — enabling consistency, easy theme changes, platform export (web/iOS/Android), and a shared vocabulary between design and engineering"
   correct="D"
   explanation="Hard-coded values scatter branding decisions everywhere. Tokens centralise them and make rebrands / dark mode / white-labelling a data change rather than a code change." %}

{% include quiz.html id="theme-2"
   question="How do CSS custom properties differ from Sass/Less variables for theming?"
   options="A|Sass/Less variables are compile-time constants (fixed after build). CSS custom properties are runtime values that cascade, can be overridden by scope, and can be changed dynamically — which is why modern theming (and dark mode) relies on custom properties;;B|Sass variables work in older browsers better;;C|Custom properties cannot be nested;;D|They are identical"
   correct="A"
   explanation="You can't switch Sass variables at runtime — they've already been compiled away. CSS custom properties live in the CSSOM and can be swapped by updating a class on the root element." %}

{% include quiz.html id="theme-3"
   question="What's a robust way to implement dark mode?"
   options="A|Define theme tokens as CSS custom properties on :root, override them under .dark (or [data-theme=&quot;dark&quot;]) and @media (prefers-color-scheme: dark) for the auto default, and let the rest of the CSS consume var(--...) — no component code needs to change;;B|Only inline styles;;C|Hard-code a separate stylesheet per theme and swap the <link> tag;;D|Use !important everywhere"
   correct="A"
   explanation="A single source of truth (tokens) plus a root-level theme class means the whole app flips with one attribute toggle, and prefers-color-scheme gives users system-default support for free." %}

{% include quiz.html id="theme-4"
   question="Should themes be global or component-scoped?"
   options="A|Typically global tokens at :root for consistency, with the option of scoped theme overrides on a subtree (e.g. a dark card on a light page) by re-declaring the same custom properties under a wrapper. The same tokens are consumed either way;;B|Themes must be per-component file;;C|Always component-scoped — globals are evil;;D|Always global — scoped theming doesn't work"
   correct="A"
   explanation="Custom properties cascade, so scoped overrides are trivial. Global defaults keep the whole app coherent; scoped overrides handle the one-offs." %}

{% include quiz.html id="theme-5"
   question="How do you handle theme-specific images or icons (e.g. different logos for light/dark)?"
   options="A|Only use one image regardless of theme;;B|Hide/show two <img> tags with CSS;;C|Use <picture> with <source media=&quot;(prefers-color-scheme: dark)&quot;> so the browser picks the right asset; or use SVG with currentColor so a single asset recolors via a CSS variable;;D|Emit two entire CSS files"
   correct="C"
   explanation="<picture> + media queries fetches only the variant you need. currentColor on SVG icons is the lightest solution when the only change is tint." %}

## References
- [1] https://blog.hubspot.com/website/css-frameworks
- [2] https://www.dreamhost.com/blog/css-frameworks/
- [3] https://dev.to/drno/theming-and-coloring-finally-made-efficient-in-css-thanks-to-an-oop-inspired-pattern-27ca
- [4] https://www.simplilearn.com/tutorials/css-tutorial/css-framework
- [5] https://www.freecodecamp.org/news/best-css-frameworks-for-frontend-devs/
- [6] https://www.linkedin.com/advice/1/how-can-you-use-css-frameworks-style-different
- [7] https://www.lambdatest.com/blog/responsive-lightweight-css-frameworks/
- [8] https://www.geeksforgeeks.org/primer-css-theming-set-theme/
- [9] https://blakewatson.com/journal/surveying-the-landscape-of-css-micro-frameworks/
- [10] https://www.wearedevelopers.com/magazine/best-css-frameworks