import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';
import './Search.css';

const Search = React.memo(props => {
  // object destructuring
  const { onLoadIngredients } = props;
  // array destructuring
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();
  // custom hook here
  // Lesson 449
  const { isLoading, data, error, sendRequest, clear } = useHttp();

  useEffect(() => {
    // closures Lesson 438
    // will only do a request after a certain amount of time
    // so it isn't constantly sending requests as people type
    // will wait until they are done typing to look in the database
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ''
            // firebase specific syntax
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        sendRequest(
          'https://react-my-burger-7d58a.firebaseio.com/ingredients.json' + query,
          'GET'
        );
      }
    }, 500);
    // cleanup function
    // cleans up the old timer before the next one runs
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, inputRef, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }
      onLoadIngredients(loadedIngredients);
    }
  }, [data, isLoading, error, onLoadIngredients]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
