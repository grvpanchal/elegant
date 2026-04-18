import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../state/rootReducer';
import ConfigContainer from './ConfigContainer';

const createTestStore = (preloadedState = {}) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(rootReducer, preloadedState, applyMiddleware(sagaMiddleware));
  sagaMiddleware.run(function*() {});
  return store;
};

describe('<ConfigContainer />', () => {
  beforeEach(() => {
    document.body.classList.remove('dark');
  });

  it('Renders successfully and returns null', () => {
    const store = createTestStore();
    const { container } = render(
      <Provider store={store}>
        <ConfigContainer />
      </Provider>,
    );
    expect(container.innerHTML).toBe('');
  });

  it('Removes dark class when theme is light', () => {
    const store = createTestStore({
      config: { name: 'Todo App', lang: 'en', theme: 'light', themeMode: 'light' },
    });
    render(
      <Provider store={store}>
        <ConfigContainer />
      </Provider>,
    );
    expect(document.body.classList.contains('dark')).toBe(false);
  });

  it('Adds dark class when theme is dark', () => {
    const store = createTestStore({
      config: { name: 'Todo App', lang: 'en', theme: 'dark', themeMode: 'dark' },
    });
    render(
      <Provider store={store}>
        <ConfigContainer />
      </Provider>,
    );
    expect(document.body.classList.contains('dark')).toBe(true);
  });
});
