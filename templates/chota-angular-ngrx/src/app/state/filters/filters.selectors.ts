import { createSelector } from '@ngrx/store';
import { AppState } from '../index';

export const getFilters = (state: AppState) => state.filters;

export const getSelectedFilter = createSelector(
  getFilters,
  (filters) => filters.find((f) => f.selected) ?? filters[0]
);
