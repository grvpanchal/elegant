import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  HostBinding,
} from "@angular/core";

@Component({
  selector: "app-input",
  templateUrl: "./Input.component.html",
  styleUrls: ["./Input.style.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InputComponent implements OnInit {
  ngOnInit() {}

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

  @Input()
  value = "";

  @Input()
  checked = false;

  @Input()
  disabled = false;

  @Input()
  placeholder: String;

  @Input()
  id: String;

  @Output() onChange: EventEmitter<string> = new EventEmitter();

  onTextInput(e) {
    this.onChange.emit(e);
  }
}
