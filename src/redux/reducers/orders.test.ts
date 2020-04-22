import { REQUEST_ORDERS_REQUEST, REQUEST_ORDERS_SUCCESS, REQUEST_ORDERS_FAILURE } from '../actions/orders';
import ordersReducer, { defaultErrorMsg, extractError } from './orders';
import RemoteValue from '../../lib/RemoteValue';
import Order from '../../models/order';

describe('reducers/orders', () => {
  describe('extractError', () => {
    it('with proper Error', () => {
      const error = extractError({
        type: REQUEST_ORDERS_REQUEST,
        payload: {
          error: new Error('Whoops!')
        }
      });
      expect(error).toBe('Whoops!');
    });

    it('without proper Error', () => {
      const error = extractError({
        type: REQUEST_ORDERS_REQUEST,
        payload: {
          error: undefined
        }
      });
      expect(error).toBe(defaultErrorMsg);
    });
  });

  it('REQUEST_ORDERS_REQUEST - returns expected state', () => {
    const state = ordersReducer(
      new RemoteValue(),
      { type: REQUEST_ORDERS_REQUEST }
    );
    const { value, isFetching, didEverLoad, didInvalidate, error } = state;
    expect(value).toBe(undefined);
    expect(isFetching).toBe(true);
    expect(didEverLoad).toBe(false);
    expect(didInvalidate).toBe(false);
    expect(error).toBe('');
  });

  it('REQUEST_ORDERS_SUCCESS - returns expected state', () => {
    const orders = [{
      rowId: 2368,
      orderId: 'CA-2017-123659',
      orderDate: '2/10/17',
      shipDate: '2/13/17',
      shipMode: 'First Class',
      customerId: 'MN-17935',
      customerName: 'Michael Nguyen',
      segment: 'Consumer',
      country: 'United States',
      city: 'Clinton',
      state: 'Maryland',
      postalCode: 20735,
      region: 'East',
      productId: 'OFF-PA-10002464',
      category: 'Office Supplies',
      subCategory: 'Paper',
      productName: 'HP Office Recycled Paper (20Lb. and 87 Bright)',
      sales: 23.12,
      quantity: 4,
      discount: 0,
      profit: 11.3288
    },
    {
      rowId: 2369,
      orderId: 'US-2016-129469',
      orderDate: '9/23/16',
      shipDate: '9/27/16',
      shipMode: 'Standard Class',
      customerId: 'KL-16555',
      customerName: 'Kelly Lampkin',
      segment: 'Corporate',
      country: 'United States',
      city: 'Fairfield',
      state: 'Ohio',
      postalCode: 45014,
      region: 'East',
      productId: 'FUR-FU-10002298',
      category: 'Furniture',
      subCategory: 'Furnishings',
      productName: 'Rubbermaid ClusterMat Chairmats, Mat Size- 66\' x 60\', Lip 20\' x 11\' -90 Degree Angle',
      sales: 532.704,
      quantity: 6,
      discount: 0.2,
      profit: -26.6352
    }];
    const state = ordersReducer(
      new RemoteValue(),
      {
        type: REQUEST_ORDERS_SUCCESS,
        payload: {
          orders
        }
      }
    );
    const { value, isFetching, didEverLoad, didInvalidate, error } = state;
    expect(isFetching).toBe(false);
    expect(didEverLoad).toBe(true);
    expect(didInvalidate).toBe(false);
    expect(error).toBe('');
    value.forEach((o: Order, i: number) => {
      o.toSeq().forEach((value, key) => {
        expect(value).toBe(orders[i][key]);
      });
    });
  });

  it('REQUEST_ORDERS_FAILURE - returns expected state', () => {
    const state = ordersReducer(
      new RemoteValue(),
      { type: REQUEST_ORDERS_FAILURE, payload: { error: new Error('Borked!') } }
    );
    const { value, isFetching, didEverLoad, didInvalidate, error } = state;
    expect(value).toBe(undefined);
    expect(isFetching).toBe(false);
    expect(didEverLoad).toBe(false);
    expect(didInvalidate).toBe(false);
    expect(error).toBe('Borked!');
  });
});