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
