import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoListContainer from './TodoListContainer';

jest.mock('react-redux', () => {
  const actual = jest.requireActual('react-redux');
  const mockDispatch = jest.fn();
  
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: jest.fn(),
  };
});

describe('<TodoListContainer />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { useSelector } = jest.requireMock('react-redux');
    useSelector.mockImplementation((selector) => {
      const mockState = {
        todo: {
          isLoading: false,
          isActionLoading: false,
          isContentLoading: false,
          error: '',
          todoItems: [{ id: 1, text: 'Test todo', completed: false }],
          currentTodoItem: { text: '', id: '' },
        },
        filters: [
          { id: 'SHOW_ALL', label: 'All', selected: true },
          { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
          { id: 'SHOW_ACTIVE', label: 'Active', selected: false },
        ],
        config: { name: 'Todo App', lang: 'en', theme: 'light' },
      };
      return selector(mockState);
    });
  });

  it('Renders successfully', () => {
    render(<TodoListContainer />);
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('Renders with empty todos', () => {
    const { useSelector } = jest.requireMock('react-redux');
    useSelector.mockImplementation((selector) => {
      const mockState = {
        todo: {
          isLoading: false,
          isActionLoading: false,
          isContentLoading: false,
          error: '',
          todoItems: [],
          currentTodoItem: { text: '', id: '' },
        },
        filters: [
          { id: 'SHOW_ALL', label: 'All', selected: true },
          { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
          { id: 'SHOW_ACTIVE', label: 'Active', selected: false },
        ],
        config: { name: 'Todo App', lang: 'en', theme: 'light' },
      };
      return selector(mockState);
    });
    
    render(<TodoListContainer />);
    expect(screen.getByText('Nothing to display here. Carry on.')).toBeInTheDocument();
  });

  it('Renders with loading content state', () => {
    const { useSelector } = jest.requireMock('react-redux');
    useSelector.mockImplementation((selector) => {
      const mockState = {
        todo: {
          isLoading: false,
          isActionLoading: false,
          isContentLoading: true,
          error: '',
          todoItems: [],
          currentTodoItem: { text: '', id: '' },
        },
        filters: [
          { id: 'SHOW_ALL', label: 'All', selected: true },
          { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
          { id: 'SHOW_ACTIVE', label: 'Active', selected: false },
        ],
        config: { name: 'Todo App', lang: 'en', theme: 'light' },
      };
      return selector(mockState);
    });
    
    render(<TodoListContainer />);
    const skeletons = document.querySelectorAll('.skeleton');
    expect(skeletons.length).toBe(3);
  });

  it('Renders with error state', () => {
    const { useSelector } = jest.requireMock('react-redux');
    useSelector.mockImplementation((selector) => {
      const mockState = {
        todo: {
          isLoading: false,
          isActionLoading: false,
          isContentLoading: false,
          error: 'Failed to load',
          todoItems: [],
          currentTodoItem: { text: '', id: '' },
        },
        filters: [
          { id: 'SHOW_ALL', label: 'All', selected: true },
          { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
          { id: 'SHOW_ACTIVE', label: 'Active', selected: false },
        ],
        config: { name: 'Todo App', lang: 'en', theme: 'light' },
      };
      return selector(mockState);
    });
    
    render(<TodoListContainer />);
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
  });
});
