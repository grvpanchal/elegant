import React from "react";
import PropTypes from "prop-types";
import TodoItem from "../../atoms/Todo/Todo.component";

const TodoItems = ({ todos, onToggleClick, onEditClick, onDeleteClick }) => {
  return todos && todos.length ? (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          {...todo}
          onToggleClick={() => onToggleClick(todo)}
          onEditClick={() => onEditClick(todo)}
          onDeleteClick={() => onDeleteClick(todo.id)}
        />
      ))}
    </ul>
  ) : (
    <p className="text-center" style={{ paddingTop: '1.5rem' }}>Nothing to display here. Carry on.</p>
  );
};

TodoItems.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      completed: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  onToggleClick: PropTypes.func.isRequired,
};

export default TodoItems;
