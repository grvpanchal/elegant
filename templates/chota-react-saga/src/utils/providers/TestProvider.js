/* eslint-disable react/prop-types */
import React from "react";
import store from "../../state";
import { Provider } from "react-redux";

import AtomicProvider from "./AtomicProvider";

export default function TestProvider({ children }) {
  return (
    <Provider store={store}>
      <AtomicProvider components={{}} modules={{}}>
        {children}
      </AtomicProvider>
    </Provider>
  );
}
