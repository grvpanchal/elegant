import { todoSlice } from "./todo.reducer";

export const {
  createTodo,
  editTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
} = todoSlice.actions;
