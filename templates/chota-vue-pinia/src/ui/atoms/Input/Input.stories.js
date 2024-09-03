import { defineComponent } from "vue";
import Input from "./Input.component.vue";

const Template = (args, { argTypes }) => defineComponent({
  components: { Input },
  setup: () => ({ args }),
  template: '<Input :type="args.type" @onClick="args.onClick"  @onInput="args.onInput" :class="args.class" :isLoading="args.isLoading" > {{ args.label }} </Input>',
});


export default { title: "Atoms/Input", component: Input };

export const Default = Template.bind({});

Default.args = {
  type: "text",
  placeholder: "Template Input",
};

export const Checkbox = Template.bind({});

Checkbox.args = {
  type: "checkbox",
  label: "Template checkbox",
  onInput: () => console.log('click'),
};
