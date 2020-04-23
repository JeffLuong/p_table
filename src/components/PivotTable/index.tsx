import * as React from 'react';
import cx from 'classnames';
import styled, { DefaultTheme, ThemeConsumer } from 'styled-components';
import type { FormattedData, ColumnMetrics, RowKeyValues } from '../ProductSalesByStateTable';
import { LightTheme, DarkTheme } from '../../Theme';
import './PivotTable.scss';

type PivotTableProps = {
  data: FormattedData;
  toggleTheme: () => void;
  config: {
    rowTitle: string;
    colTitle: string;
    rowKeyTitle: string;
    rowSubKeyTitle: string;
    subResultText: string;
    finalResultText: string;
    metric: string;
  };
};

type TDefProps = {
  children: React.ReactNode;
  className?: string;
  style?: {};
};

interface TableColDimsWrapperProps extends TDefProps {
  scrollable?: boolean;
}

interface CellProps extends TDefProps {
  isCellGroup?: boolean;
  noPadding?: boolean;
}

interface ThemedProps extends TDefProps {
  theme: DefaultTheme;
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

const BaseCell = ({ className, isCellGroup, children, noPadding, ...rest }: CellProps): JSX.Element => {
  const classes = cx(
    'Cell',
    isCellGroup ? 'CellGroup' : '',
    noPadding ? 'noPadding' : '',
    className
  );
  return <div className={classes} {...rest}>{children}</div>;
};

const Cell = styled(BaseCell)`
  ${({ theme }: ThemedProps): string => {
    return `
      background-color: ${theme.cell.bg};

      &.isHighlighted {
        background-color: ${theme.cell.accentBg};
        font-weight: 700;
      }
    `;
  }};
`;

const Button = styled.button`
  transition: background-color .125s ease-in-out;
  height: 100%;
  background-color: transparent;
  color: white;
  border-color: white;
  padding: .5rem 1.25rem;
  font-weight: 600;
  font-size: .75rem;
  border-radius: .25rem;
  cursor: pointer;
  outline: none;
  border-style: solid;

  &:hover {
    background-color: rgba(255, 255, 255, .175);
  }
`;

const BaseTableContainer = ({ children, className }: TDefProps): JSX.Element => (
  <div className={cx('TableContainer', className)}>{children}</div>
);

const TableContainer = styled(BaseTableContainer)`
  background-color: ${({ theme }: ThemedProps): string => theme.tableBg};
`;

export const Span = styled.span`
  color: ${({ theme }: ThemedProps): string => theme.text.body};
`;

const Table = ({ children }: TDefProps): JSX.Element => <div className="Table">{children}</div>;

const TableName = ({ children }: TDefProps): JSX.Element => <div className="TableName">{children}</div>;

const TableHeader = ({ children }: TDefProps): JSX.Element => <div className="TableHeader">{children}</div>;

const TableTitle = ({ children }: TDefProps): JSX.Element => <Cell><h3 className="TableTitle">{children}</h3></Cell>;

const TableColumnTitle = ({ children }: TDefProps): JSX.Element => (
  <Cell><Span className="TableColumnTitle">{children}</Span></Cell>
);

const TableBody = ({ children }: TDefProps): JSX.Element => <div className="TableBody">{children}</div>;

const TableRowKeys = ({ children }: TDefProps): JSX.Element => <div className="TableRowKeys">{children}</div>;

const BaseTableRowSubResult = ({ children, className }: TDefProps): JSX.Element => {
  return <Cell className={cx('TableRowSubResult', className)}><Span>{children}</Span></Cell>;
};

const TableRowSubResult = styled(BaseTableRowSubResult)`
  ${({ theme }: ThemedProps): string => {
    return `
      background-color: ${theme.cell.accentBg};

      &.isHighlighted {
        background-color: ${theme.cell.primaryHighlightBg};
        font-weight: 700;
      }
    `;
  }};
`;

const BaseTableRowFinalResult = ({ children, className, style }: TDefProps): JSX.Element => {
  return <Cell style={style} className={cx('TableRowFinalResult', className)}>{children}</Cell>;
};

const TableRowFinalResult = styled(BaseTableRowFinalResult)`
  ${({ theme }: ThemedProps): string => {
    return `
      background-color: ${theme.cell.secondaryHighlightBg};

      &.isHighlighted {
        background-color: ${theme.cell.secondaryHighlightBg};
      }

      > span {
        font-weight: 700;
      }
    `;
  }}
`;

const TableColumns = ({ children, scrollable }: TableColDimsWrapperProps): JSX.Element => {
  return <div className={`TableColumns ${scrollable ? 'isScrollable' : ''}`}>{children}</div>;
};

const TableColumn = ({ children }: TDefProps): JSX.Element => <div className="TableColumn">{children}</div>;

export const TableRowKeyValues = ({
  rows,
  rowSubResultText
}: {
  rows: RowKeyValues;
  rowSubResultText: string;
}): JSX.Element => {
  return (
    <>
      {rows.map(([title, subDims]) => {
        return (
          <React.Fragment key={title}>
            <Cell isCellGroup className="TableRowKeyTitle">
              <Cell>
                <Span>{title}</Span>
              </Cell>
              <Cell noPadding>
                {subDims.map(d => <Cell key={d}><Span>{d}</Span></Cell>)}
              </Cell>
            </Cell>
            <TableRowSubResult>
              <Span>{`${title} ${rowSubResultText}`}</Span>
            </TableRowSubResult>
          </React.Fragment>
        );
      })}
    </>
  );
};

export const TableColumnMetrics = ({
  columns
}: {
  columns: ColumnMetrics;
}): JSX.Element => {
  return (
    <>
      {columns.map(([key, v], index) => {
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
                const className = columns.length - 1 === index ? 'isHighlighted' : ''
                let Component = i === _v.length - 1 ? TableRowSubResult : Cell;
                if (finalResultIdx === idx) {
                  Component = TableRowFinalResult;
                }
                return (
                  <React.Fragment key={`${key}-${n.toString()}-${i}`}>
                    <Component className={className}>
                      <Span>{prettifyNumber(n)}</Span>
                    </Component>
                  </React.Fragment>
                );
              })
            })}
          </TableColumn>
        )
      })}
    </>
  );
};

const PivotTable = ({ data, config, toggleTheme }: PivotTableProps): JSX.Element => {
  const { rowKeyValues, colMetrics } = data;
  const {
    rowTitle,
    colTitle,
    rowKeyTitle,
    rowSubKeyTitle,
    subResultText,
    finalResultText,
    metric
  } = config;
  return (
    <ThemeConsumer>
      {(theme): JSX.Element => (
        <TableContainer theme={theme}>
          <TableName>
            <h1>Sum of {metric}</h1>
            <div>
              <Button onClick={toggleTheme}>
                {theme === LightTheme ? 'Dark Mode' : 'Light Mode'}
              </Button>
            </div>
          </TableName>
          <Table>
            <TableRowKeys>
              <TableHeader>
                <TableTitle>{rowTitle.toLocaleUpperCase()}</TableTitle>
              </TableHeader>
              <TableBody>
                <Cell className="TableColumnTitleGroup" isCellGroup noPadding>
                  <TableColumnTitle>
                    {rowKeyTitle}
                  </TableColumnTitle>
                  <TableColumnTitle>
                    {rowSubKeyTitle}
                  </TableColumnTitle>
                </Cell>
                <TableRowKeyValues rows={rowKeyValues} rowSubResultText={subResultText} />
                <TableRowFinalResult style={{ paddingBottom: '2rem' }}>
                  <Span>{finalResultText}</Span>
                </TableRowFinalResult>
              </TableBody>
            </TableRowKeys>
            <TableColumns scrollable>
              <TableHeader>
                <TableTitle>{colTitle.toLocaleUpperCase()}</TableTitle>
              </TableHeader>
              <TableBody>
                <TableColumnMetrics columns={colMetrics} />
              </TableBody>
            </TableColumns>
          </Table>
        </TableContainer>
      )}
    </ThemeConsumer>
  );
};

export default PivotTable;