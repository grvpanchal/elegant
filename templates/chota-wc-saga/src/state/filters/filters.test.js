import { expect } from '@open-wc/testing';
import filtersReducer from './filters.reducer';
import initialFiltersState from './filters.initial';
import { setVisibilityFilter } from './filters.action';
import { SET_VISIBILITY_FILTER, SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from './filters.type';
import { getSelectedFilter } from './filters.selectors';

describe('filters reducer', () => {
  it('returns initial state for unknown action', () => {
    expect(filtersReducer(undefined, { type: 'UNKNOWN' })).to.deep.equal(initialFiltersState);
  });

  it('handles SET_VISIBILITY_FILTER with SHOW_ALL', () => {
    const state = filtersReducer(initialFiltersState, setVisibilityFilter(SHOW_ALL));
    expect(state.find(f => f.id === SHOW_ALL).selected).to.equal(true);
    expect(state.find(f => f.id === SHOW_COMPLETED).selected).to.equal(false);
    expect(state.find(f => f.id === SHOW_ACTIVE).selected).to.equal(false);
  });

  it('handles SET_VISIBILITY_FILTER with SHOW_COMPLETED', () => {
    const state = filtersReducer(initialFiltersState, setVisibilityFilter(SHOW_COMPLETED));
    expect(state.find(f => f.id === SHOW_COMPLETED).selected).to.equal(true);
    expect(state.find(f => f.id === SHOW_ALL).selected).to.equal(false);
  });

  it('handles SET_VISIBILITY_FILTER with SHOW_ACTIVE', () => {
    const state = filtersReducer(initialFiltersState, setVisibilityFilter(SHOW_ACTIVE));
    expect(state.find(f => f.id === SHOW_ACTIVE).selected).to.equal(true);
    expect(state.find(f => f.id === SHOW_ALL).selected).to.equal(false);
  });
});

describe('filters action', () => {
  it('setVisibilityFilter returns correct action', () => {
    const action = setVisibilityFilter(SHOW_ALL);
    expect(action.type).to.equal(SET_VISIBILITY_FILTER);
    expect(action.filter).to.equal(SHOW_ALL);
  });
});

describe('filters selectors', () => {
  it('getSelectedFilter returns the selected filter', () => {
    const state = {
      filters: [
        { id: SHOW_ALL, label: 'All', selected: false },
        { id: SHOW_COMPLETED, label: 'Completed', selected: true },
        { id: SHOW_ACTIVE, label: 'Active', selected: false },
      ],
    };
    const result = getSelectedFilter(state);
    expect(result.id).to.equal(SHOW_COMPLETED);
  });
});
