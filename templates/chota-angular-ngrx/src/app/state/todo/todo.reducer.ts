import { createReducer, on } from '@ngrx/store';
import initialTodoState from './todo.initial';
import {
  createTodo, editTodo, updateTodo, toggleTodo, deleteTodo, loadTodos,
  loadTodosRequest, loadTodosSuccess, loadTodosFail,
  addTodoRequest, addTodoSuccess, addTodoFail,
  updateTodoRequest, updateTodoSuccess, updateTodoFail,
  deleteTodoRequest, deleteTodoFail,
} from './todo.actions';

export const todoReducer = createReducer(
  initialTodoState,

  on(loadTodosRequest, (state) => ({
    ...state,
    isContentLoading: true,
    error: '',
  })),
  on(loadTodosSuccess, (state) => ({
    ...state,
    isContentLoading: false,
  })),
  on(loadTodosFail, (state, { error }) => ({
    ...state,
    isContentLoading: false,
    error,
  })),
  on(loadTodos, (state, { todos }) => ({
    ...state,
    todoItems: todos,
  })),

  on(addTodoRequest, (state) => ({ ...state, isActionLoading: true, error: '' })),
  on(addTodoSuccess, (state) => ({ ...state, isActionLoading: false })),
  on(addTodoFail, (state, { error }) => ({ ...state, isActionLoading: false, error })),

  on(updateTodoRequest, (state, { id, text }) => ({
    ...state,
    isActionLoading: true,
    error: '',
    todoItems: state.todoItems.map((todo) =>
      todo.id === id ? { ...todo, text } : todo
    ),
    currentTodoItem: initialTodoState.currentTodoItem,
  })),
  on(updateTodoSuccess, (state) => ({ ...state, isActionLoading: false })),
  on(updateTodoFail, (state, { error }) => ({ ...state, isActionLoading: false, error })),

  on(deleteTodoRequest, (state, { id }) => ({
    ...state,
    isActionLoading: true,
    error: '',
    todoItems: state.todoItems.filter((todo) => todo.id !== id),
    currentTodoItem: initialTodoState.currentTodoItem,
  })),
  on(deleteTodoFail, (state, { error }) => ({ ...state, isActionLoading: false, error })),

  on(createTodo, (state, { id, text }) => ({
    ...state,
    isActionLoading: false,
    todoItems: [...state.todoItems, { id, text, completed: false }],
  })),

  on(editTodo, (state, { id, text }) => ({
    ...state,
    currentTodoItem: { id, text },
  })),

  on(updateTodo, (state, { id, text }) => ({
    ...state,
    isActionLoading: false,
    todoItems: state.todoItems.map((todo) =>
      todo.id === id ? { ...todo, text } : todo
    ),
    currentTodoItem: initialTodoState.currentTodoItem,
  })),

  on(toggleTodo, (state, { id }) => ({
    ...state,
    todoItems: state.todoItems.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ),
  })),

  on(deleteTodo, (state, { id }) => ({
    ...state,
    isActionLoading: false,
    todoItems: state.todoItems.filter((todo) => todo.id !== id),
    currentTodoItem: initialTodoState.currentTodoItem,
  }))
);
