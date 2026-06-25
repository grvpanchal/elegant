import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import useStore from '../state';
import TodoFiltersContainer from './TodoFiltersContainer';

vi.mock('../state', () => ({ default: vi.fn(), createAppStore: vi.fn() }));

const filters = [
  { id: 'SHOW_ALL', label: 'All', selected: true },
  { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
  { id: 'SHOW_ACTIVE', label: 'Active', selected: false },
];

const setup = () => {
  const setVisibilityFilter = vi.fn();
  const state = { filters, setVisibilityFilter };
  useStore.mockImplementation((selector) => selector(state));
  return { setVisibilityFilter };
};

describe('<TodoFiltersContainer />', () => {
  it('Renders successfully', () => {
    setup();
    const { container } = render(<TodoFiltersContainer />);
    expect(container).toBeTruthy();
  });

  it('Renders filter items from state', () => {
    setup();
    render(<TodoFiltersContainer />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('Calls setVisibilityFilter with the filter id when clicked', () => {
    const { setVisibilityFilter } = setup();
    render(<TodoFiltersContainer />);
    fireEvent.click(screen.getByText('Completed'));
    expect(setVisibilityFilter).toHaveBeenCalledWith('SHOW_COMPLETED');
  });
});
