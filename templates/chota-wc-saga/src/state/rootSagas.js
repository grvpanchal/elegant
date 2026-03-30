import { all } from "redux-saga/effects";
import { watchTodos } from "./todo/todo.operations";

export default function* rootSaga() {
  yield all([
    watchTodos(),
  ]);
}
