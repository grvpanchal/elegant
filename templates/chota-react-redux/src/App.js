
import { Provider } from "react-redux";
import HomePage from "./pages";
import store from "./state";
import ConfigContainer from "./containers/ConfigContainer";
import AtomicProvider from "./utils/providers/AtomicProvider";

import "chota/dist/chota.css"
import "./ui/theme.css";

const App = () => <HomePage />;

const RootApp = () => {
  return (
    <Provider store={store}>
      <AtomicProvider components={{}} modules={{}}>
        <ConfigContainer />
        <App />
      </AtomicProvider>
    </Provider>
  );
};

export default RootApp;
