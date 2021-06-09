import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";

import Errors from "../Components/Errors";
import useForm from "../Hooks/useForm";
import { AuthContext } from "../Context/Auth";
import { LOGIN_USER } from "../Util/graphql";

import classes from "./RegisterLogin.module.css";

const Login = props => {
  const history = useHistory();
  const { login } = useContext( AuthContext );

  const {
    values,
    errors,
    handleErrors,
    handleFormChange,
    handleFormSubmit
  } = useForm(
    {
      username: '',
      password: '',
    },
    loginUserHandler
  );

  const [ loginUser, { loading } ] = useMutation( LOGIN_USER, {
    update( cache, result ) {
      const { login: userData } = result.data;
      login( userData );
      history.push( '/' );
    },
    onError( err ) {
      handleErrors( err.graphQLErrors[ 0 ].extensions.exception.errors );
    },
    variables: values,
  } );

  function loginUserHandler() {
    loginUser();
  }

  return (
    <div
      className={ classes.form }
    >
    <Form
      onSubmit={ handleFormSubmit }
      loading={ !!loading }
    >
    <h1>Login</h1>
      <Form.Input
        type="username"
        label="Username"
        placeholder="Username..."
        name="username"
        value={ values.username }
        onChange={ handleFormChange }
        error={ errors.username }
      />
      <Form.Input
        type="password"
        label="Password"
        placeholder="password..."
        name="password"
        value={ values.password }
        onChange={ handleFormChange }
        error={ errors.password }
      />
      <Button disabled={ loading } type="Submit" primary>
        Login
      </Button>
    </Form>
    { !!Object.keys( errors ).length && <Errors errors={ errors } /> }
    </div>
  );
};

export default Login;