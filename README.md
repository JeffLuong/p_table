# Pivot Table

Example of a pivot table using React + Typescript. Created using `create-react-app`.

## Running locally
First install all dependencies:
```
npm install
```
or if using yarn:
```
yarn
```
After all dependencies, you can run it locally by running:
```
yarn start
```
This will run the development build of the client on `localhost:3000`, all while compiling styles as well as watch for any changes made to the code.

### Running tests
If you want to run linting and unit tests, you can do so by running:
```
yarn test
```
This project uses __eslint__, and __Typescript__ for linting as well as __Jest__, __enzyme__ and __react-test-renderer__ for unit testing.

### Potential testing issue
You may run across an error when trying to run tests:
```
Error: fsEvents is not a function
```
If that's the case, please read [this issue within create-react-app](https://github.com/facebook/create-react-app/issues/8677) and follow the instructions to resolve it.

## Architecture
As is with most React apps this was built using the flux architectural design
```
<ProductSalesByStateTable /> (is mounted - hook fires action)
|
└-+-> /actions/orders (fetch/receive orders data)
  |
  └-+-> /reducers/orders (transform to immutable records and pass to store)
    |
    └-+-> <ProductSalesByStateTable /> (accesses store, formats data)
      |
      └-+-> <PivotTable /> (recieves formatted data and renders)
```
In the case of this project - actions are used to fetch and pass orders to dispatchers whom then broadcasts the payload to registered callbacks with the store. The store updates as a result of the retrieved data which allows the components to (re)render.

#### Core technologies and libraries used
- __React__: core framework
- __Redux__: global application state maintenance
- __React-redux__: hooks up app framework with global state
- __Typescript__: type checking and linting
- __Immutable.js__: transforming data without mutation

### Assumptions and simplifications

While working on this project, there were a few assumptions made:
1. The pivot table operation is SUM only and does not include UI sorting.
3. Data is fetched and loaded all at once (no pagination).
4. Row and column dimensions  should  be  configurable  via  any  string  data  attribute. (i.e. `state`, `category`, `city`, etc.)
5. Metric  should  only be  configurable  via  any  of  these  number  data  attributes:
	- `sales`
	- `quantity`
	- `profit`
	- `discount`

### Next steps / areas to improve:
- Use more semantic HTML for table (`table`, `thead`, `tbody`, `tr`, etc.)
- Implement "sticky" column header so when a user scrolls down, the user can still see what dimension the metric belongs to.
- Adjust formatting data algorithm to allow for other operations (multiply, average, etc.)