import type { Meta, StoryObj } from '@storybook/angular';
import LoaderComponent from './Loader.component';

type Story = StoryObj<LoaderComponent>;

export default {
  title: 'Atoms/Loader',
  component: LoaderComponent,
} satisfies Meta<LoaderComponent>;

export const Default: Story = {
  args: {
    color: 'black',
    size: '64px',
  },
};

