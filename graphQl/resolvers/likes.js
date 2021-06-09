const Post = require( "../../models/Post" );
const { UserInputError } = require( "apollo-server" );

const { validateId } = require( "../../util/validateId" );
const { checkAuth } = require( "../../util/check-authentication" );

module.exports = {
  Mutation: {
    async toggleLikePost( parent, args, context, info ) {
      try{
        const { postId } = args;
        validateId( postId );

        const { username } = checkAuth( context );

        const post = await Post.findById( postId );
        
        if( post ) {
          let found = false;
          post.likes = post.likes.filter( like => {
            if ( like.username === username ) {
              found = true;
              return false;
            }
            return true;
          });
          if( !found ) {
            const newLike = {
              username,
              createdAt: new Date().toISOString(),
            }
            post.likes.unshift( newLike );
          }

          await post.save();
          return post;
        }
        throw UserInputError( "Post not found" );
      }
      catch ( err ) {
        throw new Error( err );
      }

    }
  }
}