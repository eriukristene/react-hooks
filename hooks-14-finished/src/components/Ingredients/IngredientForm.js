import React, { useState } from 'react';

import Card from '../UI/Card';
import LoadingIndicator from '../UI/LoadingIndicator';
import './IngredientForm.css';

// React.memo helps to prevent unnecessay re-renders
const IngredientForm = React.memo(props => {
  // useState() is the most important hook
  // can hold any value, like a boolean or object
  // whereas before in class-based components, state had to be an object
  // allows returns an array with exactly 2 elements
  // 1st element - current state snapshot
  // 2nd element - a function that allows you to update your current state
  // array destructuring Lesson 429
  // can use multiple useState() here as opposed to one state in class-based components
  
  // here, two separate strings which are managing the state
  // recommended way
  // split your state into multiple useState()
  // only use objects or arrays as values for your state
  // especially if you have stuff that needs to update
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');
  console.log('RENDERING INGREDIENT FORM');

  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({ title: enteredTitle, amount: enteredAmount });
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={enteredTitle}
              onChange={event => {
                setEnteredTitle(event.target.value);
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={enteredAmount}
              onChange={event => {
                setEnteredAmount(event.target.value);
              }}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {/* load the LoadingIndicator if props.loading is true */}
            {props.loading && <LoadingIndicator />}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
