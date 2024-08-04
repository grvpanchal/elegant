import { html } from 'lit';
import './app-button';

export default {
  title: 'Atoms/Button',
  render: (args) =>
    html`<app-button .classVal="${args.classVal}" .isLoading="${args.isLoading}" @onClick="${args.onClick}">${args.label}</app-button>`,
};

export const Default = {
  args: {
    classVal: 'button primary',
    label: 'Sample Button',
    onClick: () => console.log('click')
  },
};

export const Loading = {
  args: {
    isLoading: true,
    classVal: 'button primary',
    label: 'Sample Button',
  },
};
