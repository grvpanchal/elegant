// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/angular/types-6-0";
import IconButton from "./IconButton.component";
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";
import Image from "../Image/Image.component";
import Button from "../Button/Button.component";
import LoaderComponent from "../Loader/Loader.component";

export default {
  title: "Atoms/IconButton",
  component: IconButton,
  argTypes: {
    backgroundColor: { control: "color" },
  },
  decorators: [
    moduleMetadata({
      declarations: [Image, Button, LoaderComponent],
      imports: [CommonModule],
    }),
  ],
} as Meta;

const Template: Story<IconButton> = (args: IconButton) => ({
  component: IconButton,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  variant: "clear",
  alt: "remove",
  iconName: "trash-2",
  size: "16",
};
