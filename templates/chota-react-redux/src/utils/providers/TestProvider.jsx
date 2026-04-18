import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import rootReducer from '../../state/rootReducer';
import { createStore } from 'redux';
import AtomicProvider from './AtomicProvider';

export const createTestStore = (preloadedState = {}) => {
  return createStore(rootReducer, preloadedState);
};

const TestProvider = ({ children, preloadedState = {} }) => {
  const store = createTestStore(preloadedState);
  
  return (
    <Provider store={store}>
      <AtomicProvider>{children}</AtomicProvider>
    </Provider>
  );
};

export default TestProvider;
