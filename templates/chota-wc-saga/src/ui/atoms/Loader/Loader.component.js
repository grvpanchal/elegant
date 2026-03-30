import { html } from "lit";
import style from "./Loader.style.js";
import useComputedStyles from "../../../utils/theme/hooks/useComputedStyles";

export default function Loader({ size, width, color }) {
  useComputedStyles(this, [style]);
  return html`
    <span
      class="loader"
      style=${`
        height: ${size || "48px"};
        width: ${size || "48px"};
        border: ${`${width || "5px"} solid ${color || "#fff"}`};
        border-bottom-color: transparent;
      `}
    ></span>
  `;
}
