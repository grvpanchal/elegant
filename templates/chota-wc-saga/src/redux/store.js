import { createStore } from 'redux';
import { reducer } from './reducer.js';

export const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export const useDispatch = () => {
  return store.dispatch;
}