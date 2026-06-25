import initialFiltersState from "./filters.initial";

/*
The filters slice holds the visibility filter list. `setVisibilityFilter` marks
the matching filter as selected and the rest as not — the same transformation the
Redux `filters` reducer performed on SET_VISIBILITY_FILTER.
*/
export const createFiltersSlice = (set) => ({
  filters: initialFiltersState.map((filter) => ({ ...filter })),

  setVisibilityFilter: (filter) =>
    set(
      (state) => ({
        filters: state.filters.map((item) =>
          item.id === filter
            ? { ...item, selected: true }
            : { ...item, selected: false }
        ),
      }),
      false,
      "filters/setVisibilityFilter"
    ),
});

export default createFiltersSlice;
