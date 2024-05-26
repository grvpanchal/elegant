# Atom

> - A single purpose component
> - Deliver display or interactiveness with single action

In React, an atom could be represented by a simple and reusable component that encapsulates a basic building block of the user interface. Here is an example of a `Button` component as an atom:

```js
// Button.js

import React from "react";

const Button = ({ onClick, label }) => {
  return <button onClick={onClick}>{label}</button>;
};

export default Button;
```

In this example, the Button component is a basic building block (atom) that takes two props:

- `onClick`: a function to be called when the button is clicked.
- `label`: the text content of the button.

This simple Button component can be reused throughout the application wherever a button is needed. When combining multiple atoms like this, we can start building more complex components (molecules, organisms, etc.) by composing them together.

Here's an example of how we might use this Button component in a parent component:

```js
// App.js

import React from "react";
import Button from "./Button";

const App = () => {
  const handleClick = () => {
    alert("Button clicked!");
  };

  return (
    <div>
      <h1>My App</h1>
      <Button onClick={handleClick} label="Click me" />
    </div>
  );
};

export default App;
```

In this example, the `App` component uses the `Button` atom by passing in an `onClick` function and a `label`. This follows the Atomic Design principles of building up more complex components by combining simpler ones.

## References:

- https://atomicdesign.bradfrost.com/chapter-2/#atoms
