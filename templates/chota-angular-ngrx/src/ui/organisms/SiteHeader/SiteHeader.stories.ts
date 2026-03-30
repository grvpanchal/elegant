// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/angular/types-6-0";
import SiteHeader from "./SiteHeader.component";

export default {
  title: "organisms/SiteHeader",
  component: SiteHeader,
} as Meta;

const Template: Story<SiteHeader> = (args: SiteHeader) => ({
  component: SiteHeader,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  headerData: {
    theme: "light",
    brandName: "Todo App",
  }
};

