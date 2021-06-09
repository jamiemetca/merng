const { UserInputError, AuthenticationError } = require( "apollo-server" );

const Post = require( "../../models/Post" );
const { validateId } = require( "../../util/validateId" );
const { checkAuth } = require( "../../util/check-authentication" );

module.exports = {
  Mutation: {
    async createComment( parent, args, context, info ) {
      try{
        const { postId, body } = args;

        validateId( postId );

        const { username } = checkAuth( context );
        
        if( body.trim() === '' ) {
          throw new UserInputError( "Empty comment",{
            errors: {
              body: "Comment body must not be empty",
            }
          } );
        }

        const post = await Post.findById( postId );
        if( post) {
          const newComment = {
            body,
            username,
            createdAt: new Date().toISOString(),
          };
          post.comments.unshift( newComment );
          await post.save()
          return post;
        }
        throw new UserInputError( "Post not found" )
      }
      catch ( err ) {
        throw new Error( err );
      }
    },
    async deleteComment( parent, args, context, info ) {
      try{
        const { postId, commentId } = args;
        validateId( postId );
        validateId( commentId );

        const { username } = checkAuth( context );
        const post = await Post.findById( postId );

        if( post ) {
          let commentFound = false;

          post.comments = post.comments.filter( comment => {
            if( comment.username === username && comment.id === commentId ) {
              commentFound = true;
              return false
            }
            return comment;
          })

          if( commentFound ) {
            await post.save();
            return post;
          }
          throw new AuthenticationError( "Action not allowed" );

        }
        throw new UserInputError( "Post not found" );
      }
      catch ( err ) {
        throw new Error( err );
      }
    }
  }
}