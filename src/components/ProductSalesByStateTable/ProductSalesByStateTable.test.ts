import { formatData } from './index';
import { List } from 'immutable';
import Order from '../../models/order';

describe('<ProductSalesByStateTable>', () => {
  it('formatData() properly with config', () => {
    const data = List([
      new Order({ category: 'Cups', subCategory: 'Mugs', sales: 230, state: 'New York' }),
      new Order({ category: 'Utensils', subCategory: 'Knives', sales: 129, state: 'New York' }),
      new Order({ category: 'Utensils', subCategory: 'Forks', sales: 415, state: 'New York' }),
      new Order({ category: 'Cups', subCategory: 'Tumblers', sales: 82, state: 'California' }),
      new Order({ category: 'Utensils', subCategory: 'Knives', sales: 888, state: 'California' }),
      new Order({ category: 'Utensils', subCategory: 'Spoons', sales: 479, state: 'New York' }),
      new Order({ category: 'Cups', subCategory: 'Mugs', sales: 757, state: 'California' })
    ]);
    const expectedCategories = [
      ['Cups', ['Mugs','Tumblers']],
      ['Utensils', ['Forks','Knives','Spoons']]
    ];
    const expectedMetrics = [
      ['California', [[757, 82, 839], [0, 888, 0, 888], [1727]]],
      ['New York', [[230, 0, 230], [415, 129, 479, 1023], [1253]]],
      ['Grand Total', [[987, 82, 1069], [415, 1017, 479, 1911], [2980]]]
    ];

    const { rowDims, colMetrics } = formatData(data, {
      rowDimension: 'category',
      rowSubDimension: 'subCategory',
      colDimension: 'state',
      colMetric: 'sales'
    });

    rowDims.toArray().forEach(([category, values], i) => {
      expect(category).toBe(expectedCategories[i][0]);
      values.toArray().forEach((val, j) => {
        expect(val).toBe(expectedCategories[i][1][j]);
      })
    });

    colMetrics.toArray().forEach(([state, metricsGroup], h) => {
      expect(state).toBe(expectedMetrics[h][0]);
      metricsGroup.forEach((g, i) => {
        g.forEach((n, j) => {
          expect(n).toBe(expectedMetrics[h][1][i][j]);
        })
      });
    });
  });
});