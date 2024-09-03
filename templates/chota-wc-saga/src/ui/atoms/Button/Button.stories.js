import { html } from 'lit';
import './app-button';

export default {
  title: 'Atoms/Button',
  render: (args) =>
    html`<app-button .classes="${args.classes}" .isLoading="${args.isLoading}" @onClick="${args.onClick}">${args.label}</app-button>`,
};

export const Default = {
  args: {
    classes: 'button primary',
    label: 'Sample Button',
    onClick: (e) => console.log('click', e.detail)
  },
};

export const Loading = {
  args: {
    isLoading: true,
    classes: 'button primary',
    label: 'Sample Button',
  },
};
