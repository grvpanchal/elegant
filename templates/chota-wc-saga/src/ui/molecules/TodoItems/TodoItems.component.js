import { html } from "lit";
import style from "./TodoItems.style";
import useComputedStyles from "../../../utils/theme/hooks/useComputedStyles";
import emit from "../../../utils/events/emit";
import "../../atoms/TodoItem/app-todo-item";

function TodoItems({ todos, isDisabled }) {
  useComputedStyles(this, [style]);

  return todos && todos.length ? html`
    <ul class="todo-items">
      ${todos.map((todo) => html`
        <app-todo-item
          .key=${todo.id}
          .id=${todo.id}
          .text=${todo.text}
          .completed =${todo.completed}
          .isDisabled=${isDisabled}
          @onToggleClick=${() => emit(this, "onToggleClick", todo)}
          @onEditClick=${() => emit(this, "onEditClick", todo)}
          @onDeleteClick=${() => emit(this, "onDeleteClick", todo.id)}
        ></app-todo-item>
      `)}
    </ul>
  ` : html`
    <p class="text-center empty-text">Nothing to display here. Carry on.</p>
  `;
};

export default TodoItems;
