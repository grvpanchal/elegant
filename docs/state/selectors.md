---
title: Selectors
layout: doc
slug: selectors
---

# Selectors
Selectors in state management are pure functions that extract and compute derived data from the application's state.

Key aspects of selectors include:
- Efficiency: Selectors use memoization to optimize performance, especially for expensive computations.
- Reusability: They can be shared across multiple components that need the same data.
- Simplification: Selectors can create view models that combine multiple pieces of state, simplifying component logic.

## Best Practice
Based on the search results and best practices in state management, here are key recommendations for working with selectors or views:

1. Keep Selectors Simple and Focused
   - Create selectors that target specific pieces of state
   - Avoid complex logic within selectors
   - Use composition to build more complex selectors from simpler ones

2. Use Memoization for Performance
   - Utilize libraries like Reselect to create memoized selectors
   - This optimizes performance by caching results and avoiding unnecessary recalculations

3. Centralize Selector Definitions
   - Define reusable selectors in a central location (e.g., in slice files or a dedicated selectors.js)
   - This improves maintainability and makes it easier to update state structure

4. Decouple Components from State Shape
   - Use selectors to abstract away the details of state structure from components
   - This makes it easier to refactor state without affecting components

5. Avoid Direct State Access in Components
   - Instead of accessing state directly, use selectors in useSelector hooks
   - This promotes better encapsulation and reusability

6. Compose Selectors for Complex Data Transformations
   - Build complex selectors by combining simpler ones
   - This improves readability and maintainability

7. Use Selectors for Derived Data
   - Calculate derived data in selectors rather than storing it in the state
   - This keeps the state minimal and avoids data duplication

8. Test Selectors Thoroughly
   - Write unit tests for selectors to ensure they work correctly
   - This is especially important for complex selectors

9. Consider Performance Implications
   - Be mindful of selector complexity and frequency of updates
   - Use memoization and other optimization techniques for expensive computations

10. Use Typed Selectors (for TypeScript projects)
    - Define proper types for selectors to improve type safety and developer experience

11. Avoid unnecessary re-renders
    - Ensure that your selectors only return new references when the underlying data has actually changed. This prevents unnecessary component re-renders.

By following these practices, you can create more maintainable, performant, and scalable state management solutions in your applications.

## References

- [1] https://30dayscoding.com/blog/mastering-the-use-selector-a-comprehensive-guide
- [2] https://tiennguyen.hashnode.dev/organizing-redux-code-best-practices-and-tips
- [3] https://codedamn.com/news/reactjs/what-are-the-best-practices-for-state-management-in-react
- [4] https://www.geeksforgeeks.org/why-are-selectors-considered-best-practice-in-react-redux/
- [5] https://stackoverflow.com/questions/74491856/how-should-i-use-selectors-in-redux-toolkit
- [6] https://deadsimplechat.com/blog/react-state-management-modern-guide/
- [7] https://30dayscoding.com/blog/using-selectors-in-react
- [8] https://javascript.plainenglish.io/boosting-redux-performance-with-memoized-selectors-best-practices-and-implementation-tips-51b4cf59d47c?gi=3d836a7c3ee8
- [9] https://www.linkedin.com/advice/3/what-best-practices-state-management-react-application-rphjc
- [10] https://redux.js.org/usage/deriving-data-selectors
- [11] https://www.reddit.com/r/reduxjs/comments/1dl7wim/should_you_exclusively_use_selectors_when/
- [12] https://stackoverflow.com/questions/71517397/react-redux-useselector-best-practice/74633021