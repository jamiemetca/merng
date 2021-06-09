import React, { createContext, useReducer } from "react";
import jwtDecode from "jwt-decode";

const initialState = {
  user: null,
  login: userData => {},
  logout: () => {},
}

if( localStorage.getItem( "jwtToken" ) ) {
  const decodedToken = jwtDecode( localStorage.getItem( "jwtToken" ) );
  if( decodedToken.exp * 1000 < Date.now() ) {
    localStorage.removeItem( "jwtToken" );
  }
  else {
    initialState.user = decodedToken;
  }
}

const AuthContext = createContext( initialState );

const reducerTypes = {
  login: "LOGIN",
  logout: "LOGOUT",
}

const authReducer = ( state, action ) => {
  switch( action.type) {
    case ( reducerTypes.login ):
      return {
        ...state,
        user: action.payload,
      };
    case ( reducerTypes.logout ):
      return {
        ...state,
        user: null,
      }
    default:
      return state;
  }
}


const AuthProvider = props => {
  const [ state, dispatch ] = useReducer( authReducer, initialState );

  const login = userData => {
    localStorage.setItem( "jwtToken", userData.token );
    dispatch({
      type: reducerTypes.login,
      payload: userData
    })
  }

  const logout = () => {
    localStorage.removeItem( "jwtToken" );
    dispatch({
      type: reducerTypes.logout
    })
  }

  return <AuthContext.Provider value={{ user: state.user , login, logout }} { ...props } />;
};

export {
  AuthContext,
  AuthProvider
}