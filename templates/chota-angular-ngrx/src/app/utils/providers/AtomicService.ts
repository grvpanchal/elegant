import { Injectable, Optional } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { AppState } from '../../state/index';
import { getTheme } from '../../state/config/config.selectors';

@Injectable({ providedIn: 'root' })
export class AtomicService {
  theme$: Observable<string>;

  constructor(@Optional() private store: Store<AppState>) {
    this.theme$ = this.store
      ? this.store.select(getTheme)
      : of('light');
  }
}
