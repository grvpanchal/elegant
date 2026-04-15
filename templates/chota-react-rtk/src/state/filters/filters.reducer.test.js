import filtersReducer from './filters.reducer';
import { setVisibilityFilter } from './filters.action';
import { SET_VISIBILITY_FILTER, SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from './filters.type';
import initialFiltersState from './filters.initial';

describe('filters reducer', () => {
  it('should return the initial state', () => {
    expect(filtersReducer(undefined, { type: 'unknown' })).toEqual(initialFiltersState);
  });

  it('should handle SET_VISIBILITY_FILTER with SHOW_ALL', () => {
    const nextState = filtersReducer(initialFiltersState, setVisibilityFilter(SHOW_ALL));
    expect(nextState).toHaveLength(3);
    expect(nextState.find(f => f.id === SHOW_ALL).selected).toBe(true);
    expect(nextState.find(f => f.id === SHOW_COMPLETED).selected).toBe(false);
    expect(nextState.find(f => f.id === SHOW_ACTIVE).selected).toBe(false);
  });

  it('should handle SET_VISIBILITY_FILTER with SHOW_COMPLETED', () => {
    const nextState = filtersReducer(initialFiltersState, setVisibilityFilter(SHOW_COMPLETED));
    expect(nextState.find(f => f.id === SHOW_COMPLETED).selected).toBe(true);
    expect(nextState.find(f => f.id === SHOW_ALL).selected).toBe(false);
    expect(nextState.find(f => f.id === SHOW_ACTIVE).selected).toBe(false);
  });

  it('should handle SET_VISIBILITY_FILTER with SHOW_ACTIVE', () => {
    const nextState = filtersReducer(initialFiltersState, setVisibilityFilter(SHOW_ACTIVE));
    expect(nextState.find(f => f.id === SHOW_ACTIVE).selected).toBe(true);
    expect(nextState.find(f => f.id === SHOW_ALL).selected).toBe(false);
    expect(nextState.find(f => f.id === SHOW_COMPLETED).selected).toBe(false);
  });

  it('should return current state for unknown action', () => {
    const currentState = [
      { id: SHOW_ALL, label: 'All', selected: false },
      { id: SHOW_COMPLETED, label: 'Completed', selected: true },
      { id: SHOW_ACTIVE, label: 'Active', selected: false },
    ];
    expect(filtersReducer(currentState, { type: 'unknown' })).toEqual(currentState);
  });
});

describe('filters action', () => {
  it('should create a setVisibilityFilter action', () => {
    const action = setVisibilityFilter(SHOW_ALL);
    expect(action.type).toBe(SET_VISIBILITY_FILTER);
    expect(action.filter).toBe(SHOW_ALL);
  });
});

describe('filters selectors', () => {
  it('should return the selected filter', () => {
    const { getSelectedFilter } = require('./filters.selectors');
    const state = {
      filters: [
        { id: SHOW_ALL, label: 'All', selected: false },
        { id: SHOW_COMPLETED, label: 'Completed', selected: true },
        { id: SHOW_ACTIVE, label: 'Active', selected: false },
      ],
    };
    expect(getSelectedFilter(state)).toEqual({ id: SHOW_COMPLETED, label: 'Completed', selected: true });
  });
});
