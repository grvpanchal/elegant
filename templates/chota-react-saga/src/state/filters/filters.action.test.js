import { setVisibilityFilter } from './filters.action';
import { SET_VISIBILITY_FILTER } from './filters.type';

describe('filters actions', () => {
  it('should create a setVisibilityFilter action', () => {
    const filter = 'SHOW_ALL';
    const action = setVisibilityFilter(filter);
    expect(action.type).toBe(SET_VISIBILITY_FILTER);
    expect(action.filter).toBe(filter);
  });

  it('should create a setVisibilityFilter action with SHOW_COMPLETED', () => {
    const filter = 'SHOW_COMPLETED';
    const action = setVisibilityFilter(filter);
    expect(action.type).toBe(SET_VISIBILITY_FILTER);
    expect(action.filter).toBe(filter);
  });

  it('should create a setVisibilityFilter action with SHOW_ACTIVE', () => {
    const filter = 'SHOW_ACTIVE';
    const action = setVisibilityFilter(filter);
    expect(action.type).toBe(SET_VISIBILITY_FILTER);
    expect(action.filter).toBe(filter);
  });
});
