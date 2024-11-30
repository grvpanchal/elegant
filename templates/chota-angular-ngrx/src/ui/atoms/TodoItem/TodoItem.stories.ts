// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";
import { Story, Meta } from "@storybook/angular/types-6-0";
import TodoItem from "./TodoItem.component";
import InputComponent from "../Input/Input.component";
import IconButtonComponent from "../IconButton/IconButton.component";
import ButtonComponent from "../Button/Button.component";
import ImageComponent from "../Image/Image.component";
import LoaderComponent from "../Loader/Loader.component";

export default {
  title: "Atoms/TodoItem",
  component: TodoItem,
  decorators: [
    moduleMetadata({
      declarations: [
        InputComponent,
        IconButtonComponent,
        ButtonComponent,
        ImageComponent,
        LoaderComponent,
      ],
      imports: [CommonModule],
    }),
  ],
} as Meta;

const Template: Story<TodoItem> = (args: TodoItem) => ({
  component: TodoItem,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  text: "Sample Todo",
  completed: false,
};
