---
title: Theme
layout: doc
slug: theme
---
# Theme

> - Provides the unique visual style to your site
> - Colors, typography, spacing that define your brand
> - Enables consistent design across entire application

## Key Insight

Themes are systematic design languages implemented through CSS—not just colors, but comprehensive design token systems covering typography, spacing, shadows, and interactions. Modern theming uses CSS custom properties (variables) for runtime flexibility, enabling features like dark mode switching without recompiling stylesheets, while design tokens ensure consistency between designers and developers by codifying design decisions into reusable values.

## Detailed Description

Theme provides the unique visual style to your site. In many ways the colors highlight what a site represents. CSS frameworks offer various theming patterns to customize the look and feel of websites, each with different trade-offs between flexibility, performance, and ease of use.

A well-designed theme system goes beyond simple color swapping. Modern themes implement **design tokens**—named entities that store visual design attributes like colors, fonts, spacing, and animation durations. These tokens create a contract between designers and developers: designers specify `--color-primary: #3b82f6` in design tools, developers reference `var(--color-primary)` in code, and changes propagate consistently across the entire application.

The evolution from preprocessor variables (Sass/Less) to CSS custom properties represents a fundamental shift. Preprocessor variables compile to static values at build time, requiring recompilation for theme changes. CSS custom properties are live values that can change at runtime through JavaScript or media queries, enabling dynamic theming, user preferences, and responsive design systems that adapt to device capabilities.

In the Universal Frontend Architecture, theming intersects with component architecture through **scoped styling**. Web Components use Shadow DOM for style encapsulation, React uses CSS Modules or CSS-in-JS, Vue has scoped styles. Themes must work across these boundaries, typically through:
- Global CSS custom properties that pierce Shadow DOM
- Theme context providers in React/Vue
- Data attributes or class toggling for theme switching

Modern frameworks offer different theming philosophies:

## Theming Patterns

### Utility-First Approach

Frameworks like Tailwind CSS use a utility-first approach for theming:

- Provides low-level utility classes to build custom designs
- Allows for highly customizable themes directly in HTML
- Enables rapid prototyping and unique designs
- Example: Tailwind CSS[2][10]

## Component-Based Theming

Frameworks such as Bootstrap and Foundation use pre-designed components:

- Offers ready-to-use UI components with consistent styling
- Allows customization through variables and overrides
- Provides a cohesive look across the entire application
- Examples: Bootstrap, Foundation[1][4]

## CSS Variables and Custom Properties

Modern frameworks leverage CSS variables for theming:

- Enables easy customization of colors, fonts, and other properties
- Allows for dynamic theme switching
- Supports creating multiple themes with minimal code
- Example: Open Props[10]

## Preprocessor-Based Theming

Some frameworks use preprocessors like Sass for advanced theming:

- Utilizes variables, mixins, and functions for flexible theming
- Allows for nested rules and modular organization of styles
- Enables creation of complex theme variations
- Example: Bootstrap (with Sass)[1]

## Classless Theming

Classless CSS themes provide styling without requiring specific classes:

- Applies styles directly to HTML elements
- Offers quick setup for simple projects or prototypes
- Provides a good starting point for custom designs
- Examples: Water.css, awsm.css[9]

## Theme Switching

Many frameworks support easy theme switching:

- Allows toggling between light and dark modes
- Uses data attributes or CSS classes to apply different themes
- Enables dynamic theme changes based on user preferences
- Example: Primer CSS[8]

By understanding these theming patterns, developers can choose the most suitable CSS framework and theming approach for their projects, balancing customization needs with development speed and consistency.

## Code Examples

### Basic Example: CSS Custom Properties for Theming

Fundamental theme implementation using CSS variables:

```css
/* theme.css - Define design tokens */
:root {
  /* Color tokens */
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-success: #10b981;
  --color-danger: #ef4444;
  --color-warning: #f59e0b;
  
  /* Neutral colors */
  --color-bg: #ffffff;
  --color-surface: #f3f4f6;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  
  /* Spacing scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  
  /* Typography */
  --font-sans: system-ui, -apple-system, sans-serif;
  --font-mono: 'Monaco', 'Courier New', monospace;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
}

/* Dark theme override */
[data-theme="dark"] {
  --color-bg: #111827;
  --color-surface: #1f2937;
  --color-text: #f9fafb;
  --color-text-muted: #9ca3af;
}
```

Using theme tokens in components:

```css
/* button.css */
.btn {
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s;
}

.btn--primary {
  background: var(--color-primary);
  color: white;
}

.btn--secondary {
  background: var(--color-secondary);
  color: white;
}

.card {
  background: var(--color-surface);
  color: var(--color-text);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

```html
<body data-theme="light">
  <button class="btn btn--primary">Primary Button</button>
  <div class="card">
    <h3>Card Title</h3>
    <p>Content uses theme colors</p>
  </div>
</body>
```

### Practical Example: Dark Mode Toggle with JavaScript

Complete dark mode implementation:

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

Comprehensive multi-theme system:

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

<details>
<summary><strong>Question 1:</strong> What are design tokens and why are they better than hardcoded values?</summary>

**Answer:** Design tokens are named entities storing visual design attributes (colors, spacing, typography) as CSS custom properties or variables. They're better because:

1. **Single source of truth:** Change `--color-primary` once, updates everywhere
2. **Designer-developer bridge:** Design tools export tokens developers can import
3. **Consistency:** Ensures same spacing/colors across app
4. **Theming:** Switch entire theme by changing token values
5. **Maintainability:** Easier to update than finding/replacing hex codes

Example: `var(--space-md)` instead of `16px` everywhere means changing spacing scale requires one edit, not hundreds.
</details>

<details>
<summary><strong>Question 2:</strong> How do CSS custom properties differ from Sass/Less variables for theming?</summary>

**Answer:**

**CSS Custom Properties (runtime):**
- Change at runtime via JavaScript
- Can be scoped to elements
- Enable dynamic theme switching
- Pierce Shadow DOM boundaries
- Example: `document.documentElement.style.setProperty('--color', '#000')`

**Sass/Less Variables (build-time):**
- Compiled to static values
- Require rebuild to change
- No runtime flexibility
- Can't change based on user preference

**When to use each:**
- CSS custom properties: Dynamic themes, dark mode, user preferences
- Sass variables: Computed values, DRY at build time

Modern approach: Use both—Sass for preprocessing, output CSS custom properties for runtime flexibility.
</details>

<details>
<summary><strong>Question 3:</strong> What's the best way to implement dark mode?</summary>

**Answer:**

**Best practice approach:**

1. **Use data attribute:** `[data-theme="dark"]` (more explicit than classes)
2. **Respect system preference:** Check `prefers-color-scheme`
3. **Save user choice:** localStorage persists across sessions
4. **Initialize before paint:** Inline script prevents flash
5. **CSS custom properties:** All theme values as variables

```javascript
// Initialize immediately (in <head>)
const theme = localStorage.getItem('theme') || 
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', theme);
```

**Avoid:**
- Class toggling only (`.dark-mode`) - less semantic
- Media query only - ignores user preference
- JavaScript-only - causes flash
- Separate stylesheets - performance cost

**Why:** This approach prevents flash, respects preferences, and performs well.
</details>

<details>
<summary><strong>Question 4:</strong> Should themes be global or component-scoped?</summary>

**Answer:** **Both, depending on architecture:**

**Global tokens (recommended for most):**
```css
:root {
  --color-primary: #3b82f6;
}
/* All components use global tokens */
.button { background: var(--color-primary); }
```

**Benefits:** Consistency, single source, easy theming

**Component-scoped (Web Components with Shadow DOM):**
```javascript
class MyButton extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --button-bg: var(--color-primary, #3b82f6);  /* Fallback */
        }
        button { background: var(--button-bg); }
      </style>
      <button><slot></slot></button>
    `;
  }
}
```

**Benefits:** Encapsulation, portability, isolation

**Best practice:** Global tokens for app-wide consistency, component-scoped for overrides/customization. CSS custom properties inherit through Shadow DOM, enabling both patterns.
</details>

<details>
<summary><strong>Question 5:</strong> How do you handle theme-specific images or assets?</summary>

**Answer:**

**Pattern 1: CSS background images with custom properties:**
```css
:root {
  --logo-url: url('/logo-light.svg');
  --bg-pattern: url('/pattern-light.png');
}

[data-theme="dark"] {
  --logo-url: url('/logo-dark.svg');
  --bg-pattern: url('/pattern-dark.png');
}

.logo { background-image: var(--logo-url); }
```

**Pattern 2: CSS with theme selectors:**
```css
.hero-bg {
  background-image: url('/hero-light.jpg');
}

[data-theme="dark"] .hero-bg {
  background-image: url('/hero-dark.jpg');
}
```

**Pattern 3: JavaScript-based switching:**
```jsx
const Logo = () => {
  const { theme } = useTheme();
  return <img src={`/logo-${theme}.svg`} alt="Logo" />;
};
```

**Pattern 4: SVG with CSS variables (best for icons):**
```html
<svg>
  <path fill="var(--color-text)" d="..." />
</svg>
<!-- Colors change with theme automatically -->
```

**Best practice:** Use SVG with CSS vars when possible (smallest, themeable). Use picture element for complex images with theme variants. Avoid JavaScript switching for performance.
</details>

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