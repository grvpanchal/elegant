// import { useAtomicContext } from "../../../utils/providers/AtomicProvider";
import { html } from "lit";
import style from './IconButton.style';
import "../Button/app-button";
import "../Image/app-image";
import useComputedStyles from "../../../utils/theme/hooks/useComputedStyles";
import emit from "../../../utils/events/emit";

export default function IconButton({
  iconName,
  alt,
  variant,
  size,
  color,
  onClick
}) {
  useComputedStyles(this, [style])
  const theme = 'light';
  const themeColor = theme === "dark" ? "ffffff" : "";
  return html`
    <app-button
      .classes=${`button icon-only ${variant}`}
      @onClick=${() => emit(this, "onClick", onClick)}
    >
      <app-image
        .alt=${alt}
        .src=${`https://icongr.am/feather/${iconName}.svg?size=${size}&color=${
          color ? color : themeColor
        }`}
      ></app-image>
    </app-button>
  `;
}
