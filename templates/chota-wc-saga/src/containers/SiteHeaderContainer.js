import { LitElement, html } from 'lit-element';
import store, { useDispatch } from '../state';
import { connect } from 'pwa-helpers';

import '../ui/organisms/SiteHeader/app-site-header';

import { updateConfig } from "../state/config/config.actions";


export default class SiteHeaderContainer extends connect(store)(LitElement) {
  static get properties() {
    return {
      headerData: { type: Object },
      events: { type: Object }
    };
  }
  constructor() {
    super();
    const dispatch = useDispatch();
    this.events = {
      onThemeChangeClick: () => dispatch(
        updateConfig({ theme: this.configData.theme === "light" ? "dark" : "light" })
      ),
    };
  }
  stateChanged(state) {
    const configData = state.config;
    this.configData = state.config;
    this.headerData = { brandName: configData.name, theme: configData.theme };
  }
  render() {
    return html`
      <app-site-header
        .headerData=${this.headerData}
        .events=${this.events}
      ></app-site-header>
    `;
  }
}

customElements.define('site-header-container', SiteHeaderContainer);
