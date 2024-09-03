import { html } from "lit";
import style from './Button.style';
import "../Loader/app-loader";
import useComputedStyles from "../../../utils/theme/hooks/useComputedStyles";
import emit from "../../../utils/events/emit";

export default function Button(props) {
  useComputedStyles(this, [style]);
  if (props.isLoading) {
    return html`
      <button type="button" class=${`${props.classes} loading-button`}>
        <app-loader .width=${'2px'} .size=${'1.2rem'} .color=${'#fff'}>Loading...</app-loader>
      </button>
    `;
  }
  return html`<button type="button"
      class="${props.classes}"
      @click="${() => emit(this, "onClick", props)}"><slot></slot></button>`;
}