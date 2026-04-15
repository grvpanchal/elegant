import {
  SHOW_ALL,
  SHOW_COMPLETED,
  SHOW_ACTIVE,
  SET_VISIBILITY_FILTER,
} from './filters.type';

describe('Filters Action Types', () => {
  it('exports SHOW_ALL constant', () => {
    expect(SHOW_ALL).toBe('SHOW_ALL');
  });

  it('exports SHOW_COMPLETED constant', () => {
    expect(SHOW_COMPLETED).toBe('SHOW_COMPLETED');
  });

  it('exports SHOW_ACTIVE constant', () => {
    expect(SHOW_ACTIVE).toBe('SHOW_ACTIVE');
  });

  it('exports SET_VISIBILITY_FILTER constant', () => {
    expect(SET_VISIBILITY_FILTER).toBe('SET_VISIBILITY_FILTER');
  });
});
