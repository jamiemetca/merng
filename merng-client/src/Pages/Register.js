import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";

import Errors from "../Components/Errors";
import useForm from "../Hooks/useForm";
import { AuthContext } from "../Context/Auth";
import { REGISTER_USER } from "../Util/graphql";

import classes from "./RegisterLogin.module.css";

const Register = props => {
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
      email: '',
      password: '',
      confirmPassword: '',
    },
  registerUserHandler
  );

  const [ registerUser, { loading } ] = useMutation( REGISTER_USER, {
    update( cache, result ) {
      const { register: userData } = result.data;
      login( userData );
      history.push( '/' );
    },
    onError( err ){
      handleErrors( err.graphQLErrors[ 0 ].extensions.exception.errors );
    },
    variables: values,
  });

  function registerUserHandler() {
    registerUser();
  }


  return (
    <div className={ classes.form } >
    <Form
      onSubmit={ handleFormSubmit }
      loading={ !!loading }
    >
    <h1>Register</h1>
      <Form.Input
        type="text"
        label="Username"
        placeholder="Username..."
        name="username"
        value={ values.username }
        onChange={ handleFormChange }
        error={ errors.username }
      />
      <Form.Input
        type="email"
        label="Email"
        placeholder="Email..."
        name="email"
        value={ values.email }
        onChange={ handleFormChange }
        error={ errors.email }
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
      <Form.Input
        type="password"
        label="Confirm Password"
        placeholder="Confirm Password..."
        name="confirmPassword"
        value={ values.confirmPassword }
        onChange={ handleFormChange }
        error={ errors.confirmPassword }
      />
      <Button type="Submit" primary>
        Register
      </Button>
    </Form>
    { !!Object.keys( errors ).length && <Errors errors={ errors } /> }
    </div>
  );
};

export default Register;