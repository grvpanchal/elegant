import { createSelector } from '@ngrx/store';
import { AppState } from '../index';

export const getConfigState = (state: AppState) => state.config;

export const getTheme = createSelector(getConfigState, (config) => config.theme);
export const getBrandName = createSelector(getConfigState, (config) => config.name);
