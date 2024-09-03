import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from "redux-saga";

import reducer from "./rootReducer";
import sagas from "./rootSagas";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();
// mount it on the Store
const devTools =  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
const enhancer = compose(applyMiddleware(sagaMiddleware), devTools);

const store = createStore(reducer, undefined, enhancer);

// then run the saga
sagaMiddleware.run(sagas);

export const useDispatch = () => {
    return store.dispatch;
}

export default store;
