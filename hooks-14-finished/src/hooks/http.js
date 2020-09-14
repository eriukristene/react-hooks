import { useReducer, useCallback } from 'react';

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier
      };
    case 'RESPONSE':
      return {
        ...curHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra
      };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return initialState;
    default:
      throw new Error('Should not be reached!');
  }
};

// custom hooks!
// can use stateful features
// any component that uses this hook will run the code in here as if
// the code was directly in the component
// each time this hook is used in a component, it gets a snapshot of 
// what is in here
// components that use this hook share the logic, not the data
// so it can be used in many components
// your hook will get called wherever the component using the hook
// gets re-executed
const useHttp = () => {
  // sets up our state
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);

  // only execute this when sendRequest() is executed
  // useCallBack() to prevent unnecessary re-renders
  const sendRequest = useCallback(
    (url, method, body, reqExtra, reqIdentifer) => {
      dispatchHttp({ type: 'SEND', identifier: reqIdentifer });
      fetch(url, {
        method: method,
        body: body,
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          return response.json();
        })
        .then(responseData => {
          dispatchHttp({
            type: 'RESPONSE',
            responseData: responseData,
            extra: reqExtra
          });
        })
        .catch(error => {
          dispatchHttp({
            type: 'ERROR',
            errorMessage: 'Something went wrong!'
          });
        });
    },
    []
  );

  // return an object
  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest, // return a handle to this function as well
    reqExtra: httpState.extra, // Lesson 448
    reqIdentifer: httpState.identifier,
    clear: clear
  };
};

export default useHttp;
