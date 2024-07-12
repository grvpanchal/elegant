








## Fonts (UI)
- https://web.dev/articles/optimize-webfont-loading

## Rendering
- https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/

-----------------------------------------------------------

# State

## State Basics

- https://deadsimplechat.com/blog/react-state-management-modern-guide/

## Actions

- Atomic Events are linked with Actions in container
- A reducer has a single entity in CRUD action
- An Operation has three entities in CRUD action i.e. loading / loader / initial, success and error
   - loading / loader / initial work with trigger on page / organism load and can be linked with Skeleton
   - Success Entity is linked with Organism Data props
   - Error Entity is linked Alerts of page or organism
- Hydrate Action for SSR. Investigate??

## CRUD

- https://www.codecademy.com/article/what-is-crud
 - REST
   - CREATE: fetch('todo', { body, method: post })
   - READ: fetch('todo')
   - UPDATE: fetch('todo', { body, method: put })
   - DELETE: fetch('todo', { body, method: delete })
 - GraphQL
   - CREATE: mutation { createTodoItem }
   - READ: query { readTodoItems } 
   - EDIT: query { editTodoItem }
   - UPDATE: mutation { updateTodoItem }
   - DELETE: mutation { deleteTodoItem }

   ```jsx
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
  ```

## AJAX
- https://www.w3schools.com/js/js_ajax_intro.asp
- showcase
```js
const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    document.getElementById("demo").innerHTML = this.responseText;
    }
   xhr.timeout = 10000;
  xhttp.open("GET", "ajax_info.txt", true);
  xhttp.send();
  ```
- showcase 
```js
fetch('todo', { signal: AbortSignal.timeout(10000) })
   .then(r => r.json())
   .then(d => d);
```
- Timeout Strategy
- Single point of entry and exit

## Reducer
- https://www.geeksforgeeks.org/explain-reducers-in-redux/#
- Initial State Declation
```js
const intialTodoState = {
  isLoading: false,

  error: '',
  todoItems: [],
  currentTodoItem: {
    text: '',
    id: ''
  }
};
```
- Sync CRUD
   - CREATE - Spread Array
   - READ - Reducer Selector / view function
   - UPDATE - Array Map method
   - EDIT - Reducer Selector / view function for single item
   - DELETE - Array filter method
- Fixed types

## Operations

- CRUD Operation
- Initial State Declation
```js
const intialTodoState = {
  isLoading: false, // API and lozy loading reference
  isActionLoading: false, // All events are disabled
  isContentLoading: false, // Skeleton / Cicular Loader only
  error: '',
  todoItems: [],
  currentTodoItem: {
    text: '',
    id: ''
  }
};
```
- Sync CRUD
   - CREATE - Active Async Add 
   - READ - Active Async loading State
   - UPDATE - Passive Async form disabled State with Previous state on error
   - EDIT - Reducer Selector / view / detailed API function for single item
   - DELETE - Passive Async State with Previous state on error
- Fixed types

## Selectors

- https://redux.js.org/usage/deriving-data-selectors
- Caching / Rerender Performance