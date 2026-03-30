import { html } from "lit";
import "./app-site-header"
export default { title: "Organisms/SiteHeader", render: (args) => html`<app-site-header .headerData=${args.headerData} .events=${args.events} ></app-todo-items>` };

const events ={
  onThemeChangeClick: () => {},
}

export const Default = {
  args: {
    headerData: {
        brandName: 'Todo App',
        theme: 'light'
      },
      events,
  },
};
