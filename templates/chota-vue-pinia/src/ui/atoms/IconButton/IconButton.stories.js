
import { defineComponent } from "vue";
import IconButton from "./IconButton.component.vue";
export default { title: "Atoms/IconButton", component: IconButton };

const Template = (args, { argTypes }) => defineComponent({
  components: { IconButton },
  setup: () => ({ args }),
  template: '<IconButton @onClick="args.onClick" :size="args.size" :variant="args.variant" :alt="alt" :iconName="args.iconName" />',
});

export const Default = Template.bind({});
Default.args = {
  variant: "clear",
  alt: "remove",
  iconName: "trash-2",
  size: "16",
  onClick: () => console.log('working on click'),
};