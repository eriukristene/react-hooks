import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
// have to use the word use in hooks
import useHttp from '../../hooks/http';

// stores a function
// action is important for updating the state
// not recreated every time the component re-renders
// reducer should return something, in this case, new ingredients
// a new array of new ingredients which will replace the old state
const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      // delete ingredients based on checking their id
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there!');
  }
};

const Ingredients = () => {
  // userIngredients is the state
  // dispatch is the method to set our userIngredients
  // this is the function we will call to dispatch actions later
  // where we dispatch the action objects which are handled by the reducer
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  // object destructuring, to store these in separate constants
  const {
    isLoading,
    error,
    data,
    sendRequest,
    reqExtra,
    reqIdentifer,
    clear
  } = useHttp();

  // here to manage side effect, such as an HTTP request
  // gets executed after every component render cycle
  // AFTER and FOR EVERY render cycle
  // Lesson 434
  useEffect(() => {
    // Lesson 448
    if (!isLoading && !error && reqIdentifer === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: reqExtra });
    } else if (!isLoading && !error && reqIdentifer === 'ADD_INGREDIENT') {
      dispatch({
        type: 'ADD',
        ingredient: { id: data.name, ...reqExtra }
      });
    }
    // allows you to control when this function will run
    // will only run when any of these change NB!
  }, [data, reqExtra, reqIdentifer, isLoading, error]);

  // in search component below
  // need to useCallBack() to prevent an infinite loop
  // caches the function for you
  // so it survives the re-render cycles and is not rerun all the time
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  // wrap entire handler with useCallBack()
  // to make sure we are not completely rebuilding this function
  // during each re-render cycle
  // if it does not change during the re-render cycle, it will not run
  // or be rebuilt
  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      //'https://react-hooks-update.firebaseio.com/ingredients.json',
      'https://react-my-burger-7d58a.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    );
  }, [sendRequest]);

  // same as above with useCallBack()
  const removeIngredientHandler = useCallback(
    ingredientId => {
      sendRequest(
        // string interpolation with backticks
        `https://react-hooks-update.firebaseio.com/ingredients/${ingredientId}.json`,
        'DELETE',
        null,
        ingredientId,
        'REMOVE_INGREDIENT'
      );
    },
    [sendRequest]
  );

  // a function that will return the value that react will memorize for you
  // will execute a function which will return the value you want memorized
  // alternative to React.memo()
  // use if you don't want something to be recalculated every time the
  // component re-renders (which it would be recalculated each time a component
  // re-renders if you use React.memo)
  // an optimization tool, but think about it if you need it and where
  // Lesson 446
  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
    // dependencies, will tell react to create a new list if any of these change
    // will tell react when to rerun this function to create a new object
    // that it should memorize
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
