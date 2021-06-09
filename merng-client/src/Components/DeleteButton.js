import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Button, Icon, Confirm } from "semantic-ui-react";

import { DELETE_POST, DELETE_COMMENT_MUTATION, FETCH_POSTS_QUERY } from "../Util/graphql";

const DeleteButton = props => {
  const history = useHistory();
  const isMounted = useRef( false );
  const [ confirmOpen, setConfirmOpen ] = useState( false );
  const { postId, commentId } = props;

  useEffect( () => {
    isMounted.current = true;
    return () => isMounted.current = false;
  })

  const handleSetConfirmOpen = bool => {
    if( isMounted.current ) {
      setConfirmOpen( bool );
    }
  }

  let DELETE_MUTATION = DELETE_POST;
  if( commentId ) {
    DELETE_MUTATION = DELETE_COMMENT_MUTATION;
  }

  const [ deletePostOrComment ] = useMutation( DELETE_MUTATION, {
    variables: { postId, commentId },
    update( proxy, result ) {
      handleSetConfirmOpen( false );
      if( !commentId ) {
        console.log("commendId not present, proxy.modify running...")
        proxy.modify({
          fields: {
            getPosts( existingPostRefs, { readField }) {
              return existingPostRefs.filter( postRef => postId !== readField("id", postRef ));
            }
          }
        })
        history.push('/');
      }
      else{
        const postIDGen = proxy.identify(result.data.deleteComment);
        console.log("result: ", result )
        console.log("postIdGen", postIDGen )
        proxy.modify({
          id: proxy.identify(result.data.deleteComment),
          fields: {
            comments(existingCommentRefs, { DELETE }) {
              console.log("existing comments ref: ", existingCommentRefs)
              return DELETE;
            },
          },
        });

        // const cachedPosts = proxy.readQuery({ query: FETCH_POSTS_QUERY })
        // if( cachedPosts && cachedPosts.getPosts ) {

        //   const newData = [
        //     ...cachedPosts.getPosts.map( post => post.id === postId ? { ...post, ...result.data.deleteComment } : post )
        //   ];
        //   proxy.writeQuery({
        //     query: FETCH_POSTS_QUERY,
        //     data: { getPosts: newData },
        //   })
        //   proxy.evict({ id: commentId, fieldName: "comments" })
        // }
      }
    }
  })

  return (
    <>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={ () => handleSetConfirmOpen( true ) }
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      <Confirm
        open={confirmOpen}
        onCancel={() => handleSetConfirmOpen(false)}
        onConfirm={ deletePostOrComment }
      />
    </>
  )
};

export default DeleteButton;