import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../state/rootReducer';
import SiteHeaderContainer from './SiteHeaderContainer';

const createTestStore = (preloadedState = {}) => {
  return createStore(rootReducer, preloadedState);
};

describe('<SiteHeaderContainer />', () => {
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
        <SiteHeaderContainer />
      </Provider>,
    );
    expect(screen.getByText('Todo App')).toBeInTheDocument();
  });

  it('Displays moon icon for light theme', () => {
    const store = createTestStore(defaultState);
    render(
      <Provider store={store}>
        <SiteHeaderContainer />
      </Provider>,
    );
    expect(screen.getByText('🌙')).toBeInTheDocument();
  });

  it('Displays sun icon for dark theme', () => {
    const darkState = {
      ...defaultState,
      config: { ...defaultState.config, theme: 'dark' },
    };
    const store = createTestStore(darkState);
    render(
      <Provider store={store}>
        <SiteHeaderContainer />
      </Provider>,
    );
    expect(screen.getByText('☀️')).toBeInTheDocument();
  });

  it('Toggles theme when theme toggle is clicked', () => {
    const store = createTestStore(defaultState);
    render(
      <Provider store={store}>
        <SiteHeaderContainer />
      </Provider>,
    );
    const themeToggle = screen.getByRole('button', { name: /🌙/ });
    fireEvent.click(themeToggle);
    const state = store.getState();
    expect(state.config.theme).toBe('dark');
  });

  it('Toggles theme from dark to light', () => {
    const darkState = {
      ...defaultState,
      config: { ...defaultState.config, theme: 'dark' },
    };
    const store = createTestStore(darkState);
    render(
      <Provider store={store}>
        <SiteHeaderContainer />
      </Provider>,
    );
    const themeToggle = screen.getByRole('button', { name: /☀️/ });
    fireEvent.click(themeToggle);
    const state = store.getState();
    expect(state.config.theme).toBe('light');
  });
});
