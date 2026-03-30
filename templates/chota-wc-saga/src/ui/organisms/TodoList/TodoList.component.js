import { html } from "lit";
import "../../atoms/Alert/app-alert";
import "../../molecules/AddTodoForm/app-add-todo-form";
import "../../molecules/TodoItems/app-todo-items";
import "../../skeletons/Skeleton/app-skeleton";

export default function TodoList({ todoData, events }) {
  const {
    onTodoCreate,
    onTodoEdit,
    onTodoUpdate,
    onTodoToggleUpdate,
    onTodoDelete,
  } = events;
  return html`
      ${todoData.error ? html`
        <app-alert
          .variant=${"error"}
          .show=${!!todoData.error}
          .message=${todoData.error}
        ></app-alert>
      ` : null}
      <app-add-todo-form
        .todoValue=${todoData.currentTodoItem.text || ""}
        @onTodoAdd=${onTodoCreate}
        @onTodoUpdate=${onTodoUpdate}
        .placeholder=${"Add your task"}
        .isLoading=${todoData.isActionLoading}
        .buttonInfo=${{
          label: todoData.currentTodoItem.text ? "Save" : "Add",
          variant: "primary",
        }} 
      ></app-add-todo-form>
      ${todoData.isContentLoading ? html`
          <br />
          <app-skeleton height="24px" ></app-skeleton>
          <br />
          <app-skeleton height="24px" ></app-skeleton>
          <br />
          <app-skeleton height="24px" ></app-skeleton>
      ` : html`
          <app-todo-items
            .todos=${todoData.todoItems || []}
            .isDisabled=${todoData.isActionLoading}
            @onToggleClick=${onTodoToggleUpdate}
            @onDeleteClick=${onTodoDelete}
            @onEditClick=${onTodoEdit}
          ></app-todo-items>
      `}
  `;
}
