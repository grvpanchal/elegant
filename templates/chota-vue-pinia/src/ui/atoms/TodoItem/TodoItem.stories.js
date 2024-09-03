
import { defineComponent } from "vue";
import TodoItem from "./TodoItem.component.vue";

const Template = (args, { argTypes }) => defineComponent({
  components: { TodoItem },
  setup: () => ({ args }),
  template: '<TodoItem :text="args.text" @onToggleClick="args.onToggleClick" ></TodoItem>',
});

export default { title: "Atoms/TodoItem", component: TodoItem };

export const Default = Template.bind({});
Default.args = {
  text: 'Sample Todo',
  onToggleClick: () => console.log('onToggleClick'),
};
