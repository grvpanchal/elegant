import { html } from "lit";
import style from "./TodoItem.style";

import useComputedStyles from "../../../utils/theme/hooks/useComputedStyles";
import emit from "../../../utils/events/emit";

import "../Input/app-input";
import "../IconButton/app-icon-button";

function TodoItem({
  onToggleClick,
  completed,
  text,
  id,
  onEditClick,
  onDeleteClick,
}) { 
  useComputedStyles(this, [style]);
  return html`
  <li
    style=${
      `text-decoration: ${completed ? "line-through" : "none"};`
    }
    class="todo-item"
  >
    <label htmlFor=${`checkbox${id}`}>
      <app-input
        id=${`checkbox${id}`}
        @onInput=${(e) => emit(this, "onToggleClick", e)}
        name="checkbox"
        .type=${`checkbox`}
        @onChange=${(e) => e.target.value}
        .checked=${completed}
      ></app-input>
        ${text}
      <span class="icon-buttons">
        <app-icon-button
          .variant=${`clear`}
          .alt=${`edit`}
          .iconName=${`edit`}
          .size=${`16`}
          @onClick=${(e) => emit(this, "onEditClick", e)}
        ></app-icon-button>
        <app-icon-button
          .variant=${`clear`}
          .alt=${`edit`}
          .iconName=${`trash-2`}
          .size=${`16`}
          @onClick=${(e) => emit(this, "onDeleteClick", e)}
        ></app-icon-button>
      </span>
    </label>
  </li>
  `;
}

export default TodoItem;
