import { html } from "lit";
import style from "./Skeleton.style";

export default function Skeleton({ variant, height, width, style }) {
  useComputedStyles(this, [style]);
  return html`
    <div
      class=${`skeleton skeleton-${variant ? variant : "text"}`}
      style=${`
        ${style}
        height: ${height};
        width: ${width};
      `}
    ></div>
  `;
}
