import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../state/rootReducer';
import TodoFiltersContainer from './TodoFiltersContainer';

const createTestStore = (preloadedState = {}) => {
  return createStore(rootReducer, preloadedState);
};

describe('<TodoFiltersContainer />', () => {
  const defaultState = {
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

  it('Renders successfully', () => {
    const store = createTestStore(defaultState);
    render(
      <Provider store={store}>
        <TodoFiltersContainer />
      </Provider>,
    );
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('Renders with loading content state', () => {
    const loadingState = {
      ...defaultState,
      filters: { isContentLoading: true },
    };
    const store = createTestStore(loadingState);
    render(
      <Provider store={store}>
        <TodoFiltersContainer />
      </Provider>,
    );
    const skeletons = document.querySelectorAll('.skeleton');
    expect(skeletons.length).toBe(3);
  });

  it('Dispatches setVisibilityFilter action when a filter is clicked', () => {
    const store = createTestStore(defaultState);
    render(
      <Provider store={store}>
        <TodoFiltersContainer />
      </Provider>,
    );
    fireEvent.click(screen.getByText('Completed'));
    const state = store.getState();
    const completedFilter = state.filters.find(f => f.id === 'SHOW_COMPLETED');
    expect(completedFilter.selected).toBe(true);
    const allFilter = state.filters.find(f => f.id === 'SHOW_ALL');
    expect(allFilter.selected).toBe(false);
  });
});
