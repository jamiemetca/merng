import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Grid, Transition } from "semantic-ui-react";

import PostCard from "../Components/PostCard";
import PostForm from "../Components/PostForm";
import classes from "./Home.module.css";
import { AuthContext } from "../Context/Auth";
import {
  FETCH_POSTS_QUERY,
 } from "../Util/graphql";

const Home = props => {
  const { loading, data: { getPosts: posts } = {} } = useQuery( FETCH_POSTS_QUERY );
  const { user } = useContext( AuthContext );

  let postForm = null;
  if( user ) {
    postForm = <PostForm />;
  }
  let postsContent = <h2>Loading posts...</h2>;
  if( !loading && posts ) {

    postsContent = (
      posts?.map( post => {
            return (
              <Grid.Column key={ post.id } style={{ marginBottom: 20 }}>
                <PostCard post={ post } />
              </Grid.Column>
            )
      })
    )

  }

  return (
    <Grid columns={3}>
      <Grid.Row>
        <h1 className={ classes.title }>Recent Posts</h1>
      </Grid.Row>
      { postForm }
      <Grid.Row>
        <Transition.Group>
          { postsContent }
        </Transition.Group>
      </Grid.Row>
      </Grid>
  );
};

export default Home;