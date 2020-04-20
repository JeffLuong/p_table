import { applyMiddleware, compose, createStore, Store, StoreEnhancer } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer, { AppState } from './index';

function configureStore(preloadedState?: {}): Store<AppState> {
  const composedEnhancers = compose<StoreEnhancer>(applyMiddleware(thunkMiddleware));
  return createStore(rootReducer, preloadedState, composedEnhancers);
}

const store = configureStore();

export type AppDispatch = typeof store.dispatch;
export default store;