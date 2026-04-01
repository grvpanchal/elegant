import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import LoaderComponent from '../Loader/Loader.component';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './Button.component.html',
  styleUrls: ['./Button.style.css'],
})
export default class ButtonComponent {
  @Input() isLoading = false;
  @Input() classes?: string;

  @HostBinding('attr.type')
  externalType: string | null = '';

  @Input()
  set type(value: string) {
    this._type = value;
    this.externalType = null;
  }
  get type() {
    return this._type;
  }
  private _type = '';

  get computedClasses() {
    return this.isLoading ? `${this.classes} loading-button` : this.classes;
  }

  @Output() onClick = new EventEmitter<Event>();
}
