
import { html } from "lit";
import "./app-todo-item";
export default { title: "Atoms/TodoItem", render: (args) => html`<app-todo-item .text=${args.text}></app-todo-item>` };

export const Default = {
  args: {
    text: 'Sample Todo',
  },
};
