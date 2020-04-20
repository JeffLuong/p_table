import { combineReducers } from 'redux';
import orders from './orders';
import RemoteValue from '../../lib/RemoteValue';
import Order from '../../models/order';

export interface AppState {
  orders: RemoteValue<Order>;
}

const reducers = combineReducers({
  orders
});

export default reducers;