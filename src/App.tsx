import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import ProductSalesByStateTable from './components/ProductSalesByStateTable';
import { LightTheme, DarkTheme } from './Theme';
import './App.scss';

const App = (): JSX.Element => {
  const [theme, setTheme] = React.useState(LightTheme);
  const toggleTheme = (): void => {
    setTheme(theme === LightTheme ? DarkTheme : LightTheme);
  };
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <ProductSalesByStateTable toggleTheme={toggleTheme} />
      </ThemeProvider>
    </div>
  );
};

export default App;
