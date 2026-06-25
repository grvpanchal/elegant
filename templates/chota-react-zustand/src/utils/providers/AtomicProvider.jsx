import React, { createContext, useContext } from "react";
import useStore from "../../state";

const atomicContext = createContext(null);

/*
Play with the theme provider here.
This component can be custom based on requirements on Atomic Design and Framework
*/

const AtomicProvider = ({ children, components, modules }) => {
  const theme = useStore((state) => state.config.theme);
  return (
    <atomicContext.Provider value={{ components, modules, children, theme }}>
      {children}
    </atomicContext.Provider>
  );
};

export const useAtomicContext = () => {
  try {
    const ctx = useContext(atomicContext);
    if(!ctx) {
      throw new Error('no atomic context found');
    }
    return ctx;
  } catch(e) {
    console.error(e);
    return { theme: '' , components: {}, modules: {}};
  }
};

export default AtomicProvider;
