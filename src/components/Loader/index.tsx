import * as React from 'react';
import './Loader.scss';

const Loader = (): JSX.Element => (
  <div className="Loader">
    <div className="LoaderCircle">
      <div className="LoaderHalfCircles" />
    </div>
  </div>
);

export default Loader;