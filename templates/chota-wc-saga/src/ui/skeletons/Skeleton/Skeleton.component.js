import { html } from "lit";
import styles from "./Skeleton.style";
import useComputedStyles from "../../../utils/theme/hooks/useComputedStyles";

export default function Skeleton({ variant, height, width, styleCSS }) {
  useComputedStyles(this, [styles]);
  return html`
    <div
      class=${`skeleton skeleton-${variant ? variant : "text"}`}
      style=${`
        ${styleCSS || ''}
        height: ${height};
        width: ${width};
      `}
    ></div>
  `;
}
