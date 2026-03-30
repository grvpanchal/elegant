import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './Loader.component.html',
  styleUrls: ['./Loader.style.css'],
})
export default class LoaderComponent {
  @Input()
  size = '48px';
  @Input()
  width = '5px';
  
  @Input()
  color = '#fff';

  get styles() {
    return `
    height: ${this.size};
    width:  ${this.size};
    border: ${this.width} solid ${this.color};
    border-bottom-color: transparent;
    `;
  }
}
