
import { render } from "lit";
import TodoItem from "./TodoItem.component";
export default { title: "Atoms/TodoItem", render: TodoItem };

export const Default = {
  args: {
    text: 'Sample Todo',
  },
};
