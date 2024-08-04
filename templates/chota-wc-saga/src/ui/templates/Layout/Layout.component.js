

import { html } from "lit";
import "./Layout.style.js";

export default function Layout() {
  return html`
    <div class="container layout">
      <slot></slot>
    </div>
  `;
}
