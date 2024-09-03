import { html } from "lit";
import "./app-todo-items"
export default { title: "Molecules/TodoItems", render: (args) => html`<app-todo-items .todos=${args.todos} ></app-todo-items>` };

export const Default = {
  args: {
    todos: [
      { id: 0, text: 'apple', completed: false },
      { id: 1, text: 'mango', completed: false },
      { id: 2, text: 'oranges', completed: false },
    ],
    onClick: (e) => { e.preventDefault(); console.log('asdasd') },
  },
};
