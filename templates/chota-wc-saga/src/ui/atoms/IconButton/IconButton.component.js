// import { useAtomicContext } from "../../../utils/providers/AtomicProvider";
import { html } from "lit";
import style from './IconButton.style';
import "../Button/app-button";
import "../Image/app-image";
import useComputedStyles from "../../../utils/theme/hooks/useComputedStyles";

export default function IconButton({
  iconName,
  alt,
  variant,
  size,
  color,
  onClick
}) {
  // const { theme } = useAtomicContext();
  useComputedStyles(this, [style])
  const theme = 'light';
  const themeColor = theme === "dark" ? "ffffff" : "";
  console.log('variant', variant);
  return html`
    <app-button
      .classVal=${`button icon-only ${variant}`}
      @onClick=${onClick}
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
