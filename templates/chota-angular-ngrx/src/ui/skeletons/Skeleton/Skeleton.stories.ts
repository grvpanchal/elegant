import type { Meta, StoryObj } from '@storybook/angular';
import SkeletonComponent from './Skeleton.component';

type Story = StoryObj<SkeletonComponent>;

export default {
  title: 'Skeletons/Skeleton',
  component: SkeletonComponent,
} satisfies Meta<SkeletonComponent>;

export const Default: Story = {
  args: {
    variant: 'text',
  },
};

export const Image: Story = {
  args: {
    variant: 'text',
    height: '400px',
    width: '600px',
  },
};

export const Avatar: Story = {
  args: {
    variant: 'text',
    height: '64px',
    width: '64px',
  },
};

Avatar.args = {
  variant: "circle",
  height: "64px",
  width: "64px",
};
