import { defineStore, acceptHMRUpdate } from 'pinia';
import initialFiltersState from './filters.initial';
import { getSelectedFilter } from './filters.selectors';
import { setVisibilityFilter } from './filters.action';

export const useFiltersStore = defineStore({
  id: 'filters',
  state: () => (initialFiltersState),
  getters: {
    selectedFilter: getSelectedFilter,
  },
  actions: {
    setVisibilityFilter,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFiltersStore, import.meta.hot))
}
