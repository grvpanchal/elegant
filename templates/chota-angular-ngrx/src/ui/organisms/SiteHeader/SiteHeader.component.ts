import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-site-header',
  standalone: true,
  templateUrl: './SiteHeader.component.html',
  styleUrls: ['./SiteHeader.style.css'],
})
/* istanbul ignore next */
export default class SiteHeaderComponent {
  /* istanbul ignore next */
  @Input() headerData: { brandName: string; theme: string } = {
    brandName: 'Todo App',
    theme: 'light',
  };

  /* istanbul ignore next */
  @Input() events: { onThemeChangeClick: () => void } = {
    onThemeChangeClick: () => {},
  };
}

