import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterGroup from './FilterGroup.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<FilterGroup />', () => {
  const filterItems = [
    { id: 'SHOW_ALL', label: 'All', selected: true },
    { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
    { id: 'SHOW_ACTIVE', label: 'Active', selected: false },
  ];

  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <FilterGroup filterItems={filterItems} onFilterClick={() => {}} />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('Renders all filter items', () => {
    render(
      <TestProvider>
        <FilterGroup filterItems={filterItems} onFilterClick={() => {}} />
      </TestProvider>,
    );
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('Renders with empty filterItems array', () => {
    const { container } = render(
      <TestProvider>
        <FilterGroup filterItems={[]} onFilterClick={() => {}} />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('Calls onFilterClick with correct id when a filter is clicked', () => {
    const onFilterClick = vi.fn();
    render(
      <TestProvider>
        <FilterGroup filterItems={filterItems} onFilterClick={onFilterClick} />
      </TestProvider>,
    );
    fireEvent.click(screen.getByText('Completed'));
    expect(onFilterClick).toHaveBeenCalledWith('SHOW_COMPLETED');
  });

  it('Renders with role="group"', () => {
    render(
      <TestProvider>
        <FilterGroup filterItems={filterItems} onFilterClick={() => {}} />
      </TestProvider>,
    );
    expect(screen.getByRole('group')).toBeInTheDocument();
  });
});
