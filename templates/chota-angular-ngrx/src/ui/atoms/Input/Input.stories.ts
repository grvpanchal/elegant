import type { Meta, StoryObj } from '@storybook/angular';
import InputComponent from './Input.component';

type Story = StoryObj<InputComponent>;

export default {
  title: 'Atoms/Input',
  component: InputComponent,
} satisfies Meta<InputComponent>;

export const Default: Story = {
  args: {
    type: 'text',
    placeholder: 'Template Input',
  },
};

export const Checkbox: Story = {
  args: {
    type: 'checkbox',
    name: 'checkbox',
    checked: false,
  },
};

