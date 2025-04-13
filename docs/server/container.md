---
title: Container
layout: doc
slug: container
---

# Container

The container components in React is a design pattern that has significantly impacted the author's coding practices. Here's a summary of the key points:

Container components are responsible for data fetching and then rendering their corresponding sub-components. The naming convention typically follows the pattern of `[ComponentName]Container` for the container and `[ComponentName]` for the sub-component[1].

## Benefits of Container Components

1. **Separation of Concerns**: Container components separate data fetching from rendering, improving code organization[1].

2. **Reusability**: By extracting data fetching logic, the rendering component becomes more reusable in different contexts[1].

3. **Improved Data Structure Handling**: Container components allow for better definition of data expectations through PropTypes, making it easier to catch and debug issues[1].

## Example Implementation

The article provides an example of refactoring a `TodoList` component:

1. **Before**: A single component handles both data fetching and rendering[1].

2. **After**: 
   - `TodoListContainer`: Manages data fetching and state
   - `TodoList`: A organism that receives data as props and handles rendering[1]

## Advantages Gained

By implementing the container component pattern, the author achieved:

- Clear separation between data fetching and rendering logic
- Increased reusability of the `TodoList` component
- Ability to set PropTypes for better data structure validation[1]

The author concludes by recommending the use of container components to improve React code organization and readability[1].

References

- [1] https://medium.com/@learnreact/container-components-c0e67432e005