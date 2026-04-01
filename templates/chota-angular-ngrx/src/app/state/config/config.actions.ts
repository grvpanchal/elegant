import { createAction, props } from '@ngrx/store';
import { ConfigState } from './config.initial';

export const updateConfig = createAction(
  '[Config] UpdateConfig',
  props<{ payload: Partial<ConfigState> }>()
);
