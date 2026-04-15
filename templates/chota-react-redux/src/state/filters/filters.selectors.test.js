import { getSelectedFilter } from './filters.selectors';

describe('Filters Selectors', () => {
  describe('getSelectedFilter', () => {
    it('returns the filter that is selected', () => {
      const state = {
        filters: [
          { id: 'all', label: 'All', selected: false },
          { id: 'active', label: 'Active', selected: true },
          { id: 'completed', label: 'Completed', selected: false },
        ],
      };

      const result = getSelectedFilter(state);
      expect(result.id).toBe('active');
      expect(result.selected).toBe(true);
    });

    it('returns undefined when no filter is selected', () => {
      // In normal usage, one filter should always be selected
      // But we test this edge case for 100% coverage
      const state = {
        filters: [
          { id: 'all', label: 'All', selected: false },
          { id: 'active', label: 'Active', selected: false },
        ],
      };

      expect(getSelectedFilter(state)).toBeUndefined();
    });

    it('returns undefined when no filters are provided', () => {
      const state = { filters: [] };
      const result = getSelectedFilter(state);
      expect(result).toBeUndefined();
    });
  });
});
