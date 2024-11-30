// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";
import { Story, Meta } from "@storybook/angular/types-6-0";
import Alert from "./Alert.component";
import ImageComponent from "../Image/Image.component";
import IconButtonComponent from "../IconButton/IconButton.component";
import ButtonComponent from "../Button/Button.component";
import LoaderComponent from "../Loader/Loader.component";

export default {
  title: "Atoms/Alert",
  component: Alert,
  decorators: [
    moduleMetadata({
      declarations: [ImageComponent, IconButtonComponent, ButtonComponent, LoaderComponent],
      imports: [CommonModule],
    }),
  ],
} as Meta;

const Template: Story<Alert> = (args: Alert) => ({
  component: Alert,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  show: true,
  message: "Sample Alert",
};

export const Error = Template.bind({});
Error.args = {
  show: true,
  variant: "error",
  message: "Sample Error Alert",
};
