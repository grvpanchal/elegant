/* eslint-disable react/prop-types */
import React from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "../../state/rootReducer";
import rootSagas from "../../state/rootSagas";

import AtomicProvider from "./AtomicProvider";

export const createTestStore = (preloadedState = {}) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(sagaMiddleware)
  );
  sagaMiddleware.run(rootSagas);
  return store;
};

export default function TestProvider({ children, preloadedState = {} }) {
  const testStore = createTestStore(preloadedState);

  return (
    <Provider store={testStore}>
      <AtomicProvider components={{}} modules={{}}>
        {children}
      </AtomicProvider>
    </Provider>
  );
}
