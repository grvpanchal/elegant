import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { reducers } from './state';
import { TodoEffects } from './state/todo/todo.effects';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore(reducers),
    provideEffects([TodoEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
    }),
    { provide: 'API_URL', useValue: environment.api },
  ],
};
