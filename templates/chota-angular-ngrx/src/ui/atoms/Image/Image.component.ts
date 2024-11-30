import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './Image.component.html',
  styleUrls: ['./Image.style.css'],
})
export default class ImageComponent {
  
  @Input()
  alt = "Some Image";

  /**
   * Image contents
   *
   */
  @Input()
  src = `https://icongr.am/feather/info.svg?size=24&color=000000`;
}
