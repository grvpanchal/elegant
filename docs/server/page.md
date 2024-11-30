---
title: Page
layout: default
---

# Page

> - Specific instances of templates that show what a UI looks like with real representative content in place.
> - Serves a single entry of a website

In the context of Atomic Design, a page is the final output that users interact with and is composed of templates, organisms, molecules, and atoms. Here is an example of a simple `HomePage` page component that uses the `HomePageTemplate` template:

```jsx
// HomePage.js

import React from "react";
import HomePageTemplate from "./HomePageTemplate";

const HomePage = () => {
  return (
    <div>
      <HomePageTemplate />
      {/* Additional page-specific content can go here */}
    </div>
  );
};

export default HomePage;
```

In this example:

* `HomePage` is a page component that renders the `HomePageTemplate` template.
* We can include additional page-specific content within the `HomePage` component, such as unique sections or features.

Now, when we use the `HomePage` component in our application, it represents the final page that users will see:

```jsx
// App.js

import React from "react";
import HomePage from "./HomePage";

const App = () => {
  return (
    <div>
      <HomePage />
    </div>
  );
};

export default App;
```

This structure follows the Atomic Design methodology, where atoms, molecules, organisms, templates, and pages are used to build a scalable and modular design system. The `HomePage` component serves as the entry point for a specific page in our application, composed of the various building blocks defined in the lower levels of the design hierarchy.

## References:

* https://atomicdesign.bradfrost.com/chapter-2/#pages
