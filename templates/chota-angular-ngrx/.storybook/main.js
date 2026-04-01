/** @type {import('@storybook/angular').StorybookConfig} */
const config = {
  stories: [
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-links"
  ],
  framework: {
    name: "@storybook/angular",
    options: {}
  },
  docs: {
    autodocs: "tag"
  }
};

module.exports = config;
