// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/angular/types-6-0";
import Input from "./Input.component";

export default {
  title: "Atoms/Input",
  component: Input,
} as Meta;

const Template: Story<Input> = (args: Input) => ({
  component: Input,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  type: "text",
  placeholder: "Template Input",
};
