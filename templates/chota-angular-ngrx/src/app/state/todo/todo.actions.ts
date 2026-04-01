import { createAction, props } from '@ngrx/store';
import { Todo } from './todo.model';

export const createTodo = createAction(
  '[Todo] CreateTodo',
  props<{ id: number; text: string }>()
);

export const editTodo = createAction(
  '[Todo] EditTodo',
  props<{ id: number; text: string }>()
);

export const updateTodo = createAction(
  '[Todo] UpdateTodo',
  props<{ id: number; text: string }>()
);

export const toggleTodo = createAction(
  '[Todo] ToggleTodo',
  props<{ id: number }>()
);

export const deleteTodo = createAction(
  '[Todo] DeleteTodo',
  props<{ id: number }>()
);

export const loadTodos = createAction(
  '[Todo] LoadTodos',
  props<{ todos: Todo[] }>()
);

export const loadTodosRequest = createAction('[Todo] LoadTodosRequest');
export const loadTodosSuccess = createAction('[Todo] LoadTodosSuccess');
export const loadTodosFail = createAction(
  '[Todo] LoadTodosFail',
  props<{ error: string }>()
);

export const addTodoRequest = createAction(
  '[Todo] AddTodoRequest',
  props<{ text: string }>()
);
export const addTodoSuccess = createAction('[Todo] AddTodoSuccess');
export const addTodoFail = createAction(
  '[Todo] AddTodoFail',
  props<{ error: string }>()
);

export const updateTodoRequest = createAction(
  '[Todo] UpdateTodoRequest',
  props<{ id: number; text: string }>()
);
export const updateTodoSuccess = createAction('[Todo] UpdateTodoSuccess');
export const updateTodoFail = createAction(
  '[Todo] UpdateTodoFail',
  props<{ error: string }>()
);

export const deleteTodoRequest = createAction(
  '[Todo] DeleteTodoRequest',
  props<{ id: number }>()
);
export const deleteTodoFail = createAction(
  '[Todo] DeleteTodoFail',
  props<{ error: string }>()
);
