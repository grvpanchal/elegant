import { createSlice } from "@reduxjs/toolkit";
import intialTodoState from "./todo.initial";

let nextTodoId = 0;
export const todoSlice = createSlice({
  name: "todo",
  initialState: intialTodoState,
  reducers: {
    createTodo: (state, action) => {
      state.todoItems.push({
        text: action.payload,
        completed: false,
        id: nextTodoId++,
      });
    },
    editTodo: (state, action) => {
      state.currentTodoItem = action.payload;
    },
    updateTodo: (state, action) => {
      state.todoItems = state.todoItems.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, text: action.payload.text }
          : todo
      );
      state.currentTodoItem = intialTodoState.currentTodoItem;
    },
    toggleTodo: (state, action) => {
      state.todoItems = state.todoItems.map((todo) => {
        return todo.id === action.payload.id
          ? { ...todo, completed: !todo.completed }
          : todo;
      });
    },
    deleteTodo: (state, action) => {
      state.todoItems = state.todoItems.filter(
        (todo) => todo.id !== action.payload
      );
      state.currentTodoItem = intialTodoState.currentTodoItem;
    },
  },
});

export default todoSlice.reducer;
