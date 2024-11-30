// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/angular/types-6-0";
import AddTodoForm from "./AddTodoForm.component";
import { moduleMetadata } from "@storybook/angular";
import InputComponent from "../../atoms/Input/Input.component";
import ButtonComponent from "../../atoms/Button/Button.component";
import LoaderComponent from "../../atoms/Loader/Loader.component";
import { CommonModule } from "@angular/common";

export default {
  title: "Molecules/AddTodoForm",
  component: AddTodoForm,
  decorators: [
    moduleMetadata({
      declarations: [InputComponent, ButtonComponent, LoaderComponent],
      imports: [CommonModule],
    }),
  ],
} as Meta;

const Template: Story<AddTodoForm> = (args: AddTodoForm) => ({
  component: AddTodoForm,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  todoValue: '',
    placeholder: "Add your task",
    isLoading: false,
    buttonInfo: {
      label: 'Add',
      variant: "primary",
    },
};

export const Loading = Template.bind({});
Loading.args = {
  todoValue: '',
    placeholder: "Add your task",
    isLoading: true,
    buttonInfo: {
      label: 'Add',
      variant: "primary",
    },
};
