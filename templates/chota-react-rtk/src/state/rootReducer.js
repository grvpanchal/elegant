import { combineReducers } from "@reduxjs/toolkit";

import todo from "./todo/todo.reducer";
import filters from "./filters/filters.reducer";
import config from "./config/config.reducer";

export default combineReducers({
  todo,
  filters,
  config,
});
