

import "./TodoItem.style.css";

import Input from "../Input/Input.component";
import IconButton from "../IconButton/IconButton.component";
import { propTypes } from "./TodoItem.type";

const TodoItem = ({
  onToggleClick,
  completed,
  text,
  id,
  onEditClick,
  onDeleteClick,
}) => (
  <li
    style={{
      textDecoration: completed ? "line-through" : "none",
    }}
    className="todo-item"
  >
    <label htmlFor={`checkbox${id}`}>
      <Input
        id={`checkbox${id}`}
        onClick={onToggleClick}
        name="checkbox"
        type="checkbox"
        onChange={(e) => e.target.value}
        checked={completed}
      />
      {text}
      <span className="icon-buttons">
        <IconButton
          variant="clear"
          alt="edit"
          iconName="edit"
          size="16"
          onClick={onEditClick}
        />
        <IconButton
          variant="clear"
          alt="remove"
          iconName="trash-2"
          size="16"
          onClick={onDeleteClick}
        />
      </span>
    </label>
  </li>
);

TodoItem.propTypes = propTypes;

export default TodoItem;
