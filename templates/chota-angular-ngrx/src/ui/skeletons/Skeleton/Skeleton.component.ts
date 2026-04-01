import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  templateUrl: './Skeleton.component.html',
  styleUrls: ['./Skeleton.style.css'],
})
export default class SkeletonComponent {
  @Input()
  width = "100%";

  @Input()
  height = "1rem";

  @Input()
  style = {};

  @Input()
  variant = "text";

  get classes() {
    return `skeleton skeleton-${this.variant}`;
  }

  get styles() {
    return { ...this.style, height: this.height, width: this.width };
  }
}
