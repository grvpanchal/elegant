import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular';
import { provideStore } from '@ngrx/store';
import { reducers } from 'src/app/state/index';
import TodoListComponent from './TodoList.component';

type Story = StoryObj<TodoListComponent>;

const events = {
  onTodoCreate: () => {},
  onTodoEdit: () => {},
  onTodoUpdate: () => {},
  onTodoToggleUpdate: () => {},
  onTodoDelete: () => {},
};

export default {
  title: 'Organisms/TodoList',
  component: TodoListComponent,
  decorators: [
    applicationConfig({
      providers: [provideStore(reducers)],
    }),
  ],
} satisfies Meta<TodoListComponent>;

export const Default: Story = {
  args: {
    todoData: {
      todoItems: [
        { id: 0, text: 'apple', completed: false },
        { id: 1, text: 'mango', completed: false },
        { id: 2, text: 'oranges', completed: false },
      ],
      currentTodoItem: { id: null, text: '' },
      isLoading: false,
      isActionLoading: false,
      isContentLoading: false,
      error: '',
    },
    events,
  },
};

export const Empty: Story = {
  args: {
    todoData: {
      todoItems: [],
      currentTodoItem: { id: null, text: '' },
      isLoading: false,
      isActionLoading: false,
      isContentLoading: false,
      error: '',
    },
    events,
  },
};

export const Loading: Story = {
  args: {
    todoData: {
      todoItems: [],
      currentTodoItem: { id: null, text: '' },
      isLoading: false,
      isActionLoading: false,
      isContentLoading: true,
      error: '',
    },
    events,
  },
};

