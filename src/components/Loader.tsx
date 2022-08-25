import React from 'react';
import ReactLoader from 'react-spinners/GridLoader';

interface IProps {}

const Loader = (props: IProps) => {
  return (
    <div className='screen-overlay'>
      <ReactLoader
        speedMultiplier={0.8}
        size={15}
        color='#cc0088'
      />
    </div>
  );
};

export default Loader;
