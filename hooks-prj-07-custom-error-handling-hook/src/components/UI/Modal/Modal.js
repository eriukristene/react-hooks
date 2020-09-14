import React from 'react';

import classes from './Modal.css';
import Auxiliary from '../../../hoc/Auxiliary/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';

// was a class-based component
const modal = props => {
  // shouldComponentUpdate ( nextProps, nextState ) {
  //     return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
  // }

  return (
    <Auxiliary>
      <Backdrop show={props.show} clicked={props.modalClosed} />
      <div
        className={classes.Modal}
        style={{
          transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
          opacity: props.show ? '1' : '0'
        }}
      >
        {props.children}
      </div>
    </Auxiliary>
  );
};

// use React.memo to replace shouldComponentUpdate()
export default React.memo(
  modal,
  (prevProps, nextProps) =>
    nextProps.show === prevProps.show &&
    nextProps.children === prevProps.children
);
