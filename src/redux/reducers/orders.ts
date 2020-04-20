import { List } from 'immutable';
import Order from '../../models/order';
import { REQUEST_ORDERS_REQUEST, REQUEST_ORDERS_SUCCESS, REQUEST_ORDERS_FAILURE } from '../actions/orders';
import type { Action } from '../actions/orders';
import RemoteValue from '../../lib/RemoteValue';

export type Orders = List<Order>;

type State = RemoteValue<Order>;

export default function(
  state: State = new RemoteValue(),
  action: Action
): State {
  if (action.type === REQUEST_ORDERS_REQUEST) {
    return state.merge({
      isFetching: true,
      didInvalidate: false,
      error: ''
    });
  } else if (action.type === REQUEST_ORDERS_SUCCESS) {
    const { payload } = action;
    return state.merge({
      isFetching: false,
      didInvalidate: false,
      value: payload ? List(payload.orders).map(Order.fromService) : List([]),
      error: ''
    });
  } else if (action.type === REQUEST_ORDERS_FAILURE) {
    const { payload } = action;
    const _error = payload && payload.error;
    const error = (_error && _error.message) || 'Something went wrong! Please try again later.';
    return state.merge({
      isFetching: false,
      didInvalidate: false,
      error
    });
  }
  return state;
}