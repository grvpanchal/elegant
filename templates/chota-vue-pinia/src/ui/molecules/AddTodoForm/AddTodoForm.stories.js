import AddTodoForm from "./AddTodoForm.component.vue";
export default { title: "Molecules/AddTodoForm", component: AddTodoForm };

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