import { html } from "lit";
import "./app-add-todo-form";

export default {
  title: "Molecules/AddTodoForm", 
  render: (args) => html`<app-add-todo-form .todo=${args.todoValue} .placeholder=${args.placeholder} .isLoading=${args.isLoading} .buttonInfo=${args.buttonInfo}
></app-add-todo-form>` };

export const Default = {
  args: {
    todoValue: '',
    placeholder: "Add your task",
    isLoading: false,
    buttonInfo: {
      label: 'Add',
      variant: "primary",
    },
  },
};

export const Loading = {
  args: {
    todoValue: '',
    placeholder: "Add your task",
    isLoading: true,
    buttonInfo: {
      label: 'Add',
      variant: "primary",
    },
  },
};