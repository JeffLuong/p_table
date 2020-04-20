import * as React from 'react';

const Loader = (): JSX.Element => {
  return (
    <div className="Loader">
      <div className="LoaderCircle">
        <div className="LoaderHalfCircles" />
      </div>
    </div>
  );
};

export default Loader;