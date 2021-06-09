import { useState } from "react";

const useForm = ( formValues = {}, callback ) => {
  const [ values, setValues ] = useState( () => formValues );
  const [ errors, setErrors ] = useState({});

  const handleFormChange = e => {
    const { name, value } = e.target;
    setValues( prevValues => {
      return {
        ...prevValues,
        [ name ]: value,
      }
    })
  }

  const handleFormSubmit = e => {
    e.preventDefault();
    setErrors({});
    callback();
  }

  const clearFormValues = () => {
    const newValues = { ...values };
    Object.keys( values ).forEach( key => newValues[ key ] = '' );
    setValues( newValues );
  }

  return{
    values,
    errors,
    handleErrors: setErrors,
    handleFormChange,
    handleFormSubmit,
    clearFormValues
  }
};

export default useForm;