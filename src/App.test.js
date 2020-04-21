import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import RemoteValue from './lib/RemoteValue';
import { List } from 'immutable';
import Order from './models/order';

const mockStore = configureStore();

it('renders without crashing', () => {
  const div = document.createElement('div');
  const store = mockStore({
    orders: new RemoteValue({
      isFetching: false,
      didEverLoad: true,
      didInvalidate: false,
      error: '',
      value: List([new Order()])
    })
  });
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    div
  );
});
