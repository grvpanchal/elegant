import { getFilters, getSelectedFilter } from './filters.selectors';
import { AppState } from '../index';

describe('Filters Selectors', () => {
  const mockFilters = [
    { id: 'SHOW_ALL', label: 'All', selected: true },
    { id: 'SHOW_ACTIVE', label: 'Active', selected: false },
    { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
  ];

  const createAppState = (filters = mockFilters): AppState => ({
    todo: {
      isLoading: false,
      isActionLoading: false,
      isContentLoading: false,
      error: '',
      todoItems: [],
      currentTodoItem: { id: null, text: '' },
    },
    filters,
    config: { name: 'Todo App', theme: 'light' },
  });

  describe('getFilters', () => {
    it('should return the filters array from state', () => {
      const state = createAppState();
      const result = getFilters(state);
      expect(result).toEqual(mockFilters);
    });
  });

  describe('getSelectedFilter', () => {
    it('should return the filter with selected true', () => {
      const state = createAppState();
      const result = getSelectedFilter(state);
      expect(result).toEqual({ id: 'SHOW_ALL', label: 'All', selected: true });
    });

    it('should return the selected filter when a different one is selected', () => {
      const filters = [
        { id: 'SHOW_ALL', label: 'All', selected: false },
        { id: 'SHOW_ACTIVE', label: 'Active', selected: true },
        { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
      ];
      const state = createAppState(filters);
      const result = getSelectedFilter(state);
      expect(result).toEqual({ id: 'SHOW_ACTIVE', label: 'Active', selected: true });
    });

    it('should return the first filter when none are selected', () => {
      const filters = [
        { id: 'SHOW_ALL', label: 'All', selected: false },
        { id: 'SHOW_ACTIVE', label: 'Active', selected: false },
        { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
      ];
      const state = createAppState(filters);
      const result = getSelectedFilter(state);
      expect(result).toEqual({ id: 'SHOW_ALL', label: 'All', selected: false });
    });

    it('should return the first filter when only one filter exists', () => {
      const filters = [{ id: 'SHOW_ALL', label: 'All', selected: false }];
      const state = createAppState(filters);
      const result = getSelectedFilter(state);
      expect(result).toEqual({ id: 'SHOW_ALL', label: 'All', selected: false });
    });
  });
});
