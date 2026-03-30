// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/angular/types-6-0";
import Image from "./Image.component";

export default {
  title: "Atoms/Image",
  component: Image,
} as Meta;

const Template: Story<Image> = (args: Image) => ({
  component: Image,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  alt:"placeholder",
  src: "https://placehold.co/600x400",
};

