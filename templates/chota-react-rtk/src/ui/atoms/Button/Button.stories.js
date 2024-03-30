
import Button from "./Button.component";
export default { title: "Atoms/Button", component: Button };

export const Default = {
  args: {
    className: "button primary",
    children: "Sample Button",
  },
};

export const Loading = {
  args: {
    isLoading: true,
    className: "button primary",
    children: "Sample Button",
  },
};
