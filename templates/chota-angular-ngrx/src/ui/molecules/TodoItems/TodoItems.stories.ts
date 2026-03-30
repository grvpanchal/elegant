// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/angular/types-6-0";
import TodoItems from "./TodoItems.component";
import { moduleMetadata } from "@storybook/angular";
import ButtonComponent from "../../atoms/Button/Button.component";
import LoaderComponent from "../../atoms/Loader/Loader.component";
import TodoItemComponent from "../../atoms/TodoItem/TodoItem.component";
import { CommonModule } from "@angular/common";
import InputComponent from "../../atoms/Input/Input.component";
import IconButtonComponent from "../../atoms/IconButton/IconButton.component";
import ImageComponent from "../../atoms/Image/Image.component";

export default {
  title: "Molecules/TodoItems",
  component: TodoItems,
  decorators: [
    moduleMetadata({
      declarations: [
        ButtonComponent,
        LoaderComponent,
        TodoItemComponent,
        InputComponent,
        IconButtonComponent,
        ImageComponent,
      ],
      imports: [CommonModule],
    }),
  ],
} as Meta;

const Template: Story<TodoItems> = (args: TodoItems) => ({
  component: TodoItems,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  todos: [
    { id: 0, text: "apple", completed: false },
    { id: 1, text: "mango", completed: false },
    { id: 2, text: "oranges", completed: false },
  ],
};
