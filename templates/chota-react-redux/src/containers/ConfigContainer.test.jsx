import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../state/rootReducer';
import ConfigContainer from './ConfigContainer';

const createTestStore = (preloadedState = {}) => {
  return createStore(rootReducer, preloadedState);
};

describe('<ConfigContainer />', () => {
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

  beforeEach(() => {
    document.body.classList.remove('dark');
  });

  it('Renders successfully and returns null', () => {
    const store = createTestStore(defaultState);
    const { container } = render(
      <Provider store={store}>
        <ConfigContainer />
      </Provider>,
    );
    expect(container.innerHTML).toBe('');
  });

  it('Adds dark class to body when theme is dark', () => {
    const darkState = {
      ...defaultState,
      config: { ...defaultState.config, theme: 'dark' },
    };
    const store = createTestStore(darkState);
    render(
      <Provider store={store}>
        <ConfigContainer />
      </Provider>,
    );
    expect(document.body.classList.contains('dark')).toBe(true);
  });

  it('Removes dark class from body when theme is light', () => {
    const store = createTestStore(defaultState);
    render(
      <Provider store={store}>
        <ConfigContainer />
      </Provider>,
    );
    expect(document.body.classList.contains('dark')).toBe(false);
  });
});
