import instialFiltersState from "./filters.initial";
import { SET_VISIBILITY_FILTER } from "./filters.type";

const filters = (state = instialFiltersState, action) => {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return state.map((filter) => {
        if(filter.id === action.filter) {
          return {
            ...filter,
            selected: true,
          }
        }
        return { ...filter, selected: false };
      });
    default:
      return state
  }
}

export default filters