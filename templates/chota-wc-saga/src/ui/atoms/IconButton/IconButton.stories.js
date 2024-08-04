import { html } from "lit";

export default {
  title: "Atoms/IconButton",
  render: (args) => html`
    <app-icon-button
      .variant=${args.variant}
      .alt=${args.alt}
      .iconName=${args.iconName}
      .size=${args.size}
      @onClick=${args.onClick}
    ></app-icon-button>
  `
};

export const Default = {
  args: {
    variant: "clear",
    alt: "remove",
    iconName: "trash-2",
    size: "16",
    children: "Sample IconButton",
    onClick: () => console.log('click')
  },
};