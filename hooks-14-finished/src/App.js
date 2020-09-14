import React, { useContext } from 'react';

import Ingredients from './components/Ingredients/Ingredients';
import Auth from './components/Auth';
import { AuthContext } from './context/auth-context';

const App = props => {
  const authContext = useContext(AuthContext);

  // check to see if we are authenticated
  // if we are not, then render the Auth component page
  // if we are, then show the Ingredients component page
  let content = <Auth />;
  if (authContext.isAuth) {
    content = <Ingredients />;
  }

  return content;
};

export default App;
