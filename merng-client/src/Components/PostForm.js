import React from "react";
import { Grid, Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";

import useForm from "../Hooks/useForm";
import { FETCH_POSTS_QUERY, CREATE_POST } from "../Util/graphql";

const PostForm = props => {

  const {
    values,
    errors,
    handleErrors,
    handleFormChange,
    handleFormSubmit,
    clearFormValues,
  } = useForm(
    {
      body: '',
    },
  createPostHandler
  );

  const [ createPost, { loading } ] = useMutation( CREATE_POST,{
    update( proxy, result ) {
      let data = proxy.readQuery({ query: FETCH_POSTS_QUERY, });

      const newData = {
        ...data,
        getPosts: [
          ...data.getPosts,
          result.data.createPost,
        ]
      };
      proxy.writeQuery( { query: FETCH_POSTS_QUERY, data: newData } );
      clearFormValues();
    },
    onError( err ) {
      handleErrors( { body: err.graphQLErrors[ 0 ].message } );
    },
    variables: values,
  })

  function createPostHandler() {
    createPost();
  }

  return(
    <Grid.Row style={{
      "flexDirection": "column",
      "justifyContent": "center",
      "alignItems": "center"
    }} >
        <h2>Create a post</h2>
        <Form onSubmit={ handleFormSubmit } loading={ loading } >
          <Form.Field style={{
            "display":"flex",
            "flexDirection": "column",
            "justifyContent": "center",
            "alignItems": "center"
          }} >
            <Form.Input
              placeholder="Hi You!"
              name="body"
              onChange={ handleFormChange }
              value={ values.body }
              error={ errors.body }
            />
            <Button type="submit" color="teal">
              Submit
            </Button>
          </Form.Field>
        </Form>
    </Grid.Row >
  );
};

export default PostForm;