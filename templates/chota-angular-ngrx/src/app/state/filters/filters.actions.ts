import { createAction, props } from '@ngrx/store';

export const setVisibilityFilter = createAction(
  '[Filters] SetVisibilityFilter',
  props<{ filter: string }>()
);
