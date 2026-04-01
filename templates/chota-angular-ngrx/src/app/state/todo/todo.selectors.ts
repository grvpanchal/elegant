import { createSelector } from '@ngrx/store';
import { AppState } from '../index';
import { getSelectedFilter } from '../filters/filters.selectors';

export const getTodoState = (state: AppState) => state.todo;

export const getVisibleTodos = createSelector(
  getTodoState,
  getSelectedFilter,
  (todoState, selectedFilter) => {
    const { todoItems } = todoState;
    switch (selectedFilter?.id) {
      case 'SHOW_COMPLETED':
        return { ...todoState, todoItems: todoItems.filter((t) => t.completed) };
      case 'SHOW_ACTIVE':
        return { ...todoState, todoItems: todoItems.filter((t) => !t.completed) };
      default:
        return todoState;
    }
  }
);
