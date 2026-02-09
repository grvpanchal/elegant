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

<details>
<summary><strong>Question 1:</strong> What's mobile-first vs desktop-first?</summary>

**Answer:** Mobile-first uses `min-width` queries; desktop-first uses `max-width`.

```css
/* Mobile-First */
.grid { grid-template-columns: 1fr; }  /* Base = mobile */

@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }  /* Add for larger */
}

/* Desktop-First */
.grid { grid-template-columns: repeat(2, 1fr); }  /* Base = desktop */

@media (max-width: 767px) {
  .grid { grid-template-columns: 1fr; }  /* Override for smaller */
}
```

**Why mobile-first wins:** Mobile users download less CSS.
</details>

<details>
<summary><strong>Question 2:</strong> How do you choose breakpoints?</summary>

**Answer:** Use content-driven breakpoints, not device-specific.

```css
/* ❌ WRONG: Device-specific */
@media (min-width: 375px) { /* iPhone */ }
@media (min-width: 768px) { /* iPad */ }

/* ✅ RIGHT: Content-driven */
@media (min-width: 640px) { /* When cards can fit 2 per row */ }
@media (min-width: 1024px) { /* When cards can fit 3 per row */ }
```

**Why it matters:** Content-driven works on all devices, including future ones.
</details>

<details>
<summary><strong>Question 3:</strong> How do you implement fluid typography?</summary>

**Answer:** Use `clamp()`, viewport units, or media queries.

```css
/* Method 1: clamp() */
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
  /* Min: 2rem, Preferred: 5vw, Max: 4rem */
}

/* Method 2: Media queries */
h1 { font-size: 2rem; }

@media (min-width: 768px) {
  h1 { font-size: 3rem; }
}

@media (min-width: 1024px) {
  h1 { font-size: 4rem; }
}
```

**Why it matters:** Fluid typography improves readability across screen sizes.
</details>

<details>
<summary><strong>Question 4:</strong> What are container queries?</summary>

**Answer:** Container queries apply styles based on parent size, not viewport.

```css
/* Media Query (viewport-based) */
@media (min-width: 768px) {
  .card { display: flex; }
}

/* Container Query (container-based) */
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card { display: flex; }
}
```

**Why it matters:** Container queries enable truly responsive components.
</details>

<details>
<summary><strong>Question 5:</strong> How do you handle responsive images?</summary>

**Answer:** Use `srcset`, `sizes`, and `<picture>`.

```html
<!-- srcset with sizes -->
<img
  src="small.jpg"
  srcset="small.jpg 400w,
          medium.jpg 800w,
          large.jpg 1200w"
  sizes="(max-width: 600px) 100vw,
         (max-width: 1200px) 50vw,
         600px"
  alt="Responsive image"
  loading="lazy">

<!-- Art direction with picture -->
<picture>
  <source media="(min-width: 1024px)" srcset="landscape.jpg">
  <source media="(min-width: 768px)" srcset="square.jpg">
  <img src="portrait.jpg" alt="Different crops for different sizes">
</picture>
```

**Why it matters:** srcset saves bandwidth by serving appropriately sized images.
</details>

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