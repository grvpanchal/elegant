import { defineStore, acceptHMRUpdate } from 'pinia';
import initialFiltersState from './filters.initial';
import { getSelectedFilter } from './filters.selectors';
import { setVisibilityFilter } from './filters.action';

export const useFiltersStore = defineStore('filters', {
  state: () => (initialFiltersState),
  getters: {
    selectedFilter: getSelectedFilter,
  },
  actions: {
    setVisibilityFilter,
  },
})

/* istanbul ignore next */
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFiltersStore, import.meta.hot))
}
