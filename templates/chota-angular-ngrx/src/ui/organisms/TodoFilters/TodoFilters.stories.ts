// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/angular/types-6-0";
import TodoFilters from "./TodoFilters.component";
import { moduleMetadata } from "@storybook/angular";
import LinkComponent from "src/ui/atoms/Link/Link.component";
import { CommonModule } from "@angular/common";
import SkeletonComponent from "src/ui/skeletons/Skeleton/Skeleton.component";
import FilterGroupComponent from "src/ui/molecules/FilterGroup/FilterGroup.component";

export default {
  title: "Organisms/TodoFilters",
  component: TodoFilters,
  decorators: [
    moduleMetadata({
      declarations: [LinkComponent, SkeletonComponent, FilterGroupComponent],
      imports: [CommonModule],
    }),
  ],
} as Meta;

const events = {
  onTodoFilterUpdate: () => {},
};

const Template: Story<TodoFilters> = (args: TodoFilters) => ({
  component: TodoFilters,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  filtersData: [
    { id: 0, label: "apple", selected: false },
    { id: 1, label: "mango", selected: false },
    { id: 2, label: "oranges", selected: false },
  ],
  events,
};

export const Empty = Template.bind({});
Empty.args = {
  filtersData: [],
  events,
};

export const Loading = Template.bind({});
Loading.args = {
  filtersData: {
    isContentLoading: true,
  },
  events,
};
