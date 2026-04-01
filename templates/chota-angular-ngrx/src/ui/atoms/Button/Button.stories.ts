import type { Meta, StoryObj } from '@storybook/angular';
import ButtonComponent from './Button.component';

type Story = StoryObj<ButtonComponent>;

export default {
  title: 'Atoms/Button',
  component: ButtonComponent,
} satisfies Meta<ButtonComponent>;

export const Default: Story = {
  args: {
    classes: 'button primary',
    isLoading: false,
  },
  render: (args) => ({
    props: args,
    template: `<app-button [classes]="classes" [isLoading]="isLoading">Button</app-button>`,
  }),
};

export const Loading: Story = {
  args: {
    isLoading: true,
    classes: 'button primary',
  },
  render: (args) => ({
    props: args,
    template: `<app-button [classes]="classes" [isLoading]="isLoading">Sample Button</app-button>`,
  }),
};
