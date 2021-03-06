const { ApolloServer, PubSub } = require( "apollo-server" );
const mongoose = require("mongoose");

const typeDefs = require( "./graphQl/typeDefs" );
const resolvers = require( "./graphQl/resolvers" );
const { MONGODB } = require( "./config" );

const pubsub = new PubSub();

const server = new ApolloServer( {
  typeDefs,
  resolvers,
  context: ( { req } ) => ( { req, pubsub } ),
});


mongoose.connect( MONGODB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } )
  .then( () => {
    console.log( "Connect to MongoDB" );
    return server.listen({ port: 5000 } );
  })
  .catch( err => console.log( "Database connection error: ", err ) )
  .then( res => console.log( `Server running at ${ res.url }`))
  .catch( err => console.log( "Server Error: ", err ) );
