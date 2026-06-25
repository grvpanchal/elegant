
import HomePage from "./pages";
import ConfigContainer from "./containers/ConfigContainer";
import AtomicProvider from "./utils/providers/AtomicProvider";

import "chota/dist/chota.css"
import "./ui/theme.css";

const App = () => <HomePage />;

const RootApp = () => {
  return (
    <AtomicProvider components={{}} modules={{}}>
      <ConfigContainer />
      <App />
    </AtomicProvider>
  );
};

export default RootApp;
