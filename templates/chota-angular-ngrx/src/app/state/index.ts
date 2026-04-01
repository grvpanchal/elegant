import { ActionReducerMap } from '@ngrx/store';
import { todoReducer } from './todo/todo.reducer';
import { filtersReducer } from './filters/filters.reducer';
import { configReducer } from './config/config.reducer';
import { TodoState } from './todo/todo.initial';
import { FilterItem } from './filters/filters.initial';
import { ConfigState } from './config/config.initial';

export interface AppState {
  todo: TodoState;
  filters: FilterItem[];
  config: ConfigState;
}

export const reducers: ActionReducerMap<AppState> = {
  todo: todoReducer,
  filters: filtersReducer,
  config: configReducer,
};
