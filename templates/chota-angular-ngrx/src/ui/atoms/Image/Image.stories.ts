import type { Meta, StoryObj } from '@storybook/angular';
import ImageComponent from './Image.component';

type Story = StoryObj<ImageComponent>;

export default {
  title: 'Atoms/Image',
  component: ImageComponent,
} satisfies Meta<ImageComponent>;

export const Primary: Story = {
  args: {
    alt: 'placeholder',
    src: 'https://placehold.co/600x400',
  },
};

