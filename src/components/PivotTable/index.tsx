import * as React from 'react';
import cx from 'classnames';
import type { FormattedData, ColumnDimensionValues, RowDimensionValues } from '../ProductSalesByStateTable';
import './PivotTable.scss';

type PivotTableProps = {
  data: FormattedData;
  tableConfig: {
    rowTitle: string;
    colTitle: string;
    rowDimTitle: string;
    rowDimSubTitle: string;
    subResultText: string;
    finalResultText: string;
    highlightLastColumn?: boolean;
    tableMetric: string;
  };
};

type TDefProps = {
  children: React.ReactNode;
  className?: string;
};

interface TableColDimsWrapperProps extends TDefProps {
  scrollable?: boolean;
}

interface CellProps extends TDefProps {
  isCellGroup?: boolean;
  noPadding?: boolean;
}

/**
 * Adds commas `,` in the appropriate locations for a large number.
 * @param n number
 * @returns string
 */
export const prettifyNumber = (n: number): string => {
  const stringNums = n.toString().split('');
  return stringNums.map((s, i) => {
    if ((stringNums.length - i) % 3 === 0) {
      return (i === 0 || (i === 1 && stringNums.includes('-'))) ? s : `,${s}`;
    }
    return s;
  }).join('');
};

const Cell = ({ className, isCellGroup, children, noPadding, ...rest }: CellProps): JSX.Element => {
  const classes = cx(
    'Cell',
    isCellGroup ? 'CellGroup' : '',
    noPadding ? 'noPadding' : '',
    className
  );
  return <div className={classes} {...rest}>{children}</div>;
};

const Table = ({ children }: TDefProps): JSX.Element => <div className="Table">{children}</div>;

const TableName = ({ children }: TDefProps): JSX.Element => <div className="TableName"><h1>{children}</h1></div>;

const TableHeader = ({ children }: TDefProps): JSX.Element => <div className="TableHeader">{children}</div>;

const TableTitle = ({ children }: TDefProps): JSX.Element => <Cell><h3 className="TableTitle">{children}</h3></Cell>;

const TableColumnTitle = ({ children }: TDefProps): JSX.Element => <Cell><span className="TableColumnTitle">{children}</span></Cell>;

const TableBody = ({ children }: TDefProps): JSX.Element => <div className="TableBody">{children}</div>;

const TableRowDimensions = ({ children }: TDefProps): JSX.Element => <div className="TableRowDimensions">{children}</div>;

const TableRowSubResult = ({ children, className }: TDefProps): JSX.Element => {
  return <Cell className={cx('TableRowSubResult', className)}><span>{children}</span></Cell>;
};

const TableRowFinalResult = ({ children, className }: TDefProps): JSX.Element => {
  return <Cell className={cx('TableRowFinalResult', className)}><span>{children}</span></Cell>;
};

const TableColumnDimensions = ({ children, scrollable }: TableColDimsWrapperProps): JSX.Element => {
  return <div className={`TableColumnDimensions ${scrollable ? 'isScrollable' : ''}`}>{children}</div>;
};

const TableColumn = ({ children }: TDefProps): JSX.Element => <div className="TableColumn">{children}</div>;

export const TableRowDimensionValues = ({
  rows,
  rowSubResultText
}: {
  rows: RowDimensionValues;
  rowSubResultText: string;
}): JSX.Element => {
  const rowDimValues = rows.toArray().map(([title, subDims]) => {
    return (
      <React.Fragment key={title}>
        <Cell isCellGroup className="TableRowDimensionTitle">
          <Cell>
            <span>{title}</span>
          </Cell>
          <Cell noPadding>
            {subDims.map(d => <Cell key={d}><span>{d}</span></Cell>)}
          </Cell>
        </Cell>
        <TableRowSubResult>{`${title} ${rowSubResultText}`}</TableRowSubResult>
      </React.Fragment>
    );
  });
  return <>{rowDimValues}</>;
};

export const TableColumnDimensionValues = ({
  columns,
  highlightLastColumn
}: {
  columns: ColumnDimensionValues;
  highlightLastColumn?: boolean;
}): JSX.Element => {
  const colDimValues = columns.toArray().map(([key, v], index) => {
    const finalResultIdx = v.length - 1;
    // By state
    return (
      <TableColumn key={key}>
        <TableColumnTitle>
          {key}
        </TableColumnTitle>
        {v.map((_v, idx) => {
          // By Category
          return _v.map((n, i) => {
            // Sub category totals
            const className = (highlightLastColumn && columns.size - 1 === index) ? 'isHighlighted' : ''
            let Component = i === _v.length - 1 ? TableRowSubResult : Cell;
            if (finalResultIdx === idx) {
              Component = TableRowFinalResult;
            }
            return (
              <React.Fragment key={`${key}-${n.toString()}-${i}`}>
                <Component className={className}>
                  <span>{prettifyNumber(n)}</span>
                </Component>
              </React.Fragment>
            );
          })
        })}
      </TableColumn>
    )
  });
  return <>{colDimValues}</>;
};

const PivotTable = ({ data, tableConfig }: PivotTableProps): JSX.Element => {
  const { rowDims, colMetrics } = data;
  const {
    rowTitle,
    colTitle,
    rowDimTitle,
    rowDimSubTitle,
    subResultText,
    finalResultText,
    highlightLastColumn,
    tableMetric
  } = tableConfig;
  return (
    <div className="TableContainer">
      <TableName>Sum of {tableMetric}</TableName>
      <Table>
        <TableRowDimensions>
          <TableHeader>
            <TableTitle>{rowTitle.toLocaleUpperCase()}</TableTitle>
          </TableHeader>
          <TableBody>
            <Cell className="TableColumnTitleGroup" isCellGroup noPadding>
              <TableColumnTitle>
                {rowDimTitle}
              </TableColumnTitle>
              <TableColumnTitle>
                {rowDimSubTitle}
              </TableColumnTitle>
            </Cell>
            <TableRowDimensionValues rows={rowDims} rowSubResultText={subResultText} />
            <TableRowFinalResult>{finalResultText}</TableRowFinalResult>
          </TableBody>
        </TableRowDimensions>
        <TableColumnDimensions scrollable>
          <TableHeader>
            <TableTitle>{colTitle.toLocaleUpperCase()}</TableTitle>
          </TableHeader>
          <TableBody>
            <TableColumnDimensionValues columns={colMetrics} highlightLastColumn={highlightLastColumn} />
          </TableBody>
        </TableColumnDimensions>
      </Table>
    </div>
  );
};

export default PivotTable;