import { useState, useEffect } from 'react';

// took a lot of this logic from withErrorHandler, it was there before
export default httpClient => {
    const [error, setError] = useState(null);

    const reqInterceptor = httpClient.interceptors.request.use(req => {
      setError(null);
      return req;
    });
    const resInterceptor = httpClient.interceptors.response.use(
      res => res,
      err => {
        setError(err);
      }
    );

    useEffect(() => {
      return () => {
        httpClient.interceptors.request.eject(reqInterceptor);
        httpClient.interceptors.response.eject(resInterceptor);
      };
    }, [reqInterceptor, resInterceptor]);

    const errorConfirmedHandler = () => {
      setError(null);
    };

    // returns the error we got and a function that allows us to
    // clear the error
    // with custom hooks
    // can have a hook that doesn't return anything
    // or could return something else, like a number, text, object, an
    // array with 5 objects, etc.
    // here we return an array with 2 elements
    return [error, errorConfirmedHandler];
}