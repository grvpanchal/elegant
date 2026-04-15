import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../state/rootReducer';
import SiteHeaderContainer from './SiteHeaderContainer';

const createTestStore = (preloadedState = {}) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(rootReducer, preloadedState, applyMiddleware(sagaMiddleware));
  sagaMiddleware.run(function*() {});
  return store;
};

describe('<SiteHeaderContainer />', () => {
  it('Renders successfully', () => {
    const store = createTestStore();
    const { container } = render(
      <Provider store={store}>
        <SiteHeaderContainer />
      </Provider>,
    );
    expect(container).toBeTruthy();
  });

  it('Displays the brand name from config', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <SiteHeaderContainer />
      </Provider>,
    );
    expect(screen.getByText('Todo App')).toBeInTheDocument();
  });

  it('Displays moon icon for light theme', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <SiteHeaderContainer />
      </Provider>,
    );
    expect(screen.getByRole('button', { name: /🌙/ })).toBeInTheDocument();
  });

  it('Displays sun icon for dark theme', () => {
    const store = createTestStore({
      config: { name: 'Todo App', lang: 'en', theme: 'dark', themeMode: 'dark' },
    });
    render(
      <Provider store={store}>
        <SiteHeaderContainer />
      </Provider>,
    );
    expect(screen.getByRole('button', { name: /☀️/ })).toBeInTheDocument();
  });

  it('Dispatches updateConfig with dark when theme is light', () => {
    const store = createTestStore();
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

  it('Dispatches updateConfig with light when theme is dark', () => {
    const store = createTestStore({
      config: { name: 'Todo App', lang: 'en', theme: 'dark', themeMode: 'dark' },
    });
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
