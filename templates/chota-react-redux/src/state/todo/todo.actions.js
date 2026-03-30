import { CREATE_TODO, DELETE_TODO, EDIT_TODO, TOGGLE_TODO, UPDATE_TODO } from "./todo.type";

let nextTodoId = 0;
export const createTodo = (text) => ({
  type: CREATE_TODO,
  payload: {
    id: nextTodoId++,
    text,
  },
});

export const editTodo = (payload) => ({
  type: EDIT_TODO,
  payload,
});

export const updateTodo = (payload) => ({
  type: UPDATE_TODO,
  payload,
});

export const deleteTodo = (id) => ({
  type: DELETE_TODO,
  payload: { id },
});

export const toggleTodo = (payload) => ({
  type: TOGGLE_TODO,
  payload,
});
