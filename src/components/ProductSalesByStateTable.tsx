import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../redux/reducers';
import { fetchOrders } from '../redux/actions/orders';
import { Orders } from '../redux/reducers/orders';
import Order, { OrderProps, BaseOrderNumProps, BaseOrderStringProps } from '../models/order';
import { Set, Seq } from 'immutable';
import PivotTable from './PivotTable';

const { useEffect, useState } = React;

// const categories = [
//   ['Furniture', ['Bookcases', 'Chairs', 'Furnishings', 'Tables']],
//   ['Furniture', ['Bookcases', 'Chairs', 'Furnishings', 'Tables']],
//   ['Furniture', ['Bookcases', 'Chairs', 'Furnishings', 'Tables']]
// ];

type DataConfig = {
  rowDimension: keyof BaseOrderStringProps;
  rowSubDimension: keyof BaseOrderStringProps;
  colDimension: keyof OrderProps;
  colMetric: keyof BaseOrderNumProps;
};

export type FormattedData = {
  rowDims: Seq.Keyed<string | number, Set<string | number>>;
  colMetrics: Seq.Keyed<string | number, number[][]>;
}

const formatData = (data: Orders, config: DataConfig): FormattedData => {
  const { rowDimension, rowSubDimension, colDimension, colMetric } = config;
  const rowDims = data
    .groupBy(o => o.get(rowDimension))
    .sortBy((v, k) => k) // Group data by category
    .mapEntries(([dim, orders]) => [
      dim,
      orders.map(o => o.get(rowSubDimension)).toSet().sort() // return all unique sub categories using `.toSet()`
    ]);

  // Sorted + grouped by state and sorted + grouped by category
  const sortedGroupedByDim = data
    .groupBy(o => o.get(colDimension)).sortBy((v, k) => k)
    .map(state => state.groupBy(o => o.get(rowDimension)).sortBy((val, k) => k));
  // Sales by sub category for each state. See line 62 for example of the data shape
  const _rowDims = rowDims.map(a => a.toArray()).toArray();

  const colMetrics = sortedGroupedByDim
    .map(state => {
      const initialAccumulator: Array<number[]> = [];
      let grandTotal = 0;

      // Create a positional map of how many expected values per state per sub category.
      // For example, for one state, the expected positional map is:
      // [
      //   ['Furniture', ['Bookshelves', 'Chaires', ...etc]],  <--- 4 sub categories
      //   ['Office Supplies', ['Appliances', 'Art', ...etc]], <--- 9 sub categories
      //   ['Technology', ['Accessories', 'Copiers', ...etc]]  <--- 4 sub categories
      // ]
      for (let x = 0; x < _rowDims.length; x++) {
        // For each sub category, push in the required positions, including an entry for totals for each category.
        const sub: number[]  = [0];
        _rowDims[x][1].forEach(() => sub.push(0));
        initialAccumulator.push(sub);
        // Adding another array entry to hold grand total for all state
        if (x === _rowDims.length - 1) {
          initialAccumulator.push([0]);
        }
      }

      const reducedTotals = state.reduce((accTotals, orders) => {
        // Get current category: i.e. 'Furniture'
        const order: Order = orders.first();
        const currDim = order && order.get(rowDimension);
        // Get the current `OrderedSet` associated with category: i.e OrderedSet(['Bookcases', 'Chairs', 'Furnishings', ...])
        const curr = _rowDims.find(arr => arr.includes(currDim));
        const currSet = curr && curr[1];
        // The initial array to use in reducing totals by sub categories selected from total state accumulated map
        const initialTotals: number[] = (curr && initialAccumulator[_rowDims.indexOf(curr)] || []);

        orders.groupBy(o => o.get(rowSubDimension)).sortBy((val, k) => k).reduce((totals: number[], orders, subDim) => {
          // Get the index of current sub category in the current `OrderedSet`: i.e. index of 'Bookcases'
          const subDimIndex = currSet && currSet.indexOf(subDim);
          const total = Math.round(orders.reduce((sub, order) => sub += (order.get(colMetric) || 0), 0));
          if (subDimIndex !== undefined) {
            // Replace the total in the correct index
            totals[subDimIndex] = total;
          }
          // Increment the category's sub total (i.e. all Furniture category total for a state)
          totals[totals.length - 1] += total;
          // Increment the state's grand total
          grandTotal += total;
          return totals;
        }, initialTotals);
        return accTotals;
      }, initialAccumulator);

      reducedTotals[reducedTotals.length - 1] = [grandTotal];
      return reducedTotals;
    });
  return {
    rowDims, // categories
    colMetrics // sales by state for each sub category
  };
};

const ProductSalesByStateTable = (): JSX.Element => {
  const dispatch = useDispatch();
  const [formattedData, setFormattedData] = useState<FormattedData>();
  const orders = useSelector((state: AppState) => state.orders);
  const { value } = orders;

  useEffect(() => {
    if (!value) {
      dispatch(fetchOrders());
    } else {
      setFormattedData(formatData(value, {
        rowDimension: 'category',
        rowSubDimension: 'subCategory',
        colDimension: 'state',
        colMetric: 'sales'
      }));
    }
  }, [dispatch, value]);

  if (formattedData) {
    return <PivotTable rowTitle="Products" colTitle="States" data={formattedData} />;
  }

  return <h1>LOADING...</h1>
};

export default ProductSalesByStateTable;