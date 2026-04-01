import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image',
  standalone: true,
  templateUrl: './Image.component.html',
  styleUrls: ['./Image.style.css'],
})
export default class ImageComponent {
  @Input() alt = 'Some Image';
  @Input() src = 'https://icongr.am/feather/info.svg?size=24&color=000000';
}
