export function setVisibilityFilter(selectedFilter) {
  const filters = this.filters.map((filter) => {
    if (filter.id === selectedFilter) {
      return {
        ...filter,
        selected: true,
      }
    }
    return { ...filter, selected: false };
  });
  this.filters = filters;
}
