import { LitElement } from "lit";

class ChotaElement extends HTMLElement {
  connectedCallback() {
    super.connectedCallback();
    console.log('connected', this.shadowRoot);
    this.shadowRoot.adoptedStyleSheets = [...window.document.adoptedStyleSheets];
  }
}

export default ChotaElement;