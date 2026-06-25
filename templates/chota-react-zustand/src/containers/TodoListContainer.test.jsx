import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import useStore from '../state';
import TodoListContainer from './TodoListContainer';

vi.mock('../state', () => ({ default: vi.fn(), createAppStore: vi.fn() }));

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
  readTodo: vi.fn(),
  createTodo: vi.fn(),
  editTodo: vi.fn(),
  updateTodo: vi.fn(),
  toggleTodo: vi.fn(),
  deleteTodo: vi.fn(),
});

const useState = (state) =>
  useStore.mockImplementation((selector) => selector(state));

describe('<TodoListContainer />', () => {
  it('Renders successfully', () => {
    useState(mkState());
    render(<TodoListContainer />);
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('Reads todos on mount', () => {
    const state = mkState();
    useState(state);
    render(<TodoListContainer />);
    expect(state.readTodo).toHaveBeenCalledTimes(1);
  });

  it('Renders with empty todos', () => {
    useState(mkState({ todoItems: [] }));
    render(<TodoListContainer />);
    expect(screen.getByText('Nothing to display here. Carry on.')).toBeInTheDocument();
  });

  it('Renders with loading content state', () => {
    useState(mkState({ todoItems: [], isContentLoading: true }));
    render(<TodoListContainer />);
    const skeletons = document.querySelectorAll('.skeleton');
    expect(skeletons.length).toBe(3);
  });

  it('Renders with error state', () => {
    useState(mkState({ todoItems: [], error: 'Failed to load' }));
    render(<TodoListContainer />);
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
  });

  it('Toggles a todo item via the store action', () => {
    const state = mkState();
    useState(state);
    render(<TodoListContainer />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(state.toggleTodo).toHaveBeenCalledWith({ id: 1, text: 'Test todo', completed: false });
  });

  it('Deletes a todo item via the store action', () => {
    const state = mkState();
    useState(state);
    render(<TodoListContainer />);
    fireEvent.click(screen.getByRole('button', { name: /remove/i }));
    expect(state.deleteTodo).toHaveBeenCalledWith(1);
  });
});
