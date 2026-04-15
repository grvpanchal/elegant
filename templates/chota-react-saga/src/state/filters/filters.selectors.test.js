import { getSelectedFilter } from './filters.selectors';

describe('filters selectors', () => {
  const mockState = {
    filters: [
      { id: 'SHOW_ALL', label: 'All', selected: true },
      { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
      { id: 'SHOW_ACTIVE', label: 'Active', selected: false },
    ],
  };

  it('should return the selected filter', () => {
    const result = getSelectedFilter(mockState);
    expect(result).toEqual({ id: 'SHOW_ALL', label: 'All', selected: true });
  });

  it('should return undefined when no filter is selected', () => {
    const stateWithNoSelection = {
      filters: [
        { id: 'SHOW_ALL', label: 'All', selected: false },
        { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
      ],
    };
    const result = getSelectedFilter(stateWithNoSelection);
    expect(result).toBeUndefined();
  });
});
