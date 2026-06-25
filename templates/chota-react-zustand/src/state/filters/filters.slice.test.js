import { createAppStore } from '../index';

describe('filters slice', () => {
  it('selects SHOW_ALL by default', () => {
    const store = createAppStore();
    const selected = store.getState().filters.find((filter) => filter.selected);
    expect(selected.id).toBe('SHOW_ALL');
  });

  it('setVisibilityFilter selects the matching filter and deselects others', () => {
    const store = createAppStore();
    store.getState().setVisibilityFilter('SHOW_ACTIVE');
    const filters = store.getState().filters;
    expect(filters.find((f) => f.id === 'SHOW_ACTIVE').selected).toBe(true);
    expect(filters.find((f) => f.id === 'SHOW_ALL').selected).toBe(false);
    expect(filters.find((f) => f.id === 'SHOW_COMPLETED').selected).toBe(false);
  });

  it('preserves filter labels when toggling selection', () => {
    const store = createAppStore();
    store.getState().setVisibilityFilter('SHOW_COMPLETED');
    const completed = store.getState().filters.find((f) => f.id === 'SHOW_COMPLETED');
    expect(completed.label).toBe('Completed');
    expect(completed.selected).toBe(true);
  });
});
