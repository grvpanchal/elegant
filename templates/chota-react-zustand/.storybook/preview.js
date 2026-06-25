/** @type { import('@storybook/react').Preview } */
import '../src/ui/theme.css';

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
