import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-site-header",
  templateUrl: "./SiteHeader.component.html",
  styleUrls: ["./SiteHeader.style.css"],
})
export default class SiteHeaderComponent {
  @Input()
  headerData = {
    theme: "light",
    brandName: "Todo App",
  };

  @Input()
  events = {
    onThemeChangeClick: new EventEmitter(),
  };
}
