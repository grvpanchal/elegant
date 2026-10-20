import { Component, Input } from '@angular/core';
import { iconSrc } from '../../../app/utils/icons';

@Component({
  selector: 'app-image',
  standalone: true,
  templateUrl: './Image.component.html',
  styleUrls: ['./Image.style.css'],
})
export default class ImageComponent {
  @Input() alt = 'Some Image';
  @Input() src = iconSrc('info', 24, '000000');
}
