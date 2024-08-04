import { html } from 'lit';
import './app-input';


export default { title: "Atoms/Input", render: (args) => html`<app-input .type=${args.type} .placeholder=${args.placeholder}></app-input>` };

export const Default = {
  args: {
    type: "text",
    placeholder: "Template Input",
  },
};
