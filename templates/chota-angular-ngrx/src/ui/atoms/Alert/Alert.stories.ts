import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular';
import { provideStore } from '@ngrx/store';
import { reducers } from '../../../app/state/index';
import AlertComponent from './Alert.component';

type Story = StoryObj<AlertComponent>;

export default {
  title: 'Atoms/Alert',
  component: AlertComponent,
  decorators: [
    applicationConfig({
      providers: [provideStore(reducers)],
    }),
  ],
} satisfies Meta<AlertComponent>;

export const Default: Story = {
  args: {
    show: true,
    message: 'Sample Alert',
  },
};

export const Error: Story = {
  args: {
    show: true,
    variant: 'error',
    message: 'Sample Error Alert',
  },
};

