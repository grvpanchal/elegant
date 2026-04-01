import { createReducer, on } from '@ngrx/store';
import { updateConfig } from './config.actions';
import initialConfigState from './config.initial';

export const configReducer = createReducer(
  initialConfigState,
  on(updateConfig, (state, { payload }) => ({
    ...state,
    ...payload,
  }))
);
