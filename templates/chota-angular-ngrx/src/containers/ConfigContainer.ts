import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../app/state/index';
import { getTheme } from '../app/state/config/config.selectors';

@Component({
  selector: 'app-config-container',
  standalone: true,
  template: '',
})
export default class ConfigContainerComponent implements OnInit, OnDestroy {
  private sub = new Subscription();

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.sub = this.store.select(getTheme).subscribe((theme) => {
      if (theme === 'dark') {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
