// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/angular/types-6-0";
import Skeleton from "./Skeleton.component";

export default {
  title: "Skeletons/Skeleton",
  component: Skeleton,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as Meta;

const Template: Story<Skeleton> = (args: Skeleton) => ({
  component: Skeleton,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  variant: "text",
};

export const Image = Template.bind({});
Image.args = {
  variant: "text",
  height: "400px",
  width: "600px",
};

export const Avatar = Template.bind({});
Avatar.args = {
  variant: "circle",
  height: "64px",
  width: "64px",
};
