

import { html } from "lit";
import useComputedStyles from "../../../utils/theme/hooks/useComputedStyles";

import style from "./Layout.style.js";

export default function Layout() {
  useComputedStyles(this, [style]);
  return html`
    <div class="container layout">
      <slot></slot>
    </div>
  `;
}
