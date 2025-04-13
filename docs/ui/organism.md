---
title: Organism
layout: doc
slug: organism
---

# Organism

> - UI connector to state
> - Deliver UX scaffolding to UI

Here is an example of an organism called `Header` that combines multiple molecules and atoms. The `Header` organism might consist of a `Logo` molecule, a `Navigation` molecule, and a `Button` atom for a user profile:

```jsx
// Header.js

import React from "react";
import Logo from "./Logo";
import Navigation from "./Navigation";
import Button from "./Button";

const Header = () => {
  return (
    <header>
      <Logo />
      <Navigation />
      <Button label="Profile" />
    </header>
  );
};

export default Header;
```

In this example:

- The `Header` organism is composed of the `Logo` molecule, `Navigation` molecule, and a `Button` atom for the user's profile.
- Each of these components (`Logo`, `Navigation`, and `Button`) can be considered atoms or molecules on their own.

Now, let's create the `Logo` and `Navigation` components:

```jsx
// Logo.js

import React from "react";

const Logo = () => {
  return <div className="logo">My Logo</div>;
};

export default Logo;
```

```jsx
// Navigation.js

import React from "react";

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
    </nav>
  );
};

export default Navigation;
```

In this setup, the `Logo` and `Navigation` components can be considered molecules, as they are composed of simpler atoms (e.g., a `div` for the logo and a list for navigation items).

We can then use the Header organism in your application:

```jsx
// App.js

import React from "react";
import Header from "./Header";

const App = () => {
  return (
    <div>
      <Header />
      {/* Other content goes here */}
    </div>
  );
};

export default App;
```

This illustrates how organisms in Atomic Design are composed of molecules and atoms to create larger and more complex components. The `Header` organism, in this case, represents a common structure that might appear at the top of many pages in our application.

## References

- [1] https://atomicdesign.bradfrost.com/chapter-2/