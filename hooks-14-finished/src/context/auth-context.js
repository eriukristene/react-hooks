import React, { useState } from 'react';

// context API offered by react
// also in the component deep dive section
export const AuthContext = React.createContext({
  // manage if we are authenticated or not
  isAuth: false,
  login: () => {}
});

// begin component code
const AuthContextProvider = props => {
  // iniitalize the isAuthenticated with a false value
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loginHandler = () => {
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider
      value={{ login: loginHandler, isAuth: isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;