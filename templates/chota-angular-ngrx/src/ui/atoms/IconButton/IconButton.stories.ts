import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular';
import { provideStore } from '@ngrx/store';
import { reducers } from '../../../app/state/index';
import IconButtonComponent from './IconButton.component';

type Story = StoryObj<IconButtonComponent>;

export default {
  title: 'Atoms/IconButton',
  component: IconButtonComponent,
  decorators: [
    applicationConfig({
      providers: [provideStore(reducers)],
    }),
  ],
} satisfies Meta<IconButtonComponent>;

export const Default: Story = {
  args: {
    variant: 'clear',
    alt: 'remove',
    iconName: 'trash-2',
    size: '16',
  },
};

export const Edit: Story = {
  args: {
    variant: 'clear',
    alt: 'edit',
    iconName: 'edit',
    size: '16',
  },
};

