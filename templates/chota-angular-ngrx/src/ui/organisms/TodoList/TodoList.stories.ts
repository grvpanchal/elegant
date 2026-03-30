// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/angular/types-6-0";
import TodoList from "./TodoList.component";
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";
import LinkComponent from "src/ui/atoms/Link/Link.component";
import SkeletonComponent from "src/ui/skeletons/Skeleton/Skeleton.component";
import AlertComponent from "src/ui/atoms/Alert/Alert.component";
import AddTodoFormComponent from "src/ui/molecules/AddTodoForm/AddTodoForm.component";
import TodoItemsComponent from "src/ui/molecules/TodoItems/TodoItems.component";
import ImageComponent from "src/ui/atoms/Image/Image.component";
import IconButtonComponent from "src/ui/atoms/IconButton/IconButton.component";
import ButtonComponent from "src/ui/atoms/Button/Button.component";
import InputComponent from "src/ui/atoms/Input/Input.component";
import TodoItemComponent from "src/ui/atoms/TodoItem/TodoItem.component";
import LoaderComponent from "src/ui/atoms/Loader/Loader.component";

export default {
  title: "organisms/TodoList",
  component: TodoList,
  decorators: [
    moduleMetadata({
      declarations: [
        LinkComponent,
        SkeletonComponent,
        AlertComponent,
        AddTodoFormComponent,
        TodoItemsComponent,
        ImageComponent,
        IconButtonComponent,
        ButtonComponent,
        InputComponent,
        TodoItemComponent,
        LoaderComponent,
      ],
      imports: [CommonModule],
    }),
  ],
} as Meta;

const Template: Story<TodoList> = (args: TodoList) => ({
  component: TodoList,
  props: args,
});

const events = {
  onTodoCreate: () => {},
  onTodoEdit: () => {},
  onTodoUpdate: () => {},
  onTodoToggleUpdate: () => {},
  onTodoDelete: () => {},
};

export const Default = Template.bind({});
Default.args = {
  todoData: {
    todoItems: [
      { id: 0, text: "apple", completed: false },
      { id: 1, text: "mango", completed: false },
      { id: 2, text: "oranges", completed: false },
    ],
    currentTodoItem: {
      id: "",
      text: "",
      completed: false,
    },
  },
  events,
};

export const Empty = Template.bind({});
Empty.args = {
  todoData: {
    todoItems: [],
    currentTodoItem: {
      id: "",
      text: "",
      completed: false,
    },
  },
  events,
};

export const Loading = Template.bind({});
Loading.args = {
  todoData: {
    isContentLoading: true,
    todoItems: [],
    currentTodoItem: {
      id: "",
      text: "",
      completed: false,
    },
  },
  events,
};
