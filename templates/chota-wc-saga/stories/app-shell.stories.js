import { html } from 'lit';
import '../src/app-shell.js';

export default {
  title: 'AppShell',
  component: 'app-shell',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ header, backgroundColor }) {
  return html`
    <app-shell
      style="--app-shell-background-color: ${backgroundColor || 'white'}"
      .header=${header}
    >
    </app-shell>
  `;
}

export const App = Template.bind({});
App.args = {
  header: 'My app',
};
