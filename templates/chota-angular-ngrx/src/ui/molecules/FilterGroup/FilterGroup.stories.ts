// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/angular/types-6-0";
import FilterGroup from "./FilterGroup.component";
import { moduleMetadata } from "@storybook/angular";
import LinkComponent from "../../atoms/Link/Link.component";
import { CommonModule } from "@angular/common";

export default {
  title: "Molecules/FilterGroup",
  component: FilterGroup,
  decorators: [
    moduleMetadata({
      declarations: [LinkComponent],
      imports: [CommonModule],
    }),
  ],
} as Meta;

const Template: Story<FilterGroup> = (args: FilterGroup) => ({
  component: FilterGroup,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  filterItems: [
    {
      id: '1',
      label: 'abc',
      selected: false,
    },
    {
      id: '2',
      label: 'xyz',
      selected: false,
    },
    {
      id: '3',
      label: 'pqr',
      selected: true,
    },
  ],
  onFilterClick: (e) => { console.log(e) },
};
