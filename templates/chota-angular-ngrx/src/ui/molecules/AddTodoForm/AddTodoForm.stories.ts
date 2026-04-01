import type { Meta, StoryObj } from '@storybook/angular';
import AddTodoFormComponent from './AddTodoForm.component';

type Story = StoryObj<AddTodoFormComponent>;

export default {
  title: 'Molecules/AddTodoForm',
  component: AddTodoFormComponent,
} satisfies Meta<AddTodoFormComponent>;

export const Default: Story = {
  args: {
    todoValue: '',
    placeholder: 'Add your task',
    isLoading: false,
    buttonInfo: {
      label: 'Add',
      variant: 'primary',
    },
  },
};

export const Loading: Story = {
  args: {
    todoValue: '',
    placeholder: 'Add your task',
    isLoading: true,
    buttonInfo: {
      label: 'Add',
      variant: 'primary',
    },
  },
};

