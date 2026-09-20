---
title: Element
layout: default
---

#### Component

- Basic building block of every modern JS framework.
- It is combination HTML, CSS and JavaScript.
- It represent single section of UI element. e.g. Button, SearchBox, Table, TableRow

1. React

- Use function component as it's recommended by React team
- Follow DRY (Don't Repeat Yourself) principle for declaration of state. e.g. You want to display the client side filtered list of the items then do not create the different state for it instead just filter it on the fly and pass filtered list to child component.
- To define props use the proptypes or typescript to define types
- Do not use prop as state if not needed. Use it only if default state is coming from some APIs.
- Avoid using effect if not needed. There are many cases where effects are not needed. Please refer [https://react.dev/learn/you-might-not-need-an-effect](https://react.dev/learn/you-might-not-need-an-effect)

{::nomarkdown}<div class="code-tabs">{:/}

React
```jsx
import React from 'react';

function Demo() {
  // JS
  return <div>Hello World</div>; // HTML;
}

export default Demo;
```

{::nomarkdown}</div>{:/}
