---
title: Template
layout: doc
slug: template
---
# Template

> - Page-level layout shell that arranges atoms, molecules, and organisms into a recognisable page skeleton
> - Defines structure and slot composition without baking in real content or page-specific data
> - One template fans out into many pages by accepting children, props, or slots

## Glossary

> - **Template** — the layout shell (header slot, content slot, sidebar slot, footer slot) shared by a family of pages.
> - **Page** — a template populated with concrete data and behaviour for a specific route.
> - **Slot / children** — the named hole(s) in the template into which pages inject their organisms and content.

## Detailed Description

A template in the context of Atomic Design is a higher-level component that defines the overall structure of a page or section without being tied to specific content. Templates assemble organisms into page layouts, showing where each piece goes and how they relate spatially, but using placeholder content or props to demonstrate structure rather than final data.

The key distinction between templates and pages is **content specificity**. A template says "put a hero section here, navigation here, product grid here" — it's the structural skeleton. A page fills that skeleton with actual data: "Hero shows iPhone 15, navigation has these 5 links, product grid shows electronics category." The same template can generate hundreds of pages by passing different content.

In the Universal Frontend Architecture, templates bridge the gap between reusable organisms and specific pages. They define **layout patterns** that repeat across your application: product pages all share `ProductTemplate` structure, blog posts all share `BlogPostTemplate`, user profiles all share `ProfileTemplate`. This consistency creates familiar navigation patterns and reduces cognitive load for users.

From a responsive design perspective, templates own **breakpoint-specific layouts**. A two-column desktop template might collapse to single-column on mobile, with organisms reordering based on priority. The template orchestrates this transformation while the organisms it composes remain unchanged — that separation of concerns is what makes Atomic Design powerful, and it's also what keeps Cumulative Layout Shift (CLS) under control: the template reserves the right amount of space at every viewport so content doesn't jump when it lands.

Templates also establish **content hierarchies and relationships**. A `BlogPostTemplate` might define: header at top, article in main column, sidebar with related articles, comment section at bottom, footer at end. This structure guides users through content in intended order while remaining flexible across different articles.

## Key Insight

Templates are the IKEA shelf; pages fill it with books. The shelf decides how many shelves there are, how wide each one is, and how the whole thing handles a small living room versus a big one. The books — your real data, your routes, your business state — slot in afterwards. Get the shelf right once and every page that uses it inherits a consistent layout for free.

## Basic Example

The four `chota-*` templates ship the exact same `Layout` shell — a single container element that accepts a `children` / `<slot>` projection. It owns the page-level container width, padding, and any responsive layout decisions, and it knows nothing about what gets rendered inside it. Compare how each framework expresses the same idea.

{::nomarkdown}<div class="code-tabs">{:/}

<p>React</p>
{% raw %}
```jsx
// templates/chota-react-rtk/src/ui/templates/Layout/Layout.component.jsx
import "./Layout.style.css";

export default function Layout({ children }) {
  return (
    <div className="container layout">
      {children}
    </div>
  );
}
```
{% endraw %}

<p>Vue</p>
{% raw %}
```vue
<!-- templates/chota-vue-pinia/src/ui/templates/Layout/Layout.component.vue -->
<template>
  <div class="container layout">
    <slot />
  </div>
</template>

<style scoped src="./Layout.style.css"></style>
```
{% endraw %}

<p>Web Components</p>
{% raw %}
```js
// templates/chota-wc-saga/src/ui/templates/Layout/Layout.component.js
import { html } from "lit";
import useComputedStyles from "../../../utils/theme/hooks/useComputedStyles";
import style from "./Layout.style.js";

export default function Layout() {
  useComputedStyles(this, [style]);
  return html`
    <div class="container layout">
      <slot></slot>
    </div>
  `;
}
```
{% endraw %}

{::nomarkdown}</div>{:/}

A few things worth comparing across the tabs:

- **Slot projection.** React uses `{children}`, Vue uses `<slot />`, the Lit-based WC uses `<slot></slot>` — three spellings of the same idea.
- **No data, no state.** None of the three imports a store, fetches anything, or knows about a specific route. The `Layout` template is purely structural; pages plug data in by composing it.
- **Styling is layout-only.** Every template co-locates `Layout.style.css` next to the component and limits it to container width, padding, and page-level grid concerns — the things that have to be decided *once*, at the layout shell, to keep the whole app consistent.

## Practical Example

A larger template that defines a header / main / footer page skeleton, plus a `HomePage` composing it. The template stays prop-driven so the same shell powers a marketing page today and a dashboard tomorrow.

```jsx
// HomePageTemplate.jsx

import Header from "../../organisms/Header/Header.component";
import Footer from "../../organisms/Footer/Footer.component";

export default function HomePageTemplate({ children, sidebar }) {
  return (
    <div className="page">
      <Header />
      <div className="page__body">
        <main className="page__main">{children}</main>
        {sidebar ? <aside className="page__sidebar">{sidebar}</aside> : null}
      </div>
      <Footer />
    </div>
  );
}
```

Notice that `HomePageTemplate` accepts both a `children` slot and a named `sidebar` slot — pages decide what to inject without the template knowing anything about it. A page using it looks like this:

```jsx
// HomePage.jsx

import HomePageTemplate from "../ui/templates/HomePageTemplate/HomePageTemplate.component";
import TodoList from "../ui/organisms/TodoList/TodoList.component";
import RelatedLinks from "../ui/molecules/RelatedLinks/RelatedLinks.component";

export default function HomePage({ todoData, events }) {
  return (
    <HomePageTemplate sidebar={<RelatedLinks />}>
      <h1>Welcome</h1>
      <TodoList todoData={todoData} events={events} />
    </HomePageTemplate>
  );
}
```

And the application root just mounts the page:

```jsx
// App.jsx

import HomePage from "./pages/HomePage";

export default function App() {
  return <HomePage />;
}
```

This is where the template/page split pays off — `HomePageTemplate` is reused unchanged on the about page, the settings page, and any future logged-in dashboard, because every routing-and-data concern lives in the page above it.

## Common Mistakes

### 1. Putting Business State Inside the Template
**Mistake:** Subscribing to a store or fetching data inside the layout shell.

```jsx
// BAD: template owns the data
import { useSelector } from "react-redux";
import { fetchTodos } from "../state/todo.action";

export default function HomePageTemplate() {
  const todos = useSelector((s) => s.todo.todoItems);
  useEffect(() => { fetchTodos(); }, []);
  return (
    <div className="page">
      <Header />
      <main>{todos.map(/* ... */)}</main>
      <Footer />
    </div>
  );
}
```

```jsx
// GOOD: template is pure structure, page wires the data
export default function HomePageTemplate({ children }) {
  return (
    <div className="page">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
```

**Why it matters:** Once a template imports the store, every page that uses it inherits that store coupling — you can't reuse the layout in Storybook, in a marketing page, or in a different app. Templates that only accept slots stay framework-portable and trivially testable.

### 2. Baking Specific Page Content Into the Template
**Mistake:** Hardcoding the `<h1>`, hero text, or the exact list of organisms that the homepage needs into the layout itself.

```jsx
// BAD: shell knows about the homepage
export default function HomePageTemplate() {
  return (
    <div className="page">
      <Header />
      <main>
        <h1>Welcome to Acme</h1>
        <TodoList />
      </main>
      <Footer />
    </div>
  );
}
```

```jsx
// GOOD: shell exposes slots, page decides what fills them
export default function HomePageTemplate({ children, sidebar }) {
  return (
    <div className="page">
      <Header />
      <div className="page__body">
        <main>{children}</main>
        {sidebar ? <aside>{sidebar}</aside> : null}
      </div>
      <Footer />
    </div>
  );
}
```

**Why it matters:** A shell that hardcodes the homepage's `<h1>` *is* the homepage — you've collapsed the template/page boundary. Slots keep the same template usable across routes that have nothing in common except their layout.

### 3. Mixing Template-Level and Page-Level Responsive Concerns
**Mistake:** Letting individual pages override container width, gutters, or breakpoint behaviour.

```css
/* BAD: each page redefines the shell's grid */
.home-page main { max-width: 1200px; padding: 0 16px; }
.about-page main { max-width: 960px;  padding: 0 24px; }
.settings-page main { max-width: 1200px; padding: 0 8px;  }
```

```css
/* GOOD: the template owns container, pages stay layout-agnostic */
.layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md);
}
@media (max-width: 768px) {
  .layout { padding: 0 var(--space-sm); }
}
```

**Why it matters:** Page-level layout overrides cause CLS at every navigation and let inconsistencies leak in. The template's job is to decide container width, gutters, and how the body collapses on small screens — *once* — so every page gets it for free.

### 4. Duplicating the Layout Shell Across Pages
**Mistake:** Each page repeats `<Header /> ... <Footer />` instead of composing them via the template.

```jsx
// BAD: shell duplicated in every page
export default function AboutPage() {
  return (
    <div className="page">
      <Header />
      <main><AboutContent /></main>
      <Footer />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="page">
      <Header />
      <main><SettingsForm /></main>
      <Footer />
    </div>
  );
}
```

```jsx
// GOOD: pages compose the template
export default function AboutPage() {
  return (
    <HomePageTemplate>
      <AboutContent />
    </HomePageTemplate>
  );
}

export default function SettingsPage() {
  return (
    <HomePageTemplate>
      <SettingsForm />
    </HomePageTemplate>
  );
}
```

**Why it matters:** Duplicated shell markup drifts. Adding a banner, swapping the header, or changing the container width then becomes a multi-file refactor instead of a one-line change in the template.

## Quick Quiz

{% include quiz.html
  id="template-1"
  question="What is the key distinction between a template and a page in Atomic Design?"
  options="A: Templates are server-rendered and pages are client-rendered;;B: Templates define structure and slot composition without specific content; pages fill that structure with concrete data and behaviour;;C: Templates are written in TypeScript while pages are written in JavaScript;;D: There is no distinction — they're synonyms"
  correct="B"
  explanation="A template is the reusable layout shell (header / main / sidebar / footer slots). A page is a template populated with concrete data, organisms, and route-specific behaviour. The same template powers many pages."
%}

{% include quiz.html
  id="template-2"
  question="Should a template subscribe to the store or fetch data on mount?"
  options="A: Yes — that way pages don't have to;;B: Only if the data is small;;C: No — templates should accept children/slots/props and stay store-agnostic so a single shell works across many pages and in Storybook;;D: Only on the first render"
  correct="C"
  explanation="Once a template imports a store it can no longer be reused outside that app. Containers feed pages, pages feed templates via slots — the template itself stays purely structural."
%}

{% include quiz.html
  id="template-3"
  question="A homepage and an about page need exactly the same header / sidebar / footer layout. What's the right move?"
  options="A: Copy the layout JSX into both pages and tweak as needed;;B: Build one Layout/HomePageTemplate that exposes slots, and have each page compose it with different children;;C: Put header and footer into the router;;D: Inline a layout component into each route file"
  correct="B"
  explanation="Composition via slots is the whole point of the template layer. One shell, many pages. Duplicating the shell turns every layout tweak into a multi-file refactor."
%}

{% include quiz.html
  id="template-4"
  question="Where should responsive layout decisions (container width, gutters, single-column collapse on mobile) live?"
  options="A: In each page's CSS;;B: In the molecules — they're closest to the breakpoints;;C: In the template — it owns container width and breakpoint behaviour once, so every page that uses it inherits a consistent layout and avoids CLS at navigation;;D: In a global stylesheet only"
  correct="C"
  explanation="Page-level overrides cause inconsistency and layout shift. The template is the single source of truth for the layout shell at every viewport."
%}

{% include quiz.html
  id="template-5"
  question="How does a template avoid being coupled to one specific page's content?"
  options="A: It accepts children / named slots / props for the regions that vary, and renders only the structural shell itself;;B: It hardcodes the homepage and other pages copy it;;C: It uses dynamic imports;;D: It avoids JSX entirely"
  correct="A"
  explanation="React's children, Vue's <slot />, and Lit's <slot></slot> are three spellings of the same idea: the template defines holes, the page fills them. That decoupling is what lets the template be reused."
%}

## References

- [Templates — Atomic Design (Brad Frost)](https://atomicdesign.bradfrost.com/chapter-2/#templates) — original definition of the template layer and how it relates to pages.
- [Atomic Design overview](atomic-design.html) — where templates sit relative to atoms, molecules, organisms, and pages.
- [Organism](organism.html) — the layer templates compose; organisms slot into the regions a template defines.
- [Skeleton](skeleton.html) — the loading-state placeholder that mirrors the template's shape to prevent layout shift while data is in flight.
- [Container](../server/container.html) — the wrapper that subscribes to state and feeds pages, keeping the template itself store-agnostic.
- [Cumulative Layout Shift (web.dev)](https://web.dev/articles/cls) — why owning responsive layout at the template level matters for Core Web Vitals.
- [Component-Driven User Interfaces](https://www.componentdriven.org/) — the bottom-up workflow that treats templates as the reuse boundary between organisms and pages.
