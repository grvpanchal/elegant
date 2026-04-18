/* istanbul ignore file */
import { combineReducers } from "@reduxjs/toolkit";

import todo from "./todo/todo.reducer.js";
import filters from "./filters/filters.reducer.js";
import config from "./config/config.reducer.js";

export default combineReducers({
  todo,
  filters,
  config,
});
