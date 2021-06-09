import { gql } from "@apollo/client";

export const FETCH_POSTS_QUERY = gql`
query getPosts{
  getPosts{
    id
    body
    createdAt
    username
    likeCount
    likes{
      id
      username
    }
    commentCount
    comments {
      id
      username
      createdAt
      body
    }
  }
}
`;

  export const FETCH_POST = gql`
    query getPost( $postId: ID! ){
      getPost( postId: $postId ){
        id, body, createdAt, username, commentCount, likeCount,
        likes{
          username
        }
        comments{
          id, username, body, createdAt
        }
      }
    }
  `;

export const CREATE_POST = gql`
  mutation createPost( $body: String! ) {
    createPost( body: $body ) {
      id,
      body,
      createdAt,
      username,
      commentCount,
      likeCount,
    }
  }
`;

export const DELETE_POST = gql`
mutation deletePost( $postId: ID! ){
  deletePost( postId: $postId )
}
`;

export const LIKE_POST = gql`
  mutation toggleLikePost( $postId: ID! ) {
    toggleLikePost( postId: $postId ) {
      id,
      likes{
        id,
        username,
      },
      likeCount
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation createComment( $postId: ID!, $body: String! ) {
    createComment( postId: $postId, body: $body ) {
      id,
      comments{
        id, body, username, createdAt
      },
      commentCount,
    }
  }
`;

export const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment( $postId: ID!, $commentId: ID! ){
    deleteComment( postId: $postId, commentId: $commentId ){
      id
      comments{
        id,
        username,
        createdAt,
        body
      }
      commentCount
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login(
      $username:String!,
      $password:String!,
    ){
      login(
        username: $username,
        password: $password,
      ) {
        id,
        email,
        token,
        username,
        createdAt,
      }
    }
`;

export const REGISTER_USER = gql`
  mutation register(
      $username:String!,
      $email:String!,
      $password:String!,
      $confirmPassword:String!,
    ){
      register(
        registerInput: {
          username: $username,
          email: $email,
          password: $password,
          confirmPassword: $confirmPassword,
        }
      ) {
        id,
        email,
        token,
        username,
        createdAt,
      }
    }
`;
