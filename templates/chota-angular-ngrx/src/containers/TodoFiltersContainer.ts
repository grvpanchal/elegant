import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app/state/index';
import { getFilters } from '../app/state/filters/filters.selectors';
import { setVisibilityFilter } from '../app/state/filters/filters.actions';
import TodoFiltersComponent from '../ui/organisms/TodoFilters/TodoFilters.component';

@Component({
  selector: 'app-todo-filters-container',
  standalone: true,
  imports: [TodoFiltersComponent, AsyncPipe],
  template: `
    @if (filtersData$ | async; as filtersData) {
      <app-todo-filters
        [filtersData]="filtersData"
        [events]="events"
      ></app-todo-filters>
    }
  `,
})
export default class TodoFiltersContainerComponent {
  filtersData$ = this.store.select(getFilters);

  events = {
    onTodoFilterUpdate: (id: string) => {
      this.store.dispatch(setVisibilityFilter({ filter: id }));
    },
  };

  constructor(private store: Store<AppState>) {}
}
