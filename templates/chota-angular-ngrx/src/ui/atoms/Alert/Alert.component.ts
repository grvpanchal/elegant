import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-alert",
  templateUrl: "./Alert.component.html",
  // imports: [ImageComponent, IconButtonComponent],
  styleUrls: ["./Alert.style.css"],
})
export default class AlertComponent {
  /**
   * Is this the principal call to action on the page?
   */
  @Input()
  show = false;

  showAlert = this.show;

  @Input()
  variant?: string;

  get classes() {
    return `bg-${
      this.variant === "error" ? "error" : "primary"
    } text-white alert`;
  }

  get src() {
    return `https://icongr.am/feather/${ this.variant === "error" ? "alert-triangle" : "info" }.svg?size=24&color=ffffff`
  }

  /**
   * Alert contents
   *
   * @required
   */
  @Input()
  message = "Alert";

  /**
   * Optional click handler
   */
  @Output()
  onCloseClick = new EventEmitter<Event>();

  handleClose = (e) => {
    this.showAlert = false;
    this.onCloseClick.emit(e);
  };
}
