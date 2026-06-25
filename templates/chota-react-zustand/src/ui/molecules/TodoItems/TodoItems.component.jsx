import "./TodoItems.style.css";

import TodoItem from "../../atoms/TodoItem/TodoItem.component";
import { propTypes } from "./TodoItems.type";

const TodoItems = ({ todos, isDisabled, onToggleClick, onEditClick, onDeleteClick }) => {
  return todos && todos.length ? (
    <ul className="todo-items">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          {...todo}
          isDisabled={isDisabled}
          onToggleClick={() => onToggleClick(todo)}
          onEditClick={() => onEditClick(todo)}
          onDeleteClick={() => onDeleteClick(todo.id)}
        />
      ))}
    </ul>
  ) : (
    <p className="text-center empty-text">Nothing to display here. Carry on.</p>
  );
};

TodoItems.propTypes = propTypes

export default TodoItems;
