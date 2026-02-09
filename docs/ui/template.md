---
title: Template
layout: doc
slug: template
---
# Template

> - Page-level structure defining layout without real content
> - Wire frames that show content placement
> - Reusable layouts composed of organisms

## Key Insight

Templates are the wireframe layer of Atomic Design—they define page structure and content placement without actual content, like blueprints showing "hero image goes here," "navigation goes here," "product grid goes here." By separating layout structure (template) from actual data (page), you create reusable page patterns: a ProductTemplate works for t-shirts, electronics, or furniture by accepting different product data, while a BlogPostTemplate works for any article by accepting different post content. Templates are where designers and developers align on page structure before content creation begins.

## Detailed Description

A template in the context of Atomic Design is a higher-level component that defines the overall structure of a page or section without being tied to specific content. Templates assemble organisms into page layouts, showing where each piece goes and how they relate spatially, but using placeholder content or props to demonstrate structure rather than final data.

The key distinction between templates and pages is **content specificity**. A template says "put a hero section here, navigation here, product grid here"—it's the structural skeleton. A page fills that skeleton with actual data: "Hero shows iPhone 15, navigation has these 5 links, product grid shows electronics category." The same template can generate hundreds of pages by passing different content.

In the Universal Frontend Architecture, templates bridge the gap between reusable organisms and specific pages. They define **layout patterns** that repeat across your application: product pages all share ProductTemplate structure, blog posts all share BlogPostTemplate, user profiles all share ProfileTemplate. This consistency creates familiar navigation patterns and reduces cognitive load for users.

Templates also serve as the **contract between design and development**. Designers create template mockups showing page structure and component placement. Developers build template components matching those structures. Content creators then populate templates with real data. This separation of concerns allows parallel workflows: designers refine layouts, developers build template logic, and content teams prepare materials—all working toward the same structural foundation.

From a responsive design perspective, templates often define **breakpoint-specific layouts**. A two-column desktop template might become single-column on mobile, with organisms reordering based on priority. The template orchestrates this transformation while organisms remain unchanged, maintaining the separation of concerns that makes Atomic Design powerful.

Templates also establish **content hierarchies and relationships**. A BlogPostTemplate might define: header at top, article content in main column, sidebar with related articles, comment section at bottom, footer at end. This structure guides users through content in intended order while maintaining flexibility for different articles. Here is an example of a simple template for a webpage called `HomePageTemplate`. This template might include a `Header` organism, a `MainContent` organism, and a `Footer` organism:

```jsx
// HomePageTemplate.js

import React from "react";
import Header from "./Header";
import MainContent from "./MainContent";
import Footer from "./Footer";

const HomePageTemplate = () => {
  return (
    <div>
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
};

export default HomePageTemplate;
```

In this example:

- `HomePageTemplate` is a template that assembles different organisms (in this case, `Header`, `MainContent`, and `Footer`) to define the structure of a complete webpage.

Now, let's create a simple `MainContent` organism as an example:

```jsx
// MainContent.js

import React from "react";

const MainContent = () => {
  return (
    <main>
      <h1>Welcome to My Website</h1>
      <p>This is the main content of the page.</p>
    </main>
  );
};

export default MainContent;
```

The `Header`, `MainContent`, and `Footer` components are used as molecules and organisms within the `HomePageTemplate` template.

Now, we can use the `HomePageTemplate` template in our application:

```jsx
// App.js

import React from "react";
import HomePageTemplate from "./HomePageTemplate";

const App = () => {
  return (
    <div>
      <HomePageTemplate />
    </div>
  );
};

export default App;
```

This demonstrates how templates can be used to structure different sections or pages of your application by combining organisms. Templates are higher-level components that help maintain a consistent layout across multiple pages.

## Code Examples

### Basic Example: Homepage Template

Here is an example of a simple template for a webpage called `HomePageTemplate`. This template might include a `Header` organism, a `MainContent` organism, and a `Footer` organism:

## References:
- [1] https://atomicdesign.bradfrost.com/chapter-2/