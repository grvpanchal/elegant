---
title: CRUD
layout: doc
slug: crud
---

# CRUD

CRUD stands for Create, Read, Update, and Delete, which are the four basic operations performed on persistent storage in computer programming. In the context of databases:

* Create corresponds to INSERT in SQL
* Read corresponds to SELECT in SQL  
* Update corresponds to UPDATE in SQL
* Delete corresponds to DELETE in SQL

For state management actions, there are some common naming conventions and best practices:

01. Use a consistent naming pattern, such as "domain/eventName" (e.g. "todos/addTodo").

02. Use descriptive action names that clearly indicate what the action does.

03. Define action types as constants to prevent typos and improve maintainability.

04. Use all uppercase for action type constants (e.g. ADD_TODO).

05. Avoid putting non-serializable values in actions.

06. Keep actions simple and focused on a single task.

07. Use action creators to encapsulate action creation logic.

08. Consider using a "request/success/failure" pattern for asynchronous actions (e.g. FETCH_TODOS_REQUEST, FETCH_TODOS_SUCCESS, FETCH_TODOS_FAILURE).

09. Group related actions together, either in the same file or using a feature-based folder structure.

10. Use prefixes or suffixes to indicate special action behaviors (e.g. _INIT for initializing state, _UPDATE for updating existing state).

By following these conventions, you can create a more organized and maintainable state management codebase. The specific naming convention you choose should be consistent throughout your project and easily understood by your team.

Below is an example of basic implementation of CRUD naming for you state actions

```jsx
   // ...
   useEffect(() => {
    dispatch(readTodo());
  }, [dispatch])

   const events = {
    onTodoCreate: (payload) => dispatch(createTodo(payload)),
    onTodoEdit: (payload) => dispatch(editTodo(payload)),
    onTodoUpdate: (text) =>
      dispatch(updateTodo({ id: todoData.currentTodoItem.id, text })),
    onTodoToggleUpdate: (id) => dispatch(toggleTodo(id)),
    onTodoDelete: (payload) => dispatch(deleteTodo(payload)),
  };
  // ...
  ```

## References
- [1] https://en.wikipedia.org/wiki/CRUD_(acronym)
- [2] https://davembush.github.io/rethinking-action-names-redux-ngrx/
- [3] https://www.strongdm.com/what-is/crud-vs-rest
- [4] https://30dayscoding.com/blog/what-is-action-in-redux
- [5] https://www.sumologic.com/glossary/crud/
- [6] https://redux.js.org/style-guide/
- [7] https://www.crowdstrike.com/en-us/cybersecurity-101/observability/crud/
- [8] https://www.logicmonitor.com/blog/rest-vs-crud
- [9] https://www.cogentinfo.com/resources/what-are-crud-operations
- [10] https://www.codecademy.com/article/what-is-crud
- [11] https://www.index.dev/blog/redux-state-update-best-practices-action-creators
- [12] https://stackoverflow.com/questions/51194929/best-practice-for-naming-redux-action-type-description
- [13] https://www.reddit.com/r/reactjs/comments/m1vrg9/best_practice_for_naming_reducers_and_action/
- [14] https://tiennguyen.hashnode.dev/organizing-redux-code-best-practices-and-tips
- [15] https://github.com/redux-saga/redux-saga/issues/1319