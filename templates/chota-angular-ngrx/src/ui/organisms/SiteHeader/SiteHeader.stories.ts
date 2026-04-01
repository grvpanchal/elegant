import type { Meta, StoryObj } from '@storybook/angular';
import SiteHeaderComponent from './SiteHeader.component';

type Story = StoryObj<SiteHeaderComponent>;

export default {
  title: 'Organisms/SiteHeader',
  component: SiteHeaderComponent,
} satisfies Meta<SiteHeaderComponent>;

export const Default: Story = {
  args: {
    headerData: {
      theme: 'light',
      brandName: 'Todo App',
    },
    events: {
      onThemeChangeClick: () => {},
    },
  },
};

export const Dark: Story = {
  args: {
    headerData: {
      theme: 'dark',
      brandName: 'Todo App',
    },
    events: {
      onThemeChangeClick: () => {},
    },
  },
};

