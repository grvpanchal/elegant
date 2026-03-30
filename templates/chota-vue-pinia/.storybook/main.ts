import type { StorybookConfig } from "@storybook/vue3-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  async viteFinal(config) {
    // Merge custom configuration into the default config
    const { mergeConfig } = await import('vite');
 
    return mergeConfig(config, {
      // Add dependencies to pre-optimization
      optimizeDeps: {
        include: ['storybook-dark-mode'],
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: () => 'everything.js',
          },
        },
      },
    });
  },
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
};
export default config;
