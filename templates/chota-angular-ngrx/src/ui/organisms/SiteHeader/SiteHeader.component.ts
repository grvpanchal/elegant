import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-site-header',
  standalone: true,
  templateUrl: './SiteHeader.component.html',
  styleUrls: ['./SiteHeader.style.css'],
})
export default class SiteHeaderComponent {
  @Input() headerData: { brandName: string; theme: string } = {
    brandName: 'Todo App',
    theme: 'light',
  };

  @Input() events: { onThemeChangeClick: () => void } = {
    onThemeChangeClick: () => {},
  };
}

