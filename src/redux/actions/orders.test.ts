import expect from 'expect.js';
import {
  REQUEST_ORDERS_REQUEST,
  REQUEST_ORDERS_SUCCESS,
  REQUEST_ORDERS_FAILURE,
  onRequestOrders,
  onOrdersReqSuccess,
  onOrdersReqFailure
} from './orders';

const mockOrders = [{
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

describe('actions/orders', () => {
  it('onRequestOrders', () => {
    const { type, payload } = onRequestOrders();
    expect(type).to.be(REQUEST_ORDERS_REQUEST);
    expect(payload).to.be(undefined);
  });

  it('onOrdersReqSuccess', () => {
    const { type, payload } = onOrdersReqSuccess(mockOrders);
    const orders = payload && payload.orders;
    expect(type).to.be(REQUEST_ORDERS_SUCCESS);
    expect(orders).to.be(mockOrders);
  });

  it('onOrdersReqSuccess', () => {
    const { type, payload } = onOrdersReqFailure(new Error('Failed'));
    const error = payload && payload.error;
    expect(type).to.be(REQUEST_ORDERS_FAILURE);
    expect(error && error.message).to.be('Failed');
  });
});