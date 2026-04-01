import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import ConfigContainerComponent from '../containers/ConfigContainer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConfigContainerComponent],
  template: `
    <app-config-container></app-config-container>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}

