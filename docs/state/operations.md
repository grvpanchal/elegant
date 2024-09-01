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