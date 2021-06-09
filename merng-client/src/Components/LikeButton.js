import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Button, Icon, Label } from "semantic-ui-react";

import { LIKE_POST } from "../Util/graphql";
const LikeButton = props => {
  const [ liked, setLiked ] = useState( false );
  const { post: { id, likeCount, likes }, user } = props;

  useEffect( () => {
    if( user ) {
      const isLiked = likes.find( like => like.username === user.username ) 
      setLiked( !!isLiked );
    }
  }, [ user, likes ] );
  
  const linkInfo = user ? {} : { as: Link, to: "/login" };

  const [ likePost ] = useMutation( LIKE_POST,{ variables: { "postId": id }})


  return (<Button as='div' labelPosition='right' onClick={ likePost }>
    <Button { ...linkInfo } color='teal' basic={ !liked } >
      <Icon name='heart' />
    </Button>
    <Label basic color='teal' pointing='left'> { likeCount } </Label>
  </Button>
  )

};

export default LikeButton;