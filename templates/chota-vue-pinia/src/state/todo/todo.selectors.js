export const getVisibleTodos = (todo, filter) => {
  let visibleTodos = [];
  switch (filter) {
    case 'SHOW_ALL':
      visibleTodos = todo.todoItems;
      break;
    case 'SHOW_COMPLETED':
      visibleTodos = todo.todoItems.filter((t) => t.completed);
      break;
    case 'SHOW_ACTIVE':
      visibleTodos = todo.todoItems.filter((t) => !t.completed);
      break;
    default:
      throw new Error("Unknown filter: " + filter);
  }

  return {
    ...todo,
    todoItems: visibleTodos,
  }
};
