import React from 'react';
import { render, screen } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import TodoListContainer from './TodoListContainer';

vi.mock('react-redux', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
  };
});

const mkState = (todoOverrides = {}) => ({
  todo: {
    isLoading: false,
    isActionLoading: false,
    isContentLoading: false,
    error: '',
    todoItems: [{ id: 1, text: 'Test todo', completed: false }],
    currentTodoItem: { text: '', id: '' },
    ...todoOverrides,
  },
  filters: [
    { id: 'SHOW_ALL', label: 'All', selected: true },
    { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
    { id: 'SHOW_ACTIVE', label: 'Active', selected: false },
  ],
  config: { name: 'Todo App', lang: 'en', theme: 'light' },
});

describe('<TodoListContainer />', () => {
  beforeEach(() => {
    useDispatch.mockReturnValue(vi.fn());
    useSelector.mockImplementation((selector) => selector(mkState()));
  });

  it('Renders successfully', () => {
    render(<TodoListContainer />);
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('Renders with empty todos', () => {
    useSelector.mockImplementation((selector) => selector(mkState({ todoItems: [] })));
    render(<TodoListContainer />);
    expect(screen.getByText('Nothing to display here. Carry on.')).toBeInTheDocument();
  });

  it('Renders with loading content state', () => {
    useSelector.mockImplementation((selector) =>
      selector(mkState({ todoItems: [], isContentLoading: true })),
    );
    render(<TodoListContainer />);
    const skeletons = document.querySelectorAll('.skeleton');
    expect(skeletons.length).toBe(3);
  });

  it('Renders with error state', () => {
    useSelector.mockImplementation((selector) =>
      selector(mkState({ todoItems: [], error: 'Failed to load' })),
    );
    render(<TodoListContainer />);
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
  });
});
