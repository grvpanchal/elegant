import type { Meta, StoryObj } from '@storybook/angular';
import TodoFiltersComponent from './TodoFilters.component';

type Story = StoryObj<TodoFiltersComponent>;

const events = {
  onTodoFilterUpdate: () => {},
};

export default {
  title: 'Organisms/TodoFilters',
  component: TodoFiltersComponent,
} satisfies Meta<TodoFiltersComponent>;

export const Default: Story = {
  args: {
    filtersData: [
      { id: 'SHOW_ALL', label: 'All', selected: true },
      { id: 'SHOW_ACTIVE', label: 'Active', selected: false },
      { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
    ],
    events,
  },
};

export const Empty: Story = {
  args: {
    filtersData: [],
    events,
  },
};

