import { html } from "lit";
import "./app-skeleton";
export default { title: "Skeletons/Skeleton", render: (args) => html`<app-skeleton .styleCSS=${args.styleCSS} .variant=${args.variant} .height=${args.height} .width=${args.width}></app-skeleton>` };

export const Default = {
  args: {
    variant: "text",
  },
};

export const Image = {
  args: {
    variant: "text",
    height: "400px",
    width: "600px",
  },
};

export const Avatar = {
    args: {
      variant: "circle",
      height: "64px",
      width: "64px",
    },
  };
