import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../../state/rootReducer';
import AtomicProvider from './AtomicProvider';

export const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

export const TestProvider = ({ children, store = null, preloadedState = {} }) => {
  const testStore = store || createTestStore(preloadedState);

  return (
    <Provider store={testStore}>
      <AtomicProvider>
        {children}
      </AtomicProvider>
    </Provider>
  );
};

export default TestProvider;
