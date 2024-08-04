import { html } from "lit";
import style from './Button.style';
import "../Loader/app-loader";
import useComputedStyles from "../../../utils/theme/hooks/useComputedStyles";

export default function Button(props) {
  useComputedStyles(this, [style]);
  if (props.isLoading) {
    return html`
      <button type="button" class=${`${props.classVal} loading-button`}>
        <app-loader .width=${'2px'} .size=${'1.2rem'} .color=${'#fff'}>Loading...</app-loader>
      </button>
    `;
  }
  return html`<button type="button"
      class="${props.classVal}"
      @click="${props.onClick}"><slot></slot></button>`;
}