import { toggleCheckedState } from "./todo.helper";
import intialTodoState from "./todo.initial";

export function createTodo(text) {
  this.isLoading = true;
  this.isActionLoading = true;
  this.currentTodoItem = {
    text,
    completed: false,
  };
}

export function createTodoSuccess(payload) {
  this.isLoading = false;
  this.isActionLoading = false;
  this.todoItems.push({
    id: payload.id,
    text: payload.text,
    completed: false,
  });
  this.currentTodoItem = intialTodoState.currentTodoItem;
};

export function createTodoError(error) {
  this.isLoading = false;
  this.isActionLoading = false;
  this.error = error,
  this.currentTodoItem = intialTodoState.currentTodoItem;
}

export function readTodo() {
  this.isLoading = true;
  this.isContentLoading = true;
  this.isActionLoading = true;
};

export function readTodoSuccess(payload) {
  this.isLoading = false;
  this.isContentLoading = false;
  this.isActionLoading = false;
  this.todoItems = payload;
}

export function readTodoError(error) {
  this.isLoading = false;
  this.isContentLoading = false;
  this.isActionLoading = false;
  this.error = error;
};

export function editTodo(payload) {
  this.currentTodoItem = payload;
};

export function updateTodo(payload) {
  this.isActionLoading = true;
  this.todoItems = this.todoItems.map((todo) =>
    todo.id === payload.id
      ? { ...todo, text: payload.text }
      : todo
  );
  this.currentTodoItem = payload;
};
export function updateTodoSuccess(payload) {
  this.isActionLoading = false;
  this.currentTodoItem = intialTodoState.currentTodoItem;
};

export function updateTodoError(error) {
  this.todoItems = [...this.previousStateTodoItems];
  this.error = error;
  this.isActionLoading = false;
  this.currentTodoItem = intialTodoState.currentTodoItem;
};

export function toggleTodo(payload) {
  this.todoItems = this.todoItems.map((todo) =>
    todo.id === payload.id
      ? toggleCheckedState(todo)
      : todo
  );
  this.previousStateTodoItems = [...this.todoItems];
}

export function toggleTodoSuccess() {
  this.previousStateTodoItems = undefined;
  this.isLoading = false;
}

export function toggleTodoError(payload, error) {
  this.todoItems = [...this.previousStateTodoItems];
  this.previousStateTodoItems = undefined;
  this.isLoading = false;
  this.error = error;
}

export function deleteTodo(id) {
  this.previousStateTodoItems = [...this.todoItems];
  this.todoItems = this.todoItems.filter(
    (todo) => todo.id !== id
  );
  this.currentTodoItem = intialTodoState.currentTodoItem;
}

export function deleteTodoSuccess() {
  this.previousStateTodoItems = undefined;
  this.isLoading = false;
}

export function deleteTodoError(payload, error) {
  this.todoItems = [...this.previousStateTodoItems];
  this.previousStateTodoItems = undefined;
  this.isLoading = false;
  this.error = error;
}
