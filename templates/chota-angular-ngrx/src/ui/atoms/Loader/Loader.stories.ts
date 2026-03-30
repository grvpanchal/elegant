// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/angular/types-6-0";
import Loader from "./Loader.component";

export default {
  title: "Atoms/Loader",
  component: Loader,
} as Meta;

const Template: Story<Loader> = (args: Loader) => ({
  component: Loader,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  color: 'black',
  size: '64px'
};
