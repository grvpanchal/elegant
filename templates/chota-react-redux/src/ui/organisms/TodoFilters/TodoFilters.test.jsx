import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoFilters from './TodoFilters.component';
import TestProvider from '../../../utils/providers/TestProvider';

describe('<TodoFilters />', () => {
  const filtersData = [
    { id: 'SHOW_ALL', label: 'All', selected: true },
    { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
    { id: 'SHOW_ACTIVE', label: 'Active', selected: false },
  ];

  const events = {
    onTodoFilterUpdate: vi.fn(),
  };

  it('Renders successfully without error', () => {
    const { container } = render(
      <TestProvider>
        <TodoFilters filtersData={filtersData} events={events} />
      </TestProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('Renders filter items', () => {
    render(
      <TestProvider>
        <TodoFilters filtersData={filtersData} events={events} />
      </TestProvider>,
    );
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('Renders Skeleton when isContentLoading is true', () => {
    const loadingFiltersData = { isContentLoading: true };
    render(
      <TestProvider>
        <TodoFilters filtersData={loadingFiltersData} events={events} />
      </TestProvider>,
    );
    const skeletons = document.querySelectorAll('.skeleton');
    expect(skeletons.length).toBe(3);
  });

  it('Renders FilterGroup when isContentLoading is false', () => {
    render(
      <TestProvider>
        <TodoFilters filtersData={filtersData} events={events} />
      </TestProvider>,
    );
    const skeletons = document.querySelectorAll('.skeleton');
    expect(skeletons.length).toBe(0);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });
});
