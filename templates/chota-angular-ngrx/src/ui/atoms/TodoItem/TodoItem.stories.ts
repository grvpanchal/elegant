import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular';
import { provideStore } from '@ngrx/store';
import { reducers } from '../../../app/state/index';
import TodoItemComponent from './TodoItem.component';

type Story = StoryObj<TodoItemComponent>;

export default {
  title: 'Atoms/TodoItem',
  component: TodoItemComponent,
  decorators: [
    applicationConfig({
      providers: [provideStore(reducers)],
    }),
  ],
} satisfies Meta<TodoItemComponent>;

export const Default: Story = {
  args: {
    text: 'Sample Todo',
    completed: false,
  },
};

export const Completed: Story = {
  args: {
    text: 'Completed Todo',
    completed: true,
  },
};

