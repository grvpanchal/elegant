import { defineComponent } from 'vue'
import Button from "./Button.component.vue";

const Template = (args, { argTypes }) => defineComponent({
  components: { Button },
  setup: () => ({ args }),
  template: '<Button @onClick="args.onClick" :class="args.class" :isLoading="args.isLoading" > {{ args.label }} </Button>',
});
export default { title: "Atoms/Button", component: Button, };

export const Default = Template.bind({});
Default.args = {
  class: "button primary",
  label: "Sample Button",
  onClick: () => console.log('working on click'),
};

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
  class: "button primary",
  label: "Sample Button",
};
