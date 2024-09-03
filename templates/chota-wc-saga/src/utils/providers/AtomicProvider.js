import { createContext, useContext } from "haunted";
import {    } from "react-redux";

const atomicContext = createContext(null);

/* 
Play with the theme provider here. 
This component can be custom based on requirements on Atomic Design and Framework
*/

const AtomicProvider = ({ children, components, modules }) => {
  const theme = useSelector((state) => state.config.theme);
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
      throw new Error('no redux context found');
    }
    return ctx;
  } catch(e) {
    console.error(e);
    return { theme: '' , components: {}, modules: {}};
  }
};

export default AtomicProvider;
