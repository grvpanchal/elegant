import { html } from 'lit';
import './app-alert';

export default { title: "Atoms/Alert", render: (args) =>
  html`<app-alert .show="${args.show}" .message="${args.message}" .variant="${args.variant}"></app-alert>`, };

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
