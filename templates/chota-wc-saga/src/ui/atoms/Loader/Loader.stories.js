
import { html } from "lit";
import './app-loader';

export default {
  title: "Atoms/Loader",
  render: (args) => html`<app-loader .color=${args.color} .size=${args.size}></app-loader>`  };

export const Default = {
  args: {
    color: 'black',
    size: '64px'
  },
};
