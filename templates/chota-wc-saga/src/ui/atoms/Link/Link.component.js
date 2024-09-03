import { html } from "lit";
import useComputedStyles from "../../../utils/theme/hooks/useComputedStyles";
import style from './Link.style';
import emit from "../../../utils/events/emit";

 export default function Link({ isActive, onClick }) {
  useComputedStyles(this, [style]);
  return html`
    <a
      href="#"
      class=${`button ${isActive ? "primary" : "outline"}`}
      @click=${() => emit(this, "onClick", onClick)}
      .disabled=${isActive}
      role="button"
    >
      <slot></slot>
    </a>
  `;
}
