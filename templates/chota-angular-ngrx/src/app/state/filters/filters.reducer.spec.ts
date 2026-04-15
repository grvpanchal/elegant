import { filtersReducer } from './filters.reducer';
import { setVisibilityFilter } from './filters.actions';
import initialFiltersState from './filters.initial';

describe('FiltersReducer', () => {
  it('should return the default state', () => {
    const action = { type: 'UNKNOWN' } as any;
    const state = filtersReducer(undefined, action);
    expect(state).toEqual(initialFiltersState);
  });

  describe('setVisibilityFilter', () => {
    it('should set the matching filter as selected and deselect others', () => {
      const action = setVisibilityFilter({ filter: 'SHOW_ACTIVE' });
      const result = filtersReducer(initialFiltersState, action);

      expect(result[0].selected).toBe(false);
      expect(result[1].selected).toBe(true);
      expect(result[2].selected).toBe(false);
    });

    it('should select SHOW_COMPLETED filter', () => {
      const action = setVisibilityFilter({ filter: 'SHOW_COMPLETED' });
      const result = filtersReducer(initialFiltersState, action);

      expect(result[0].selected).toBe(false);
      expect(result[1].selected).toBe(false);
      expect(result[2].selected).toBe(true);
    });

    it('should select SHOW_ALL filter', () => {
      const stateWithActiveSelected = [
        { id: 'SHOW_ALL', label: 'All', selected: false },
        { id: 'SHOW_ACTIVE', label: 'Active', selected: true },
        { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
      ];
      const action = setVisibilityFilter({ filter: 'SHOW_ALL' });
      const result = filtersReducer(stateWithActiveSelected, action);

      expect(result[0].selected).toBe(true);
      expect(result[1].selected).toBe(false);
      expect(result[2].selected).toBe(false);
    });

    it('should preserve id and label when updating selected', () => {
      const action = setVisibilityFilter({ filter: 'SHOW_ACTIVE' });
      const result = filtersReducer(initialFiltersState, action);

      expect(result[0]).toEqual({ id: 'SHOW_ALL', label: 'All', selected: false });
      expect(result[1]).toEqual({ id: 'SHOW_ACTIVE', label: 'Active', selected: true });
      expect(result[2]).toEqual({ id: 'SHOW_COMPLETED', label: 'Completed', selected: false });
    });
  });
});
