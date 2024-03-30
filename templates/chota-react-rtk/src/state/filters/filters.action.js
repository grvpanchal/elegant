import { SET_VISIBILITY_FILTER } from "./filters.type";

export const setVisibilityFilter = (filter) => ({
  type: SET_VISIBILITY_FILTER,
  filter,
});
