import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import ImageComponent from '../Image/Image.component';
import IconButtonComponent from '../IconButton/IconButton.component';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [ImageComponent, IconButtonComponent],
  templateUrl: './Alert.component.html',
  styleUrls: ['./Alert.style.css'],
})
export default class AlertComponent implements OnChanges {
  @Input() show = false;
  showAlert = false;

  @Input() variant?: string;

  get classes() {
    return `bg-${this.variant === 'error' ? 'error' : 'primary'} text-white alert`;
  }

  get src() {
    return `https://icongr.am/feather/${
      this.variant === 'error' ? 'alert-triangle' : 'info'
    }.svg?size=24&color=ffffff`;
  }

  @Input() message = 'Alert';

  @Output() onCloseClick = new EventEmitter<Event>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['show']) {
      this.showAlert = changes['show'].currentValue;
    }
  }

  handleClose(e: Event) {
    this.showAlert = false;
    this.onCloseClick.emit(e);
  }
}

