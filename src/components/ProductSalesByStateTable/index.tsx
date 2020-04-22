import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../redux/reducers';
import { fetchOrders } from '../../redux/actions/orders';
import { Orders } from '../../redux/reducers/orders';
import Order, { OrderProps, QunatifiableProps, BaseOrderStringProps } from '../../models/order';
import { OrderedMap, Set } from 'immutable';
import PivotTable from '../PivotTable';
import Loader from '../Loader';

const { useEffect, useState } = React;

type DataConfig = {
  rowKey: keyof BaseOrderStringProps;
  rowSubKey: keyof BaseOrderStringProps;
  colKey: keyof OrderProps;
  colMetric: keyof QunatifiableProps;
};

export type RowKeyValues = OrderedMap<string, Set<string>>;
export type ColumnMetrics = OrderedMap<string | number, number[][]>;

export type FormattedData = {
  rowKeyValues: RowKeyValues;
  colMetrics: ColumnMetrics;
}

const camelToSentenceCase = (str: string): string => {
  return str
    // Regex taken from https://gist.github.com/nblackburn/875e6ff75bc8ce171c758bf75f304707
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1 $2')
    .split(' ')
    .map(s => s.toUpperCase())
    .join(' ');
};

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

export const formatData = (data: Orders, config: DataConfig): FormattedData => {
  const { rowKey, rowSubKey, colKey, colMetric } = config;
  const rowKeyValues = data
    .groupBy(o => o.get(rowKey))
    .sortBy((v, k) => k) // Group data by category
    .mapEntries(([key, orders]) => [
      key,
      orders.map(o => o.get(rowSubKey)).toSet().sort() // return all unique sub categories using `.toSet()`
    ]).toOrderedMap();

  // Sorted + grouped by state and sorted + grouped by category
  const sortedGroupedByKeys = data
    .groupBy(o => o.get(colKey)).sortBy((v, k) => k)
    .map(state => state.groupBy(o => o.get(rowKey)).sortBy((val, k) => k));

  // Sales by sub category for each state. See line 62 for example of the data shape
  const _rowKeyValues = rowKeyValues.map(a => a.toArray()).toArray();
  // Positional mapping of grand totals by sub category - to be inserted as the last column of metrics.
  const grandTotals = createColumnMap(_rowKeyValues);
  let grandTotal = 0;

  // The positional mapping of states vs total sales per category, sub category and grand totals.
  const colMetrics = sortedGroupedByKeys
    .map(state => {
      const initialAccumulator = createColumnMap(_rowKeyValues);
      let stateGrandTotal = 0;

      const reducedTotals = state.reduce((accTotals, orders) => {
        // Get current category: i.e. 'Furniture'
        const order: Order = orders.first();
        const currKey = order && order.get(rowKey);
        // Get the current `OrderedSet` associated with category: i.e OrderedSet(['Bookcases', 'Chairs', 'Furnishings', ...])
        const curr = _rowKeyValues.find(arr => arr.includes(currKey));
        const currSet = curr && curr[1];
        const currSetIdx = curr && _rowKeyValues.indexOf(curr);
        // The initial array to use in reducing totals by sub categories selected from total state accumulated map
        const initialTotals: number[] = (((currSetIdx !== undefined) && initialAccumulator[currSetIdx]) || []);

        orders.groupBy(o => o.get(rowSubKey)).sortBy((val, k) => k).reduce((totals: number[], orders, subKey) => {
          // Get the index of current sub category in the current `OrderedSet`: i.e. index of 'Bookcases'
          const subKeyIndex = currSet && currSet.indexOf(subKey);
          const total = Math.round(orders.reduce((sub, order) => sub += (order.get(colMetric) || 0), 0));
          if (subKeyIndex !== undefined) {
            // Replace the total in the correct index
            totals[subKeyIndex] = total;
          }
          // Increment the category's sub total (i.e. all Furniture category total for a state)
          totals[totals.length - 1] += total;
          if (currSetIdx !== undefined && subKeyIndex !== undefined) {
            grandTotals[currSetIdx][subKeyIndex] += total;
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
    rowKeyValues,
    colMetrics
  };
};

const ProductSalesByStateTable = (): JSX.Element => {
  const dispatch = useDispatch();
  const [formattedData, setFormattedData] = useState<FormattedData>();
  const ordersRemoteVal = useSelector((state: AppState) => state.orders);
  const { value } = ordersRemoteVal;
  // Data config for table: feel free to change these dimensions and metric with these rules:
  // 1. Operation is always going to be 'sum'.
  // 2. Dimensions should be configurable via any string data attribute.
  // 3. Metric should be configurable via any of these number data attributes:
  //   a. 'sales'
  //   b. 'quantity'
  //   c. 'profit'
  //   d. 'discount'
  const rowKey = 'category';
  const rowSubKey = 'subCategory';
  const colKey = 'state';
  const colMetric = 'sales';

  useEffect(() => {
    if (!value) {
      dispatch(fetchOrders());
    } else {
      setFormattedData(formatData(value, {
        rowKey,
        rowSubKey,
        colKey,
        colMetric
      }));
    }
  }, [dispatch, value]);

  if (formattedData && ordersRemoteVal.loaded()) {
    const config = {
      rowTitle: 'Products',
      colTitle: camelToSentenceCase(colKey),
      rowKeyTitle: camelToSentenceCase(rowKey),
      rowSubKeyTitle: camelToSentenceCase(rowSubKey),
      subResultText: 'Total',
      finalResultText: 'Grand Total',
      highlightLastColumn: true,
      tableMetric: colMetric
    };
    return <PivotTable tableConfig={config} data={formattedData} />;
  }

  return <Loader />;
};

export default ProductSalesByStateTable;