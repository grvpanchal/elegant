import TodoList from "./TodoList.component.vue";
export default { title: "Organisms/TodoList", component: TodoList };

const events ={
  onTodoCreate: () => {},
  onTodoEdit: () => console.log('edit click'),
  onTodoUpdate: () => {},
  onTodoToggleUpdate: () => console.log('toggle click'),
  onTodoDelete: () => console.log('delete click'),
}

export const Default = {
  args: {
    todoData: {
      todoItems: [
        { id: 0, text: 'apple', completed: false },
        { id: 1, text: 'mango', completed: false },
        { id: 2, text: 'oranges', completed: false },
      ],
      currentTodoItem: {
        id: '',
        text: '',
        completed: false
      }
    },
    events,
  },
};

export const Empty = {
  args: {
    todoData: {
      todoItems: [],
      currentTodoItem: {
        id: '',
        text: '',
        completed: false
      }
    },
    events,
  },
};

export const Loading = {
  args: {
    todoData: {
      isContentLoading: true,
      todoItems: [],
      currentTodoItem: {
        id: '',
        text: '',
        completed: false
      }
    },
    events,
  },
};

export const Error = {
  args: {
    todoData: {
      error: 'Unable to load contents',
      isContentLoading: false,
      todoItems: [],
      currentTodoItem: {
        id: '',
        text: '',
        completed: false
      }
    },
    events,
  },
};



