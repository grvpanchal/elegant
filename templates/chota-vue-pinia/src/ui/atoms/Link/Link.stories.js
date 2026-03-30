
import { defineComponent } from "vue";
import Link from "./Link.component.vue";
export default { title: "Atoms/Link", component: Link };

const Template = (args) => defineComponent({
  components: { Link },
  setup: () => ({ args }),
  components: { Link },
  template: '<Link @onClick="args.onClick" :class="args.class"> {{ args.label }} </Link>',
});

export const Default = Template.bind({});

Default.args = {
  href: "#",
  className: "button clear",
  label: "Sample Link",
};
