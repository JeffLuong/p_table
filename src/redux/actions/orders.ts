import orders from '../../data/orders.json';
import { OrderProps } from '../../models/order';
import type { AppDispatch } from '../reducers/configureStore';

export enum OrderActions {
  REQUEST_ORDERS_REQUEST = 'REQUEST_ORDERS_REQUEST',
  REQUEST_ORDERS_SUCCESS = 'REQUEST_ORDERS_SUCCESS',
  REQUEST_ORDERS_FAILURE = 'REQUEST_ORDERS_FAILURE'
}

export const REQUEST_ORDERS_REQUEST = OrderActions.REQUEST_ORDERS_REQUEST;
export const REQUEST_ORDERS_SUCCESS = OrderActions.REQUEST_ORDERS_SUCCESS;
export const REQUEST_ORDERS_FAILURE = OrderActions.REQUEST_ORDERS_FAILURE;

export type Action = {
  type: OrderActions.REQUEST_ORDERS_REQUEST | OrderActions.REQUEST_ORDERS_SUCCESS | OrderActions.REQUEST_ORDERS_FAILURE;
  payload?: {
    orders?: OrderProps[];
    error?: Error;
  };
};

// Mock request
const makeRequest = (): Promise<OrderProps[]> => {
  return new Promise(res => setTimeout(() => res(orders), 1500));
};

const requestOrders = (): Action => {
  return {
    type: REQUEST_ORDERS_REQUEST
  };
};

const onOrdersReqSuccess = (orders: OrderProps[]): Action => {
  return {
    type: REQUEST_ORDERS_SUCCESS,
    payload: {
      orders
    }
  };
};

const onOrdersReqFailure = (error: Error): Action => {
  return {
    type: REQUEST_ORDERS_FAILURE,
    payload: {
      orders: [],
      error
    }
  }
}

export const fetchOrders = () => {
  return (dispatch: AppDispatch): Promise<Action> => {
    dispatch(requestOrders());

    return makeRequest()
      .then(data => dispatch(onOrdersReqSuccess(data)))
      .catch(err => dispatch(onOrdersReqFailure(err)));
  }
};