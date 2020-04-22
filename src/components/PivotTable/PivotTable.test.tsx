import * as React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { TableRowKeyValues, TableColumnMetrics, prettifyNumber } from './index';

const rowSubResultText = 'Total';
const rows: [string, string[]][] = [
  ['Homes', ['Condo', 'Townhouse', 'Semi-detached', 'Detached', 'Trailer']],
  ['Jobs', ['Engineer', 'Designer', 'Product Manager', 'Marketer', 'Customer Success', 'People Operations']],
  ['Vehicles', ['Sedan', 'Minivan', 'Pickup Truck', 'Sport']],
];

const columns: [string | number, number[][]][] = [
  ['Condo', [
      [13425, 621352, 634123, 42135, 21516],
      [9175123, 391723, 283615566, 21757],
      [973621, 259673, 4589193, 12369, 86886, 8572812]
    ]
  ],
  ['Engineer', [
      [213, 9, 82, 98, 762],
      [45, 866, 65, 11, 20]
    ]
  ],
  ['Sedan', [
      [7527, 571533, 12786, 974, 984216, 4824],
      [85785, 87542, 7576, 6547],
      [6784, 87553, 79725, 31352, 3426, 76425],
      [461266, 8475, 1235, 5573]
    ]
  ]
];

describe('<PivotTable>', () => {
  describe('renders <TableRowKeyValues>', () => {
    it('with correct snapshot', () => {
      const componentTree = renderer.create(
        <TableRowKeyValues rows={rows} rowSubResultText={rowSubResultText} />
      ).toJSON();
      expect(componentTree).toMatchSnapshot();
    });

    it('with correct values', () => {
      const wrapper = shallow(<TableRowKeyValues rows={rows} rowSubResultText={rowSubResultText} />);
      const values = wrapper.find('span');
      let valIdx = 0;

      rows.forEach(([cat, subCats]) => {
        const catVal = values.get(valIdx);
        expect(catVal && catVal.props.children).toBe(cat);
        valIdx += 1;

        subCats.forEach(s => {
          const val = values.get(valIdx);
          expect(val && val.props.children).toBe(s);
          valIdx += 1;
        });
      });

      wrapper.find('TableRowSubResult').forEach((w, i) => {
        const resultText = w.dive().find('span').text();
        expect(resultText).toBe(`${rows[i][0]} ${rowSubResultText}`);
      });
    });
  });

  describe('renders <TableColumnMetrics>', () => {
    it('with correct snapshot', () => {
      const componentTree = renderer.create(
        <TableColumnMetrics columns={columns} />
      ).toJSON();
      expect(componentTree).toMatchSnapshot();
    });

    it('with correct values', () => {
      const wrapper = shallow(<TableColumnMetrics columns={columns} />); 
      const values = wrapper.find('span');
      let valIdx = 0;

      columns.forEach(([title, cols], i) => {
        expect(wrapper.find('TableColumnTitle').get(i).props.children).toBe(title);

        cols.forEach(metrics => {
          metrics.forEach(n => {
            const val = values.get(valIdx);
            expect(val && val.props.children).toBe(prettifyNumber(n));
            valIdx += 1;
          });
        });
      });
    });
  });
});
