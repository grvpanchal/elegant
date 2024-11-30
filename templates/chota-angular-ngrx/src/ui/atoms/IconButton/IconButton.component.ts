import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  templateUrl: './IconButton.component.html',
  styleUrls: ['./IconButton.style.css'],
})
export default class IconButtonComponent {
  /**
   * Is this the principal call to action on the page?
   */

  themeColor = '000000';

  @Input()
  primary = false;

  @Input()
  variant?: string;

  @Input()
  alt?: string;
  
  @Input()
  color = '000000';

  @Input()
  size = '16';

  /**
   * IconButton contents
   *
   * @required
   */
  @Input()
  iconName = 'IconButton';

  get classes() {
    return `button icon-only ${this.variant}`;
  }

  get src() {
    return `https://icongr.am/feather/${this.iconName}.svg?size=${this.size}&color=${
    this.color ? this.color : this.themeColor
  }`
  }

  /**
   * Optional click handler
   */
  @Output()
  onClick = new EventEmitter<Event>();
}
