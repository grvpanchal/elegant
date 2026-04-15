import * as FiltersActions from './filters.actions';

describe('Filters Actions', () => {
  describe('setVisibilityFilter', () => {
    it('should create an action with filter string', () => {
      const action = FiltersActions.setVisibilityFilter({ filter: 'SHOW_ALL' });
      expect(action.type).toBe('[Filters] SetVisibilityFilter');
      expect(action.filter).toBe('SHOW_ALL');
    });

    it('should work with SHOW_ACTIVE filter', () => {
      const action = FiltersActions.setVisibilityFilter({ filter: 'SHOW_ACTIVE' });
      expect(action.type).toBe('[Filters] SetVisibilityFilter');
      expect(action.filter).toBe('SHOW_ACTIVE');
    });

    it('should work with SHOW_COMPLETED filter', () => {
      const action = FiltersActions.setVisibilityFilter({ filter: 'SHOW_COMPLETED' });
      expect(action.type).toBe('[Filters] SetVisibilityFilter');
      expect(action.filter).toBe('SHOW_COMPLETED');
    });
  });
});
