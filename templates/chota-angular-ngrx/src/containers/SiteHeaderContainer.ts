import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { AppState } from '../app/state/index';
import { getConfigState } from '../app/state/config/config.selectors';
import { updateConfig } from '../app/state/config/config.actions';
import SiteHeaderComponent from '../ui/organisms/SiteHeader/SiteHeader.component';

@Component({
  selector: 'app-site-header-container',
  standalone: true,
  imports: [SiteHeaderComponent, AsyncPipe],
  template: `
    @if (headerData$ | async; as headerData) {
      <app-site-header
        [headerData]="headerData"
        [events]="events"
      ></app-site-header>
    }
  `,
})
export default class SiteHeaderContainerComponent {
  headerData$ = this.store.select(getConfigState).pipe(
    map((config) => ({ brandName: config.name, theme: config.theme }))
  );

  events = {
    onThemeChangeClick: () => {
      this.headerData$.pipe(take(1)).subscribe((data) => {
        this.store.dispatch(
          updateConfig({ payload: { theme: data.theme === 'light' ? 'dark' : 'light' } })
        );
      });
    },
  };

  constructor(private store: Store<AppState>) {}
}
