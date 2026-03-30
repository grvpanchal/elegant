import TodoList from "../ui/organisms/TodoList/TodoList.component";
import { useDispatch, useSelector } from "react-redux";
import {
  createTodo,
  deleteTodo,
  editTodo,
  toggleTodo,
  updateTodo,
} from "../state/todo/todo.actions";
import { getSelectedFilter } from "../state/filters/filters.selectors";
import { getVisibleTodos } from "../state/todo/todo.selectors";

export default function TodoListContainer() {
  const dispatch = useDispatch();
  const selectedFilter = useSelector(getSelectedFilter);
  const todoData = useSelector((state) =>
    getVisibleTodos(state.todo, selectedFilter.id)
  );

  const events = {
    onTodoCreate: (payload) => dispatch(createTodo(payload)),
    onTodoEdit: (payload) => dispatch(editTodo(payload)),
    onTodoUpdate: (text) =>
      dispatch(updateTodo({ id: todoData.currentTodoItem.id, text })),
    onTodoToggleUpdate: (id) => dispatch(toggleTodo(id)),
    onTodoDelete: (payload) => dispatch(deleteTodo(payload)),
  };

  return <TodoList todoData={todoData} events={events} />;
}
