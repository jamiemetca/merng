import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import { AuthContext } from "../Context/Auth";

const AuthRoute = props => {
  const { user } = useContext( AuthContext );
  const { component: Component, ...rest } = props;

  return(
    <Route
      { ...rest }
      render={
        props => user ? <Redirect to='/' /> : <Component { ...props } />
      }
    />
  );
};

export default AuthRoute;