
import { html } from 'lit';
import './app-link';

export default {
  title: "Atoms/Link",
  render: (args) => html`<app-link .active="${args.active}" @onClick="${args.onClick}">${args.label}</app-link>`
};

export const Default = {
  args: {
    href: "#",
    active: false,
    label: "Sample Link",
  },
};
