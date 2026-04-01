import type { Meta, StoryObj } from '@storybook/angular';
import FilterGroupComponent from './FilterGroup.component';

type Story = StoryObj<FilterGroupComponent>;

export default {
  title: 'Molecules/FilterGroup',
  component: FilterGroupComponent,
} satisfies Meta<FilterGroupComponent>;

export const Primary: Story = {
  args: {
    filterItems: [
      { id: 'SHOW_ALL', label: 'All', selected: true },
      { id: 'SHOW_ACTIVE', label: 'Active', selected: false },
      { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
    ],
  },
};

export const Empty: Story = {
  args: {
    filterItems: [],
  },
};

