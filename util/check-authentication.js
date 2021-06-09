const { AuthenticationError } = require( "apollo-server" );
const jwt = require( "jsonwebtoken" );

const { SECRET_KEY } = require( "../config" );

const checkAuth = context => {

  const authorization = context.req.headers.authorization;
  if( authorization ){
    const token = authorization.split( "Bearer " )[ 1 ];

    if( token ) {
      try {
        const user = jwt.verify( token, SECRET_KEY );
        return user;
      }
      catch ( err ) {
        throw new AuthenticationError( err );
      }
    }
      throw new Error( "Authentication token must be 'Bearer [token]'" );
  }
    throw new Error( "Authorization header must be provided" );

}

module.exports = {
  checkAuth
}