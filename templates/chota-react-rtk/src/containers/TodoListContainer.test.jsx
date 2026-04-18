import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../state/rootReducer';
import TodoListContainer from './TodoListContainer';

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

describe('<TodoListContainer />', () => {
  const defaultState = {
    todo: {
      isLoading: false,
      isActionLoading: false,
      isContentLoading: false,
      error: '',
      todoItems: [
        { id: 1, text: 'Test todo', completed: false },
      ],
      currentTodoItem: { text: '', id: '' },
    },
    filters: [
      { id: 'SHOW_ALL', label: 'All', selected: true },
      { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
      { id: 'SHOW_ACTIVE', label: 'Active', selected: false },
    ],
    config: { name: 'Todo App', lang: 'en', theme: 'light' },
  };

  it('Renders successfully', () => {
    const store = createTestStore(defaultState);
    render(
      <Provider store={store}>
        <TodoListContainer />
      </Provider>,
    );
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('Renders with empty todos', () => {
    const emptyState = {
      ...defaultState,
      todo: { ...defaultState.todo, todoItems: [] },
    };
    const store = createTestStore(emptyState);
    render(
      <Provider store={store}>
        <TodoListContainer />
      </Provider>,
    );
    expect(screen.getByText('Nothing to display here. Carry on.')).toBeInTheDocument();
  });

  it('Renders with loading content state', () => {
    const loadingState = {
      ...defaultState,
      todo: { ...defaultState.todo, isContentLoading: true },
    };
    const store = createTestStore(loadingState);
    render(
      <Provider store={store}>
        <TodoListContainer />
      </Provider>,
    );
    const skeletons = document.querySelectorAll('.skeleton');
    expect(skeletons.length).toBe(3);
  });

  it('Renders with error state', () => {
    const errorState = {
      ...defaultState,
      todo: { ...defaultState.todo, error: 'Failed to load' },
    };
    const store = createTestStore(errorState);
    render(
      <Provider store={store}>
        <TodoListContainer />
      </Provider>,
    );
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
  });

  it('Renders with action loading state', () => {
    const loadingState = {
      ...defaultState,
      todo: { ...defaultState.todo, isActionLoading: true },
    };
    const store = createTestStore(loadingState);
    render(
      <Provider store={store}>
        <TodoListContainer />
      </Provider>,
    );
    // The isActionLoading is passed to TodoItems and then to TodoItem
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('Renders with edit state', () => {
    const editState = {
      ...defaultState,
      todo: {
        ...defaultState.todo,
        currentTodoItem: { text: 'Editing todo', id: 1 },
      },
    };
    const store = createTestStore(editState);
    render(
      <Provider store={store}>
        <TodoListContainer />
      </Provider>,
    );
    const input = screen.getByRole('textbox');
    expect(input.value).toBe('Editing todo');
  });

  it('Filters todos by completed status', () => {
    const stateWithCompleted = {
      ...defaultState,
      todo: {
        ...defaultState.todo,
        todoItems: [
          { id: 1, text: 'Active todo', completed: false },
          { id: 2, text: 'Done todo', completed: true },
        ],
      },
      filters: [
        { id: 'SHOW_ALL', label: 'All', selected: false },
        { id: 'SHOW_COMPLETED', label: 'Completed', selected: true },
        { id: 'SHOW_ACTIVE', label: 'Active', selected: false },
      ],
    };
    const store = createTestStore(stateWithCompleted);
    render(
      <Provider store={store}>
        <TodoListContainer />
      </Provider>,
    );
    expect(screen.getByText('Done todo')).toBeInTheDocument();
    expect(screen.queryByText('Active todo')).not.toBeInTheDocument();
  });

  it('Filters todos by active status', () => {
    const stateWithActive = {
      ...defaultState,
      todo: {
        ...defaultState.todo,
        todoItems: [
          { id: 1, text: 'Active todo', completed: false },
          { id: 2, text: 'Done todo', completed: true },
        ],
      },
      filters: [
        { id: 'SHOW_ALL', label: 'All', selected: false },
        { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
        { id: 'SHOW_ACTIVE', label: 'Active', selected: true },
      ],
    };
    const store = createTestStore(stateWithActive);
    render(
      <Provider store={store}>
        <TodoListContainer />
      </Provider>,
    );
    expect(screen.getByText('Active todo')).toBeInTheDocument();
    expect(screen.queryByText('Done todo')).not.toBeInTheDocument();
  });

  it('Handles todo create event', () => {
    const store = createTestStore(defaultState);
    render(
      <Provider store={store}>
        <TodoListContainer />
      </Provider>,
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New todo' } });
    fireEvent.submit(input.closest('form'));
    expect(screen.getByText('New todo')).toBeInTheDocument();
  });

  it('Handles todo toggle event', () => {
    const store = createTestStore(defaultState);
    render(
      <Provider store={store}>
        <TodoListContainer />
      </Provider>,
    );
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    const state = store.getState();
    expect(state.todo.todoItems[0].completed).toBe(true);
  });

  it('Handles todo edit event', () => {
    const store = createTestStore(defaultState);
    render(
      <Provider store={store}>
        <TodoListContainer />
      </Provider>,
    );
    const editButtons = screen.getAllByRole('button');
    editButtons[1].click();
    const state = store.getState();
    expect(state.todo.currentTodoItem.id).toBe(1);
    expect(state.todo.currentTodoItem.text).toBe('Test todo');
  });

  it('Handles todo update event', () => {
    const editState = {
      ...defaultState,
      todo: {
        ...defaultState.todo,
        currentTodoItem: { text: 'Editing', id: 1 },
      },
    };
    const store = createTestStore(editState);
    render(
      <Provider store={store}>
        <TodoListContainer />
      </Provider>,
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Updated text' } });
    fireEvent.submit(input.closest('form'));
    const state = store.getState();
    expect(state.todo.todoItems[0].text).toBe('Updated text');
    expect(state.todo.currentTodoItem.text).toBe('');
  });

  it('Handles todo delete event', () => {
    const store = createTestStore(defaultState);
    render(
      <Provider store={store}>
        <TodoListContainer />
      </Provider>,
    );
    const deleteButtons = screen.getAllByRole('button');
    deleteButtons[2].click();
    const state = store.getState();
    expect(state.todo.todoItems).toHaveLength(0);
  });
});
