import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FilterGroup from './FilterGroup.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<FilterGroup />', () => {
  const mockOnFilterClick = vi.fn();

  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <FilterGroup filterItems={[]} onFilterClick={mockOnFilterClick} />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('Renders filter items correctly', () => {
    const mockFilters = [
      { id: 'all', label: 'All', selected: true },
      { id: 'active', label: 'Active', selected: false },
      { id: 'completed', label: 'Completed', selected: false },
    ];
    const { getByText } = render(
      <TestProvider>
        <FilterGroup filterItems={mockFilters} onFilterClick={mockOnFilterClick} />
      </TestProvider>,
    );
    expect(getByText('All')).toBeInTheDocument();
    expect(getByText('Active')).toBeInTheDocument();
    expect(getByText('Completed')).toBeInTheDocument();
  });

  it('Calls onFilterClick when a filter is clicked', () => {
    const mockFilters = [
      { id: 'all', label: 'All', selected: true },
      { id: 'active', label: 'Active', selected: false },
    ];
    const { getByText } = render(
      <TestProvider>
        <FilterGroup filterItems={mockFilters} onFilterClick={mockOnFilterClick} />
      </TestProvider>,
    );
    fireEvent.click(getByText('Active'));
    expect(mockOnFilterClick).toHaveBeenCalledWith('active');
  });
});