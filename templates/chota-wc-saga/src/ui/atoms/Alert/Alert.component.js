import { html, useEffect, useState } from "haunted";

import style from "./Alert.style";
import useComputedStyles from "../../../utils/theme/hooks/useComputedStyles";


import '../IconButton/app-icon-button';
import '../Image/app-image';

export default function Alert({ variant, show, message, onCloseClick }) {
  useComputedStyles(this, [style]);

  const [showAlert, setShowAlert] = useState(show);

  const handleClose = (e) => {
    setShowAlert(false);
    if (onCloseClick) {
      onCloseClick(e);
    }
  };

  useEffect(() => {
    setShowAlert(show);
  }, [show]);

  return showAlert ? html`
    <div
      class=${`bg-${
        variant === "error" ? "error" : "primary"
      } text-white alert`}
    >
      <div class="message">
        <app-image
          .src=${`https://icongr.am/feather/${
            variant === "error" ? "alert-triangle" : "info"
          }.svg?size=24&color=ffffff`}
          .alt={variant}
        ></app-image>
        <span>${message}</span>
      </div>
      <div>
        <app-icon-button
          .variant=${'clear'}
          alt="close"
          .color=${'ffffff'}
          .iconName=${'x'}
          .size=${'16'}
          @onClick=${handleClose}
        ></app-icon-button>
      </div>
    </div>
  ` : null;
}
