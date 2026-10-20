import React, { useEffect, useState } from "react";

import "./Alert.style.css";

import IconButton from "../IconButton/IconButton.component";
import Image from "../Image/Image.component";
import { iconSrc } from "../../../utils/icons";

export default function Alert({ variant, show, message, onCloseClick }) {
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

  return showAlert ? (
    <div
      className={`bg-${
        variant === "error" ? "error" : "primary"
      } text-white alert`}
    >
      <div className="message">
        <Image
          src={iconSrc(variant === "error" ? "alert-triangle" : "info", 24, "ffffff")}
          alt={variant}
        />
        <span>{message}</span>
      </div>
      <div>
        <IconButton
          variant="clear"
          alt="close"
          color="ffffff"
          iconName="x"
          size="16"
          data-testid="onAlertCloseClick"
          data-value={String(showAlert)}
          onClick={handleClose}
        />
      </div>
    </div>
  ) : null;
}
