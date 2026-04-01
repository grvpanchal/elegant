import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular';
import { provideStore } from '@ngrx/store';
import { reducers } from '../../../app/state/index';
import TodoItemsComponent from './TodoItems.component';

type Story = StoryObj<TodoItemsComponent>;

export default {
  title: 'Molecules/TodoItems',
  component: TodoItemsComponent,
  decorators: [
    applicationConfig({
      providers: [provideStore(reducers)],
    }),
  ],
} satisfies Meta<TodoItemsComponent>;

export const Default: Story = {
  args: {
    todos: [
      { id: 0, text: 'apple', completed: false },
      { id: 1, text: 'mango', completed: false },
      { id: 2, text: 'oranges', completed: false },
    ],
    isDisabled: false,
  },
};

export const Empty: Story = {
  args: {
    todos: [],
    isDisabled: false,
  },
};

