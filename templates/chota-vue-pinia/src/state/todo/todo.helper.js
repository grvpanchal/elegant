export const mapTodoData = (todoData) => {
  return todoData;
}

export const toggleCheckedState = (payload) => {
  return { ...payload, completed: !payload.completed };
}