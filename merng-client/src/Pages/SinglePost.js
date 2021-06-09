import React, { useContext, useState, useRef } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Grid, Card, Image, Button, Icon, Label, Form } from "semantic-ui-react";
import moment from "moment";

import { AuthContext } from "../Context/Auth";
import LikeButton from "../Components/LikeButton";
import DeleteButton from "../Components/DeleteButton";
import { FETCH_POST, CREATE_COMMENT } from "../Util/graphql";

const SinglePost = props => {
  const postId = props.match.params.postId;
  const { user } = useContext( AuthContext );
  const [ comment, setComment ] = useState('');
  const commentInputRef = useRef();

  
  const { data: { getPost } = {} } = useQuery( FETCH_POST, { variables: { postId }, } );
  const [ createComment ] = useMutation( CREATE_COMMENT, {
    variables: { postId, body: comment },
    update() {
      setComment('');
      commentInputRef.current.blur();
    }
  })

  let postMarkup;
  if (!getPost) {
    postMarkup = <p>Loading post..</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      likes,
      likeCount,
      commentCount,
      comments
    } = getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>

                <LikeButton user={user} post={{ id, likeCount, likes }} />

                {/* Comment button */}
                <Button
                  as="div"
                  labelPosition="right"
                  onClick={() => console.log('Comment on post')}
                >
                  <Button basic color="blue">
                    <Icon name="comments" />
                  </Button>
                  <Label basic color="blue" pointing="left">
                    {commentCount}
                  </Label>
                </Button>

                { user?.username === username && <DeleteButton postId={ id } /> }

              </Card.Content>
            </Card>

            {/* Create comment */}
            { user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment..."
                        name="comment"
                        value={ comment }
                        onChange={ e => setComment( e.target.value ) }
                        ref={ commentInputRef }
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={ comment.trim() === '' }
                        onClick={ createComment }
                      >Submit</button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}

            {/* Comments */}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}

          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
};

export default SinglePost;