import * as React from 'react';
import './App.scss';
import ProductSalesByStateTable from './components/ProductSalesByStateTable';

// declare module '*.scss';

const App = (): JSX.Element => (
  <div className="App">
    <ProductSalesByStateTable />
  </div>
);

export default App;
