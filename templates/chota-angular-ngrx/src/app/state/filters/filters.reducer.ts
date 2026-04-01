import { createReducer, on } from '@ngrx/store';
import { setVisibilityFilter } from './filters.actions';
import initialFiltersState from './filters.initial';

export const filtersReducer = createReducer(
  initialFiltersState,
  on(setVisibilityFilter, (state, { filter }) =>
    state.map((f) => ({ ...f, selected: f.id === filter }))
  )
);
