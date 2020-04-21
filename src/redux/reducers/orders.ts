import { List } from 'immutable';
import Order from '../../models/order';
import { REQUEST_ORDERS_REQUEST, REQUEST_ORDERS_SUCCESS, REQUEST_ORDERS_FAILURE } from '../actions/orders';
import type { Action } from '../actions/orders';
import RemoteValue from '../../lib/RemoteValue';

export type Orders = List<Order>;

type State = RemoteValue<Order>;

const extractError = (action: Action): string => {
  const { payload } = action;
  const _error = payload && payload.error;
  return (_error && _error.message) || 'Something went wrong! Please try again later.';
};

export default function(
  state: State = new RemoteValue(),
  action: Action
): State {
  switch(action.type) {
    case REQUEST_ORDERS_REQUEST:
      return state.merge({
        isFetching: true,
        didInvalidate: false,
        error: ''
      });
    case REQUEST_ORDERS_SUCCESS:
      return state.merge({
        isFetching: false,
        didEverLoad: true,
        value: List((action.payload && action.payload.orders) || []).map(Order.fromService),
        error: ''
      });
    case REQUEST_ORDERS_FAILURE:
      return state.merge({
        isFetching: false,
        error: extractError(action)
      });
    default:
      return state;
  }
}