import TodoList from "../ui/organisms/TodoList/TodoList.component";
import useStore from "../state";
import { getSelectedFilter } from "../state/filters/filters.selectors";
import { getVisibleTodos } from "../state/todo/todo.selectors";
import { useEffect } from "react";

export default function TodoListContainer() {
  const selectedFilter = useStore(getSelectedFilter);
  const todoState = useStore((state) => state.todo);
  const todoData = getVisibleTodos(todoState, selectedFilter.id);

  const readTodo = useStore((state) => state.readTodo);
  const createTodo = useStore((state) => state.createTodo);
  const editTodo = useStore((state) => state.editTodo);
  const updateTodo = useStore((state) => state.updateTodo);
  const toggleTodo = useStore((state) => state.toggleTodo);
  const deleteTodo = useStore((state) => state.deleteTodo);

  useEffect(() => {
    readTodo();
  }, [readTodo])

  /* istanbul ignore next */
  const events = {
    onTodoCreate: (payload) => createTodo(payload),
    onTodoEdit: (payload) => editTodo(payload),
    onTodoUpdate: (text) =>
      updateTodo({ id: todoData.currentTodoItem.id, text }),
    onTodoToggleUpdate: (id) => toggleTodo(id),
    onTodoDelete: (payload) => deleteTodo(payload),
  };

  return <TodoList todoData={todoData} events={events} />;
}
