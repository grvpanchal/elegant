import { createTodoSlice } from "./todo/todo.slice";
import { createFiltersSlice } from "./filters/filters.slice";
import { createConfigSlice } from "./config/config.slice";

/*
Combines every domain slice into a single store creator — the Zustand analogue of
`combineReducers`. Each slice contributes its own namespaced state (`todo`,
`filters`, `config`) plus its actions, so the store shape stays identical to the
Redux-family templates and the selectors are reusable as-is.
*/
export const createRootSlice = (set, get, api) => ({
  ...createTodoSlice(set, get, api),
  ...createFiltersSlice(set, get, api),
  ...createConfigSlice(set, get, api),
});

export default createRootSlice;
