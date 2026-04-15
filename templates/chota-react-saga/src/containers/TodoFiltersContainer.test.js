import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../state';
import TodoFiltersContainer from './TodoFiltersContainer';

describe('<TodoFiltersContainer />', () => {
  it('Renders successfully', () => {
    const { container } = render(
      <Provider store={store}>
        <TodoFiltersContainer />
      </Provider>,
    );
    expect(container).toBeTruthy();
  });

  it('Renders filter items from state', () => {
    render(
      <Provider store={store}>
        <TodoFiltersContainer />
      </Provider>,
    );
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('Dispatches setVisibilityFilter action when a filter is clicked', () => {
    render(
      <Provider store={store}>
        <TodoFiltersContainer />
      </Provider>,
    );
    fireEvent.click(screen.getByText('Completed'));
    const state = store.getState();
    const completedFilter = state.filters.find((f) => f.id === 'SHOW_COMPLETED');
    expect(completedFilter.selected).toBe(true);
    const allFilter = state.filters.find((f) => f.id === 'SHOW_ALL');
    expect(allFilter.selected).toBe(false);
  });
});
