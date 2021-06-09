const { AuthenticationError } = require( "apollo-server" );
const mongoose = require( "mongoose" );
const ObjectId = mongoose.Types.ObjectId;

const Post = require( "../../models/Post" );
const { checkAuth } = require( "../../util/check-authentication" );

module.exports = {
  Query: {
    async getPosts() {
      try{
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      }
      catch ( err ) {
        throw new Error( err );
      }
    },
    async getPost( _, { postId } ){
      try{
        if( !ObjectId.isValid( postId ) ) {
          throw new Error( "Post ID not valid Hexadecimal" );
        }
        const post = await Post.findById( postId );
        if( post ) {
          return post;
        }
        else{
          throw new Error( "Post not found" );
        }
      }
      catch( err ) {
        throw new Error( err );
      }
    }
  },
  Mutation: {
    async createPost( parent, args, context, info ) {
      const { body } = args
      const user = checkAuth( context );

      if( body.trim() === "" ) {
        throw new Error( "Post body must not be empty" );
      }

      const newPost = Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      })

      const post = await newPost.save();

      context.pubsub.publish( "NEW_POST",{
        newPost: post
      })

      return post;
    },
    async deletePost( parent, args, context, info ) {
      const { postId } = args;
      try {
        if( !ObjectId.isValid( postId ) ) {
          throw new Error( "Post not found" );
        }
        
        const user = checkAuth( context );
        const post = await Post.findById( postId );

        if( !post ) {
          throw new Error( "Post not found" );
        }

        if( post.user.toString() !== user.id ) {
          throw new AuthenticationError( "Action not allowed" );
        }

        await Post.deleteOne( post );
        return "Post deleted successfully";
      }
      catch ( err ) {
        throw new Error( err );
      }
    }
  },
  Subscription: {
    newPost: {
      subscribe: ( _, __, { pubsub } ) => pubsub.asyncIterator( "NEW_POST" ),
    }
  }
}
