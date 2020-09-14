import React from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Auxiliary from '../Auxiliary/Auxiliary';
import useHttpErrorHandler from '../../hooks/http-error-handler';

// was a higher order component that returns a class-based component
const withErrorHandler = (WrappedComponent, axios) => {
  return props => {
    // using a custom hook here, useHttpErrorHandler
    // array destructuring
    // pass in axios because useHttpErrorHandler, from our custom hook
    // expects the http client, axios in our case
    const [error, clearError] = useHttpErrorHandler(axios);

    return (
      <Auxiliary>
        <Modal show={error} modalClosed={clearError}>
          {error ? error.message : null}
        </Modal>
        <WrappedComponent {...props} />
      </Auxiliary>
    );
  };
};

export default withErrorHandler;
