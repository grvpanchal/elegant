---
title: Responsive Web Design
layout: doc
slug: rwd
---

# Responsive Web Design

> - Mobile-first approach to flexible layouts across devices
> - Content-driven breakpoints using media queries and fluid grids
> - Ensures usability from phones to ultrawide monitors

## Key Insight

Responsive Web Design isn't about making separate mobile and desktop sites—it's about building one flexible site that adapts to any screen size. The mobile-first philosophy (start with mobile constraints, enhance for larger screens) forces you to prioritize content and performance from the start, avoiding the "desktop-first bloat then strip for mobile" trap. The three pillars are: 1) Fluid grids (percentage-based layouts, not fixed pixels), 2) Flexible images (max-width: 100%), 3) Media queries (applying styles at specific breakpoints). Breakpoints should be content-driven (add a breakpoint when the design breaks), not device-driven (targeting iPhone vs iPad). Mastering RWD means thinking in relative units (rem, em, vw, vh) and understanding when to use flexbox vs grid vs container queries.

## Detailed Description

Responsive Web Design (RWD) is a web design approach to make web pages render well on all screen sizes and resolutions while ensuring good usability. It is the way to design for a multi-device web.

**Core Principles:**

1. **Mobile-First Development**: Start with mobile styles as the default, then use `min-width` media queries to add styles for larger screens. This ensures smaller devices get optimized CSS without downloading unused desktop styles.

2. **Fluid Grids**: Use percentage-based widths instead of fixed pixel widths. `width: 50%` adapts to any container, while `width: 500px` breaks on small screens.

3. **Flexible Images**: Images should never overflow their containers. `max-width: 100%` is the simplest solution. For art direction or performance, use `<picture>` and `srcset`.

4. **Media Queries**: Apply different styles based on viewport width, height, orientation, resolution, or color scheme. `@media (min-width: 768px)` adds styles for tablets and larger.

5. **Viewport Meta Tag**: Without `<meta name="viewport" content="width=device-width, initial-scale=1">`, mobile browsers render pages at desktop width and zoom out.

6. **Content-Driven Breakpoints**: Don't target specific devices. Add breakpoints when your content needs different layouts, not when you want to target "iPhone" or "iPad".

**Modern RWD Tools:**
- **Flexbox**: One-dimensional layouts (rows or columns)
- **CSS Grid**: Two-dimensional layouts (rows and columns)
- **Container Queries**: Styles based on parent container size, not viewport
- **Viewport Units**: vw, vh, vmin, vmax for sizes relative to viewport
- **CSS Custom Properties**: Change values at breakpoints (`--spacing: 1rem` → `--spacing: 2rem`)

## Code Examples

### Basic Example: Mobile-First Media Queries

```css
/* Mobile styles (default) */
.container {
  width: 100%;
  padding: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;  /* Single column on mobile */
  gap: 1rem;
}

h1 {
  font-size: 1.5rem;
}

.sidebar {
  display: none;  /* Hide sidebar on mobile */
}

/* Tablet (min-width: 768px) */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
  
  .grid {
    grid-template-columns: repeat(2, 1fr);  /* Two columns */
  }
  
  h1 {
    font-size: 2rem;
  }
}

/* Desktop (min-width: 1024px) */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem;
  }
  
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
  
  .sidebar {
    display: block;
  }
}
```

### Practical Example: Responsive Navigation

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    /* Mobile-first navigation */
    .navbar {
      background: #333;
      color: white;
      padding: 1rem;
    }
    
    .nav-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .menu-toggle {
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      display: block;
    }
    
    .nav-menu {
      list-style: none;
      display: none;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    
    .nav-menu.active {
      display: flex;
    }
    
    /* Tablet+: Horizontal navigation */
    @media (min-width: 768px) {
      .menu-toggle {
        display: none;
      }
      
      .nav-menu {
        display: flex;
        flex-direction: row;
        margin-top: 0;
        gap: 1rem;
      }
    }
  </style>
</head>
<body>
  <nav class="navbar">
    <div class="nav-header">
      <div class="logo">MyApp</div>
      <button class="menu-toggle">☰</button>
      <ul class="nav-menu" id="nav-menu">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
      </ul>
    </div>
  </nav>
  
  <script>
    document.querySelector('.menu-toggle').addEventListener('click', () => {
      document.getElementById('nav-menu').classList.toggle('active');
    });
  </script>
</body>
</html>
```

### Advanced Example: Responsive Images and Container Queries

```html
<!-- Responsive image with srcset -->
<picture>
  <source media="(min-width: 1024px)" srcset="large.jpg">
  <source media="(min-width: 768px)" srcset="medium.jpg">
  <img src="small.jpg" alt="Responsive image" loading="lazy">
</picture>

<!-- Container query example -->
<style>
.card-container {
  container-type: inline-size;
  container-name: card;
}

.card {
  display: block;
}

@container card (min-width: 400px) {
  .card {
    display: flex;  /* Horizontal layout when container >= 400px */
  }
}
</style>

<div class="card-container">
  <div class="card">
    <div class="card-image">Image</div>
    <div class="card-text">Text content</div>
  </div>
</div>
```

## Common Mistakes

### 1. Using Fixed Pixel Widths
**Mistake:** Setting fixed widths breaks on smaller screens.

```css
/* ❌ BAD */
.container {
  width: 1200px;  /* Breaks on mobile */
}

/* ✅ GOOD */
.container {
  max-width: 1200px;
  width: 100%;
  padding: 0 1rem;
}
```

**Why it matters:** Fixed widths cause horizontal scrolling on small screens.

### 2. Desktop-First Approach
**Mistake:** Starting with desktop styles, then overriding for mobile.

```css
/* ❌ BAD: Desktop-first */
.grid {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

/* ✅ GOOD: Mobile-first */
.grid {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

**Why it matters:** Mobile-first reduces CSS payload for mobile users.

### 3. Too Many Device-Specific Breakpoints
**Mistake:** Creating breakpoints for every device.

```css
/* ❌ BAD */
@media (max-width: 320px) { /* iPhone 5 */ }
@media (max-width: 375px) { /* iPhone 6 */ }
@media (max-width: 414px) { /* iPhone Plus */ }

/* ✅ GOOD: Content-driven */
@media (min-width: 640px) { /* When content needs 2 columns */ }
@media (min-width: 1024px) { /* When content needs 3 columns */ }
```

**Why it matters:** Content-driven breakpoints work on any device.

## Quick Quiz

{% include quiz.html id="rwd-1"
   question="What's the practical difference between mobile-first and desktop-first responsive CSS?"
   options="A|Mobile-first starts with the smallest layout and uses min-width media queries to layer on complexity as the viewport grows; desktop-first starts with the full layout and uses max-width queries to strip back features. Mobile-first generally ships less default CSS and better matches progressive-enhancement thinking;B|Mobile-first only works on iOS;C|Desktop-first is faster;D|They produce identical CSS"
   correct="A"
   explanation="Mobile-first makes the smallest-screen experience the baseline, which tends to force better hierarchy decisions and lighter initial styles." %}

{% include quiz.html id="rwd-2"
   question="How should you choose breakpoints?"
   options="A|Copy Bootstrap's values and never think about it again;B|Let the content and layout drive the breakpoints — add a breakpoint wherever the current layout starts to break, not at fixed device widths. Device-specific breakpoints age badly as new devices appear;C|One breakpoint per known device;D|Only one breakpoint at 768px"
   correct="B"
   explanation="Fixed-device breakpoints age with the hardware. Content-driven breakpoints stay correct." %}

{% include quiz.html id="rwd-3"
   question="How do you implement fluid typography that scales smoothly between viewport sizes?"
   options="A|Hard-code font-size per breakpoint;B|Use clamp(min, preferred, max) with a vw-based preferred value, e.g. font-size: clamp(1rem, 0.5rem + 1vw, 1.5rem) — the browser interpolates between min and max as the viewport grows, with bounds for accessibility;C|Use JavaScript to resize on scroll;D|Only rely on rem units"
   correct="B"
   explanation="clamp() gives you fluid scaling with explicit lower/upper bounds, avoiding unreadably small or huge text on extreme viewports." %}

{% include quiz.html id="rwd-4"
   question="What are container queries and how do they complement media queries?"
   options="A|They are the same as media queries;B|Container queries let a component restyle based on the size of its containing element rather than the viewport, so a card can render differently in a narrow sidebar vs a wide hero without the page knowing — exactly what atomic-design components need;C|They only work on the body element;D|They are deprecated"
   correct="B"
   explanation="Media queries know about the viewport. Container queries finally give components true component-level responsiveness." %}

{% include quiz.html id="rwd-5"
   question="What's the right way to serve responsive images?"
   options="A|Always a single full-resolution image — browsers handle scaling;B|Use &lt;img srcset&gt; with sizes, or &lt;picture&gt; with &lt;source&gt; for art direction, so the browser downloads the best-sized image for the viewport and pixel density — plus loading=&quot;lazy&quot; for below-the-fold images;C|Only JPEG;D|Base64-encode everything"
   correct="B"
   explanation="srcset/sizes lets the browser pick the best bitmap; &lt;picture&gt; adds art-direction swaps. Combining with lazy loading and WebP/AVIF modern formats delivers the biggest perf wins." %}

## References

[Responsive web design basics](https://web.dev/responsive-web-design-basics/)

> - Set the viewport: Pages optimized for a variety of devices must include a meta viewport tag in the head of the document. A meta viewport tag gives the browser instructions on how to control the page's dimensions and scaling
>
> - Size content to the viewport: Users are used to scrolling websites vertically on both desktop and mobile; forcing the user to scroll horizontally or to zoom out in order to see the whole page results in a poor user experience
>
> - Use CSS media queries for responsiveness: Media queries are simple filters that can be applied to CSS styles. They make it easy to change styles based on the characteristics of the device rendering the content
>
> - How to choose breakpoints: Don't define breakpoints based on device classes. Create breakpoints when the content and design requires it
>
> - Best Practices: At a minimum, optimize page speed and avoid absolutely hiding content

- [1] https://web.dev/articles/responsive-web-design-basics