import { html } from "lit";
import useComputedStyles from "../../../utils/theme/hooks/useComputedStyles";
import style from './Link.style';

 export default function Link({ active, onClick }) {
  useComputedStyles(this, [style]);
  return html`
    <a
      href="#"
      class=${`button ${active ? "primary" : "outline"}`}
      @click=${onClick}
      .disabled=${active}
      role="button"
    >
      <slot></slot>
    </a>
  `;
}
