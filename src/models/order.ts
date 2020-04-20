import { Record } from 'immutable';

export interface QunatifiableProps {
  sales: number;
  quantity: number;
  profit: number;
}

export interface BaseOrderNumProps extends QunatifiableProps {
  rowId: number;
  postalCode: number;
  discount: number;
}

export interface BaseOrderStringProps {
  orderId: string;
  orderDate: string;
  shipDate: string;
  shipMode: string;
  customerId: string;
  customerName: string;
  segment: string;
  country: string;
  city: string;
  state: string;
  region: string;
  productId: string;
  category: string;
  subCategory: string;
  productName: string;
}

export interface OrderProps extends BaseOrderNumProps, BaseOrderStringProps {}

const defaultOrderProps: OrderProps = {
  rowId: 0,
  orderId: '',
  orderDate: '',
  shipDate: '',
  shipMode: '',
  customerId: '',
  customerName: '',
  segment: '',
  country: '',
  city: '',
  state: '',
  postalCode: 0,
  region: '',
  productId: '',
  category: '',
  subCategory: '',
  productName: '',
  sales: 0,
  quantity: 0,
  discount: 0,
  profit: 0
};

class Order extends Record(defaultOrderProps) implements OrderProps {
  public constructor(props?: Partial<OrderProps>) {
    super(props || defaultOrderProps);
  }

  static fromService(obj?: Partial<OrderProps>): Order {
    if (obj) {
      return new Order(obj);
    }
    return new Order(defaultOrderProps);
  }
}

export default Order;