import { composeWithDevTools } from './redux-devtools-extension'
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from "redux-saga";

import reducer from "./rootReducer";
import sagas from "./rootSagas";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();
// mount it on the Store
const enhancer = applyMiddleware(sagaMiddleware)
const enhancers = [enhancer];
const composedEnhancers = composeWithDevTools(...enhancers)

const store = createStore(reducer, composedEnhancers);

// then run the saga
sagaMiddleware.run(sagas);

export const useDispatch = () => {
    return store.dispatch;
}

export default store;
