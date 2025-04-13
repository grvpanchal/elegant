---
title: Template
layout: doc
slug: template
---
# Template

A template in the context of Atomic Design is a higher-level component that defines the overall structure of a page or section. Here is an example of a simple template for a webpage called `HomePageTemplate`. This template might include a `Header` organism, a `MainContent` organism, and a `Footer` organism:

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

## References:
- [1] https://atomicdesign.bradfrost.com/chapter-2/