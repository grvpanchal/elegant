// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/angular/types-6-0";
import Link from "./Link.component";
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";

export default {
  title: "Atoms/Link",
  component: Link,
  argTypes: {
    backgroundColor: { control: "color" },
  },
  decorators: [
    moduleMetadata({
      declarations: [Link],
      imports: [CommonModule],
    }),
  ],
} as Meta;

const Template: Story<Link> = (args: Link) => ({
  component: Link,
  props: args,
  template: `
    <app-link [isActive]="isActive">{{label}}</app-link>
  `
});

export const Default = Template.bind({});
Default.args = {
  label: "Sample Link",
  isActive: false,
};
