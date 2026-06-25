/* eslint-disable react/prop-types */
import React from "react";
import useStore, { createAppStore } from "../../state";

import AtomicProvider from "./AtomicProvider";

/*
Zustand needs no React Provider — the store is a module singleton. `createTestStore`
returns a fresh, isolated store (handy for asserting state in unit tests), while
`TestProvider` seeds the app-wide singleton with `preloadedState` and wraps children
in the theme context, keeping the same testing ergonomics as the Redux templates.
*/
export const createTestStore = (preloadedState = {}) =>
  createAppStore(preloadedState);

export const applyPreloadedState = (preloadedState = {}) => {
  if (preloadedState.todo) {
    useStore.setState((state) => ({
      todo: { ...state.todo, ...preloadedState.todo },
    }));
  }
  if (preloadedState.filters) {
    useStore.setState({ filters: preloadedState.filters });
  }
  if (preloadedState.config) {
    useStore.setState((state) => ({
      config: { ...state.config, ...preloadedState.config },
    }));
  }
};

export default function TestProvider({ children, preloadedState = {} }) {
  applyPreloadedState(preloadedState);

  return (
    <AtomicProvider components={{}} modules={{}}>
      {children}
    </AtomicProvider>
  );
}
