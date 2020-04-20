import * as React from 'react';
import cx from 'classnames';
import type { FormattedData } from './ProductSalesByStateTable';
import './PivotTable.scss';

type TableDefaultProps = {
  children: React.ReactNode;
};

type PivotTableProps = {
  data: FormattedData;
  rowTitle: string;
  colTitle: string;
};

interface TableColDimsWrapperProps extends TableDefaultProps {
  scrollable?: boolean;
}

interface CellProps extends TableDefaultProps {
  className?: string;
  isCellGroup?: boolean;
  noPadding?: boolean;
}

const Cell = ({ className, isCellGroup, children, noPadding, ...rest }: CellProps): JSX.Element => {
  const classes = cx(
    'Cell',
    noPadding ? 'noPadding' : '',
    isCellGroup ? 'CellGroup' : '',
    className
  );

  return (
    <div className={classes} {...rest}>{children}</div>
  );
};

const TableRowDimension = ({ children }: TableDefaultProps): JSX.Element => {
  return <div className="TableRowDimension">{children}</div>;
};

const TableHeader = ({ children }: TableDefaultProps): JSX.Element => {
  return (
    <div className="TableHeader">{children}</div>
  );
};

const TableTitle = ({ children }: TableDefaultProps): JSX.Element => {
  return <Cell><h3 className="TableTitle">{children}</h3></Cell>;
};

const TableColumnTitle = ({ children }: TableDefaultProps): JSX.Element => {
  return <Cell><span className="TableColumnTitle">{children}</span></Cell>;
};

const TableRowDimensionGroup = ({ children }: TableDefaultProps): JSX.Element => {
  return (
    <div className="TableRowDimensionGroup">{children}</div>
  );
};

const TableSubResult = ({ children }: TableDefaultProps): JSX.Element => {
  return <Cell className="TableSubResult"><span>{children}</span></Cell>;
};
const TableRowDimFinalResult = ({ children }: TableDefaultProps): JSX.Element => {
  return <Cell className="TableRowDimFinalResult">{children}</Cell>;
};

const TableColumnDimension = ({ children, scrollable }: TableColDimsWrapperProps): JSX.Element => {
  return <div className={`TableColumnDimension ${scrollable ? 'isScrollable' : ''}`}>{children}</div>;
};

const TableMetrics = ({ children }: TableDefaultProps): JSX.Element => {
  return <Cell isCellGroup noPadding className="TableMetrics">{children}</Cell>;
};

const PivotTable = ({ data, rowTitle, colTitle }: PivotTableProps): JSX.Element => {
  const { rowDims, colMetrics } = data;
  return (
    <div className="TableContainer">
      <TableRowDimension>
        <TableHeader>
          <TableTitle>{rowTitle.toLocaleUpperCase()}</TableTitle>
        </TableHeader>
        <TableRowDimensionGroup>
          <Cell className="TableColumnTitleGroup" isCellGroup noPadding>
            <TableColumnTitle>Category</TableColumnTitle>
            <TableColumnTitle>Sub-Category</TableColumnTitle>
          </Cell>
          {rowDims.toArray().map(([title, subDims]) => {
            return (
              <React.Fragment key={title}>
                <Cell isCellGroup>
                  <Cell>
                    <span>{title}</span>
                  </Cell>
                  <Cell noPadding>
                    {subDims.map(d => <Cell key={d}><span>{d}</span></Cell>)}
                  </Cell>
                </Cell>
                <TableSubResult>{`${title} total`}</TableSubResult>
              </React.Fragment>
            )
          })}
          <TableRowDimFinalResult><span>Grand total</span></TableRowDimFinalResult>
        </TableRowDimensionGroup>
      </TableRowDimension>
      <TableColumnDimension scrollable>
        <TableHeader>
          <TableTitle>{colTitle.toLocaleUpperCase()}</TableTitle>
        </TableHeader>
        <TableMetrics>
          {colMetrics.toArray().map(([key, v]) => {
            // state
            const finalResultIdx = v.length - 1;
            return (
              <div key={key}>
                <TableColumnTitle>
                  {key}
                </TableColumnTitle>
                {v.map((_v, idx) => {
                  // category
                  return _v.map((n, i) => {
                    let className = i === _v.length - 1 ? 'TableSubResult' : '';
                    if (finalResultIdx === idx) {
                      className = 'TableRowDimFinalResult';
                    }
                    return (
                      <React.Fragment key={`${key}-${n.toString()}-${i}`}>
                        <Cell className={className}>
                          <span>{n}</span>
                        </Cell>
                      </React.Fragment>
                    );
                  })
                })}
              </div>
            )}
          )}
        </TableMetrics>
        {/* <TableMetricsGrandTotal>
          {grandTotals.map(total => {
            return (
              <div>
                <span>{total}</span>
              </div>
            )
          })}
        </TableMetricsGrandTotal> */}
      </TableColumnDimension>
    </div>
  );
};

export default PivotTable;