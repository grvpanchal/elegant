import TodoItems from "./TodoItems.component.vue";
export default { title: "Molecules/TodoItems", component: TodoItems };

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
