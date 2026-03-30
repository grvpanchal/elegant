// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/angular/types-6-0";
import Layout from "./Layout.component";
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";

export default {
  title: "templates/Layout",
  component: Layout,
  argTypes: {
    backgroundColor: { control: "color" },
  },
  decorators: [
    moduleMetadata({
      declarations: [Layout],
      imports: [CommonModule],
    }),
  ],
} as Meta;

const Template: Story<Layout> = (args: Layout) => ({
  component: Layout,
  props: args,
  template: `
    <app-layout>{{label}}</app-layout>
  `
});

export const Default = Template.bind({});
Default.args = {
  label: "Content within the container",
};
