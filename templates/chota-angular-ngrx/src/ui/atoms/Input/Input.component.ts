import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  HostBinding,
} from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: true,
  templateUrl: './Input.component.html',
  styleUrls: ['./Input.style.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InputComponent {
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

  @Input() value = '';
  @Input() checked = false;
  @Input() disabled = false;
  @Input() placeholder = '';
  @Input() id = '';
  @Input() name = '';

  @Output() onChange = new EventEmitter<string>();

  onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.onChange.emit(
      input.type === 'checkbox' ? String(input.checked) : input.value
    );
  }
}

