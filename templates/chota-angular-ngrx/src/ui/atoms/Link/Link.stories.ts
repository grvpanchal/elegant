import type { Meta, StoryObj } from '@storybook/angular';
import LinkComponent from './Link.component';

type Story = StoryObj<LinkComponent>;

export default {
  title: 'Atoms/Link',
  component: LinkComponent,
} satisfies Meta<LinkComponent>;

export const Default: Story = {
  args: {
    isActive: false,
  },
  render: (args) => ({
    props: args,
    template: `<app-link [isActive]="isActive">Sample Link</app-link>`,
  }),
};

export const Active: Story = {
  args: {
    isActive: true,
  },
  render: (args) => ({
    props: args,
    template: `<app-link [isActive]="isActive">Active Link</app-link>`,
  }),
};

