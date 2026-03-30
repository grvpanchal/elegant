import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './Button.component.html',
  styleUrls: ['./Button.style.css'],
})
export default class ButtonComponent {

  @Input()
  isLoading?: boolean = false;

  @Input()
  classes?: string;

  @HostBinding("attr.type")
  externalType = "";

  @Input()
  set type(value: string) {
    this._Type = value;
    this.externalType = null;
  }

  get type() {
    return this._Type;
  }

  private _Type = "";

  get computedClasses() {
    return this.isLoading ? `${this.classes} loading-button` : this.classes;
  }

  /**
   * Optional click handler
   */
  @Output()
  onClick = new EventEmitter<Event>();
}
