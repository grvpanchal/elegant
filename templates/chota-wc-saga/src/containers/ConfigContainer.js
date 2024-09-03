import { LitElement, html } from 'lit-element';
import store from '../state';
import { connect } from 'pwa-helpers';

export default class ConfigContainer extends connect(store)(LitElement) {
  static get properties() {
    return {
      theme: { type: String },
    };
  }
  stateChanged(state) {
    const configData = state.config;
    this.theme = configData.theme;
    const bodyClass = document.body.classList;
    configData.theme === 'dark'
      ? bodyClass.add("dark")
      : bodyClass.remove("dark");
  }
  render() {
    return html``;
  }
}

customElements.define('config-container', ConfigContainer);
