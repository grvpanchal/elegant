import { create } from "zustand";
import { devtools } from "zustand/middleware";

import createRootSlice from "./rootStore";

/*
Factory that builds a fresh store. `preloadedState` can shallow-override any
namespace (`todo`, `filters`, `config`) — handy for tests and SSR hydration —
without clobbering the action functions the slices define.
*/
export const createAppStore = (preloadedState = {}) =>
  create(
    devtools(
      (set, get, api) => {
        const base = createRootSlice(set, get, api);
        return {
          ...base,
          todo: { ...base.todo, ...(preloadedState.todo || {}) },
          filters: preloadedState.filters || base.filters,
          config: { ...base.config, ...(preloadedState.config || {}) },
        };
      },
      { name: "elegant-zustand" }
    )
  );

// The app-wide singleton store. Components read it via the `useStore` hook.
const useStore = createAppStore();

export default useStore;
