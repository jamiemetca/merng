const bcrypt = require( "bcryptjs" );
const jwt = require( "jsonwebtoken" );

const { SECRET_KEY } = require( "../../config" );
const User = require( "../../models/User" );
const { UserInputError } = require( "apollo-server" );
const { validateRegisterInput, validateUserLogin } = require( "../../util/validators" );

const generateToken = ( user ) => {
  return jwt.sign({
          id: user.id,
          email: user.email,
          username: user.username,
        },
        SECRET_KEY,
        {
          expiresIn: "1h"
        });
}

module.exports = {
  Mutation: {
    async login( _, args, context, info ){
      const { username, password } = args;

      // Validate login data
      const { errors, valid } = validateUserLogin( username, password );
      if( !valid ) {
        throw new UserInputError( "Errors", { errors } );
      }
      const user = await User.findOne( { username } );

      if( !user ) {
        errors.general = "User not found";
        throw new UserInputError( "User not found", { errors } );
      }
      const passwordsMatch = await bcrypt.compare( password, user.password );
      if( !passwordsMatch ) {
        errors.general = "Wrong credentials"
        throw new UserInputError( "Wrong credentials", { errors } );
      }

      const token = generateToken( user );

      return {
        ...user._doc,
        id: user._id,
        token
      }

    },
    async register( _, args, context, info) {

      const { registerInput: {
        username,
        password,
        confirmPassword,
        email,
      } } = args;

      //Validate user data

      const { errors, valid } = validateRegisterInput(  username, email, password, confirmPassword );

      if( !valid ) {
        throw new UserInputError( "Errors", { errors } );
      }

      // Make sure user doesn't already exist

      const user = await User.findOne({ username })
      if( user ) {
        throw new UserInputError( "Username is taken",{
          errors: {
            username: "This username is taken"
          }
        } );
      }
      // hash password and create auth token
      
      let hashedPassword = await bcrypt.hash( password, 12 );

      const newUser = new User({
        email,
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();

      const token = generateToken( res );

      return {
        ...res._doc,
        id: res._id,
        token
      }
    }
  }
}
