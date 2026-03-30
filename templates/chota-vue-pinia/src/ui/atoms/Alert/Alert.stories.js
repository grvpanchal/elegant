import Alert from "./Alert.component.vue";
export default { title: "Atoms/Alert", component: Alert };

export const Default = {
  args: {
    show: true,
    message: "Sample Alert",
  },
};

export const Error = {
  args: {
    show: true,
    variant: "error",
    message: "Sample Error Alert",
  },
};
