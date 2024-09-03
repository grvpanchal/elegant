import {
  CREATE_TODO,
  CREATE_TODO_ERROR,
  CREATE_TODO_SUCCESS,
  DELETE_TODO,
  DELETE_TODO_ERROR,
  DELETE_TODO_SUCCESS,
  EDIT_TODO,
  READ_TODO,
  READ_TODO_ERROR,
  READ_TODO_SUCCESS,
  TOGGLE_TODO,
  TOGGLE_TODO_ERROR,
  TOGGLE_TODO_SUCCESS,
  UPDATE_TODO,
  UPDATE_TODO_ERROR,
  UPDATE_TODO_SUCCESS,
} from "./todo.type";

export const createTodo = (text) => ({
  type: CREATE_TODO,
  payload: {
    text,
    completed: false,
  },
});

export const createTodoSuccess = (payload) => ({
  type: CREATE_TODO_SUCCESS,
  payload,
});

export const createTodoError = (error) => ({
  type: CREATE_TODO_ERROR,
  error,
});

export const readTodo = (payload) => ({
  type: READ_TODO,
  payload,
});
export const readTodoSuccess = (payload) => ({
  type: READ_TODO_SUCCESS,
  payload,
});
export const readTodoError = (error) => ({
  type: READ_TODO_ERROR,
  error,
});

export const editTodo = (payload) => ({
  type: EDIT_TODO,
  payload,
});

export const updateTodo = (payload) => ({
  type: UPDATE_TODO,
  payload,
});
export const updateTodoSuccess = (payload) => ({
  type: UPDATE_TODO_SUCCESS,
  payload,
});

export const updateTodoError = (error) => ({
  type: UPDATE_TODO_ERROR,
  error,
});

export const toggleTodo = (payload) => ({
  type: TOGGLE_TODO,
  payload,
});
export const toggleTodoSuccess = () => ({
  type: TOGGLE_TODO_SUCCESS,
});
export const toggleTodoError = (payload, error) => ({
  type: TOGGLE_TODO_ERROR,
  payload,
  error,
});

export const deleteTodo = (id) => ({
  type: DELETE_TODO,
  payload: { id },
});

export const deleteTodoSuccess = () => ({
  type: DELETE_TODO_SUCCESS,
});

export const deleteTodoError = (payload, error) => ({
  type: DELETE_TODO_ERROR,
  payload,
  error,
});
