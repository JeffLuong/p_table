import expect from 'expect.js';
import Order from './order';

describe('models/order', () => {
  it('Order.fromService() - assigns default values if some dont exist', () => {
    const props = {
      rowId: 12345,
      orderId: '09420481432',
      postalCode: 10423,
      sales: 123.25,
      quantity: 2,
      discount: 0,
      profit: 22
    };
    const order = Order.fromService(props);

    expect(order.toJS()).to.eql({
      orderDate: '',
      shipDate: '',
      shipMode: '',
      customerId: '',
      customerName: '',
      segment: '',
      country: '',
      city: '',
      state: '',
      region: '',
      productId: '',
      category: '',
      subCategory: '',
      productName: '',
      ...props,
    })
  });
});