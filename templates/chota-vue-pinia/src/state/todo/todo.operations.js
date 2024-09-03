import { createTodo, createTodoError, createTodoSuccess, deleteTodo, deleteTodoError, deleteTodoSuccess, readTodo, readTodoError, readTodoSuccess, toggleTodo, toggleTodoError, toggleTodoSuccess, updateTodo, updateTodoError, updateTodoSuccess } from "./todo.actions";
import { mapTodoData, toggleCheckedState } from "./todo.helper";
import fetchApi from "../../utils/api";

export function getTodoApi() {
  return fetchApi('/todos');
}

export function addTodoApi(payload) {
  return fetchApi('/todos', { method: 'POST', body: payload });
}

export function updateTodoApi(payload) {
  console.log('payload', payload);
  return fetchApi('/todos', { method: 'PUT', body: payload });
}

export function deleteTodoApi(payload) {
  return fetchApi('/todos', { method: 'DELETE', body: payload });
}

async function delay(ms) { 
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getTodos() {
  try {
    readTodo.bind(this)();
    const todoResponse = await getTodoApi();
    const todoData = await todoResponse.json();
    const mappedTodoData = mapTodoData(todoData);
    readTodoSuccess.bind(this)(mappedTodoData);
  } catch (error) {
    readTodoError.bind(this)(error.toString());
  }
}

export async function addTodos(text) {
  try {
    createTodo.bind(this)(text);
    const payload = { ...this.currentTodoItem, id: window.crypto.randomUUID() };
    await addTodoApi(payload);
    createTodoSuccess.bind(this)(payload);
  } catch (error) {
    createTodoError.bind(this)(error.toString());
  }
}

export async function updateTodos(payload) {
  try {
    updateTodo.bind(this)(payload)
    await updateTodoApi(payload);
    updateTodoSuccess.bind(this)(payload);
  } catch (error) {
    updateTodoError.bind(this)(error.toString());
  }
}

export async function updateToggleTodos(payload) {
  try {
    toggleTodo.bind(this)(payload);
    console.log(payload, toggleCheckedState(payload));
    await updateTodoApi(toggleCheckedState(payload));
    toggleTodoSuccess.bind(this)(payload);
  } catch (error) {
    await delay(500);
    const mappedTodoData = this.previousStateTodoItems;
    toggleTodoError.bind(this)(mappedTodoData, error.toString());
  }
}

export async function deleteTodos(payload) {
  try {
    deleteTodo.bind(this)(payload);
    await deleteTodoApi({ id: payload });
    deleteTodoSuccess.bind(this)();
  } catch (error) {
    await delay(500);
    const mappedTodoData = this.previousStateTodoItems;
    deleteTodoError.bind(this)(mappedTodoData, error.toString());
  }
}
