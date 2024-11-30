
import TodoFilters from "./TodoFilters.component";
export default { title: "Organisms/TodoFilters", component: TodoFilters };

const events ={
  onTodoFilterUpdate: () => {},
}

export const Default = {
  args: {
    filtersData: [
        { id: 0, label: 'apple', selected: false },
        { id: 1, label: 'mango', selected: false },
        { id: 2, label: 'oranges', selected: false },
      ],
    events,
  },
};

export const Empty = {
  args: {
    filtersData: [],
  events,
  },
};

export const Loading = {
  args: {
    filtersData: {
      isContentLoading: true
    },
    events,
  },
};



