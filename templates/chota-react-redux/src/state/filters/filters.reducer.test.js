import filters from './filters.reducer';
import initialFiltersState from './filters.initial';
import { SET_VISIBILITY_FILTER } from './filters.type';

describe('Filters Reducer', () => {
  it('returns the initial state when action type is not recognized', () => {
    const initialState = [
      { id: 'all', label: 'All', selected: true },
      { id: 'active', label: 'Active', selected: false },
      { id: 'completed', label: 'Completed', selected: false },
    ];
    const action = { type: 'UNKNOWN_ACTION' };
    
    const result = filters(initialState, action);
    expect(result).toBe(initialState);
  });

  it('returns initial state when no state is provided', () => {
    const action = { type: SET_VISIBILITY_FILTER, filter: 'all' };
    const result = filters(undefined, action);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  describe('SET_VISIBILITY_FILTER action', () => {
    it('sets the selected filter to true and others to false for "all"', () => {
      const initialState = [
        { id: 'all', label: 'All', selected: false },
        { id: 'active', label: 'Active', selected: false },
        { id: 'completed', label: 'Completed', selected: true },
      ];
      
      const action = {
        type: SET_VISIBILITY_FILTER,
        filter: 'all',
      };
      
      const result = filters(initialState, action);
      expect(result[0].selected).toBe(true);
      expect(result[1].selected).toBe(false);
      expect(result[2].selected).toBe(false);
    });

    it('sets the selected filter to true and others to false for "active"', () => {
      const initialState = [
        { id: 'all', label: 'All', selected: true },
        { id: 'active', label: 'Active', selected: false },
        { id: 'completed', label: 'Completed', selected: false },
      ];
      
      const action = {
        type: SET_VISIBILITY_FILTER,
        filter: 'active',
      };
      
      const result = filters(initialState, action);
      expect(result[0].selected).toBe(false);
      expect(result[1].selected).toBe(true);
      expect(result[2].selected).toBe(false);
    });

    it('sets the selected filter to true and others to false for "completed"', () => {
      const initialState = [
        { id: 'all', label: 'All', selected: false },
        { id: 'active', label: 'Active', selected: true },
        { id: 'completed', label: 'Completed', selected: false },
      ];
      
      const action = {
        type: SET_VISIBILITY_FILTER,
        filter: 'completed',
      };
      
      const result = filters(initialState, action);
      expect(result[0].selected).toBe(false);
      expect(result[1].selected).toBe(false);
      expect(result[2].selected).toBe(true);
    });

    it('preserves other filter properties when updating selected state', () => {
      const initialState = [
        { id: 'all', label: 'All Items', selected: false },
        { id: 'active', label: 'Active Only', selected: false },
      ];
      
      const action = {
        type: SET_VISIBILITY_FILTER,
        filter: 'all',
      };
      
      const result = filters(initialState, action);
      expect(result[0].id).toBe('all');
      expect(result[0].label).toBe('All Items');
      expect(result[0].selected).toBe(true);
    });
  });
});
