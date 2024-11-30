// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/angular/types-6-0";
import Button from "./Button.component";
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";
import LoaderComponent from "../Loader/Loader.component";

export default {
  title: "Atoms/Button",
  component: Button,
  decorators: [
    moduleMetadata({
      declarations: [Button, LoaderComponent],
      imports: [CommonModule],
    }),
  ],
} as Meta;

const Template: Story<Button> = (args: Button) => ({
  component: Button,
  props: args,
  template: `
    <app-button [classes]="classes" [isLoading]="isLoading">{{label}}</app-button>
  `
});

export const Default = Template.bind({});
Default.args = {
  classes: "button primary",
  label: "Button",
};

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
  classes: "button primary",
  label: "Sample Button",
};