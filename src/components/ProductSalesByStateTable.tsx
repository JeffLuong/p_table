import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../redux/reducers';
import { fetchOrders } from '../redux/actions/orders';
import { Orders } from '../redux/reducers/orders';
import Order, { OrderProps, QunatifiableProps, BaseOrderStringProps } from '../models/order';
import { OrderedMap, Set } from 'immutable';
import PivotTable from './PivotTable';

const { useEffect, useState } = React;

type DataConfig = {
  rowDimension: keyof BaseOrderStringProps;
  rowSubDimension: keyof BaseOrderStringProps;
  colDimension: keyof OrderProps;
  colMetric: keyof QunatifiableProps;
};

export type FormattedData = {
  rowDims: OrderedMap<string, Set<string>>;
  colMetrics: OrderedMap<string | number, number[][]>;
}

/**
 * Create a positional column map of how many expected values per state per sub category.
 * For example, for one state, the expected positional map is:
 * [['Furniture', ['Bookshelves', 'Chaires', ...etc]],   <--- 4 sub categories
 *  ['Office Supplies', ['Appliances', 'Art', ...etc]],  <--- 9 sub categories
 *  ['Technology', ['Accessories', 'Copiers', ...etc]]]  <--- 4 sub categories
 */
const createColumnMap = (nestedArr: [string, string[]][]): number[][] => {
  const columnMap: number[][] = [];
  for (let x = 0; x < nestedArr.length; x++) {
    // For each sub category, push in the required positions, including an entry for totals for each category.
    const sub: number[]  = [0];
    nestedArr[x][1].forEach(() => sub.push(0));
    columnMap.push(sub);
    // Adding another array entry to hold grand total for all state
    if (x === nestedArr.length - 1) {
      columnMap.push([0]);
    }
  }
  return columnMap;
};

const formatData = (data: Orders, config: DataConfig): FormattedData => {
  const { rowDimension, rowSubDimension, colDimension, colMetric } = config;
  const rowDims = data
    .groupBy(o => o.get(rowDimension))
    .sortBy((v, k) => k) // Group data by category
    .mapEntries(([dim, orders]) => [
      dim,
      orders.map(o => o.get(rowSubDimension)).toSet().sort() // return all unique sub categories using `.toSet()`
    ]).toOrderedMap();

  // Sorted + grouped by state and sorted + grouped by category
  const sortedGroupedByDim = data
    .groupBy(o => o.get(colDimension)).sortBy((v, k) => k)
    .map(state => state.groupBy(o => o.get(rowDimension)).sortBy((val, k) => k));

  // Sales by sub category for each state. See line 62 for example of the data shape
  const _rowDims = rowDims.map(a => a.toArray()).toArray();
  // Positional mapping of grand totals by sub category - to be inserted as the last column of metrics.
  const grandTotals = createColumnMap(_rowDims);
  let grandTotal = 0;

  // The positional mapping of states vs total sales per category, sub category and grand totals.
  const colMetrics = sortedGroupedByDim
    .map(state => {
      const initialAccumulator = createColumnMap(_rowDims);
      let stateGrandTotal = 0;

      const reducedTotals = state.reduce((accTotals, orders) => {
        // Get current category: i.e. 'Furniture'
        const order: Order = orders.first();
        const currDim = order && order.get(rowDimension);
        // Get the current `OrderedSet` associated with category: i.e OrderedSet(['Bookcases', 'Chairs', 'Furnishings', ...])
        const curr = _rowDims.find(arr => arr.includes(currDim));
        const currSet = curr && curr[1];
        const currSetIdx = curr && _rowDims.indexOf(curr);
        // The initial array to use in reducing totals by sub categories selected from total state accumulated map
        const initialTotals: number[] = (currSetIdx !== undefined && initialAccumulator[currSetIdx] || []);

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
          if (currSetIdx !== undefined && subDimIndex !== undefined) {
            grandTotals[currSetIdx][subDimIndex] += total;
            grandTotals[currSetIdx][totals.length - 1] += total;
          }
          // Increment the state's grand total
          stateGrandTotal += total;
          // Increment overall grand total
          grandTotal += total;
          return totals;
        }, initialTotals);

        return accTotals;
      }, initialAccumulator);

      reducedTotals[reducedTotals.length - 1] = [stateGrandTotal];
      grandTotals[grandTotals.length - 1] = [grandTotal];
      return reducedTotals;
    })
     // Typescript complains that `set()` isn't defined in `Seq.Keyed`
     // (even though it is) so using `toOrderedMap()` to satisfy it :(
    .toOrderedMap()
    .set('Grand Total', grandTotals);

  return {
    rowDims,
    colMetrics
  };
};

const ProductSalesByStateTable = (): JSX.Element => {
  const dispatch = useDispatch();
  const [formattedData, setFormattedData] = useState<FormattedData>();
  const ordersRemoteVal = useSelector((state: AppState) => state.orders);
  const { value } = ordersRemoteVal;

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
    const config = {
      rowTitle: 'Products',
      colTitle: 'States',
      rowDimTitle: 'Category',
      rowDimSubTitle: 'Sub Category',
      subResultText: 'Total',
      finalResultText: 'Grand Total'
    };
    return <PivotTable tableConfig={config} data={formattedData} />;
  }

  return <h1>LOADING...</h1>
};

export default ProductSalesByStateTable;