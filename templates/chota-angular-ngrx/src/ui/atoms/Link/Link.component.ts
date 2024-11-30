import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-link',
  templateUrl: './Link.component.html',
  styleUrls: ['./Link.style.css'],
})
export default class LinkComponent {
  @Input()
  isActive = false;

  get classes() {
    return `button ${this.isActive ? "primary" : "outline"}`
  }

  @Output()
  onClick = new EventEmitter<Event>();
}
