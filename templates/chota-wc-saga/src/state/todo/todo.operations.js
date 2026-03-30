import { put, takeLatest, call, select, delay } from "redux-saga/effects";
import { CREATE_TODO, DELETE_TODO, READ_TODO, TOGGLE_TODO, UPDATE_TODO } from "./todo.type";
import { createTodoError, createTodoSuccess, deleteTodoError, deleteTodoSuccess, readTodoError, readTodoSuccess, toggleTodoError, toggleTodoSuccess, updateTodoError, updateTodoSuccess } from "./todo.actions";
import { mapTodoData, toggleCheckedState } from "./todo.helper";
import fetchApi from "../../utils/api";

export function getTodoApi() {
  return fetchApi('/todos');
}

export function addTodoApi(payload) {
  return fetchApi('/todos', { method: 'POST', body: payload });
}

export function updateTodoApi(payload) {
  return fetchApi('/todos', { method: 'PUT', body: payload });
}

export function deleteTodoApi(payload) {
  return fetchApi('/todos', { method: 'DELETE', body: payload });
}

export function* getTodos() {
  try {
    const todoResponse = yield call(getTodoApi);
    const todoData = yield todoResponse.json();
    const mappedTodoData = mapTodoData(todoData);
    yield put(readTodoSuccess(mappedTodoData));
  } catch (error) {
    yield put(readTodoError(error.toString()));
  }
}

export function* addTodos(action) {
  try {
    const payload = { ...action.payload, id: window.crypto.randomUUID() };
    yield call(addTodoApi, payload);
    yield put(createTodoSuccess(payload));
  } catch (error) {
    yield put(createTodoError(error.toString()));
  }
}

export function* updateTodos(action) {
  try {
    yield call(updateTodoApi, action.payload);
    yield put(updateTodoSuccess(action.payload));
  } catch (error) {
    yield put(updateTodoError(error.toString()));
  }
}

export function* updateToggleTodos(action) {
  try {
    yield call(updateTodoApi, toggleCheckedState(action.payload));
    yield put(toggleTodoSuccess());
  } catch (error) {
    yield delay(500);
    const mappedTodoData = yield select((state) => state.todo.previousStateTodoItems);
    yield put(toggleTodoError(mappedTodoData, error.toString()));
  }
}

export function* deleteTodos(action) {
  try {
    yield call(deleteTodoApi, action.payload);
    yield put(deleteTodoSuccess());
  } catch (error) {
    yield delay(500);
    const mappedTodoData = yield select((state) => state.todo.previousStateTodoItems);
    yield put(deleteTodoError(mappedTodoData, error.toString()));
  }
}

export function* watchTodos() {
  yield takeLatest(CREATE_TODO, addTodos);
  yield takeLatest(READ_TODO, getTodos);
  yield takeLatest(UPDATE_TODO, updateTodos);
  yield takeLatest(TOGGLE_TODO, updateToggleTodos);
  yield takeLatest(DELETE_TODO, deleteTodos);
}
