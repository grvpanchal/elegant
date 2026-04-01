import type { Meta, StoryObj } from '@storybook/angular';
import LayoutComponent from './Layout.component';

type Story = StoryObj<LayoutComponent>;

export default {
  title: 'Templates/Layout',
  component: LayoutComponent,
} satisfies Meta<LayoutComponent>;

export const Default: Story = {
  render: () => ({
    template: `<app-layout>Content within the container</app-layout>`,
  }),
};
