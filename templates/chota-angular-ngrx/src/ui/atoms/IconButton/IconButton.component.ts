import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import ButtonComponent from '../Button/Button.component';
import ImageComponent from '../Image/Image.component';
import { AtomicService } from '../../../app/utils/providers/AtomicService';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [ButtonComponent, ImageComponent],
  templateUrl: './IconButton.component.html',
  styleUrls: ['./IconButton.style.css'],
})
export default class IconButtonComponent implements OnInit, OnDestroy {
  themeColor = '000000';
  private sub?: Subscription;

  @Input() variant?: string;
  @Input() alt = '';
  @Input() color = '';
  @Input() size = '16';
  @Input() iconName = 'x';

  get classes() {
    return `button icon-only ${this.variant}`;
  }

  get src() {
    return `https://icongr.am/feather/${this.iconName}.svg?size=${this.size}&color=${
      this.color || this.themeColor
    }`;
  }

  @Output() onClick = new EventEmitter<Event>();

  constructor(private atomicService: AtomicService) {}

  ngOnInit() {
    this.sub = this.atomicService.theme$.subscribe((theme) => {
      this.themeColor = theme === 'dark' ? 'ffffff' : '000000';
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
